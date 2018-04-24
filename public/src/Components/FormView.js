import React from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

// https://www.apollographql.com/docs/react/essentials/mutations.html

// import Spinner from './Spinner';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
// import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
// import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
// import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
// import { Slider } from 'office-ui-fabric-react/lib/Slider';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import getFieldConfig from '../utils/getFieldConfig';
import antValidation from 'antvalidation';

const getMutationArgs = (_args) => {
    const args = _args.map(arg => {
        return `$${arg.name}: ${arg.type}`
    });

    return args.join(', ');
};

const getMutationFragmentArgs = (_args) => {
    const args = _args.map(arg => {
        return `${arg.name}: $${arg.name}`
    });

    return args.join(', ');
};

const getResultValueNames = (_returnValue) => {
    const names = _returnValue.fields.reduce((acc, field) => {
        let fieldString = field.name;

        if (field.type === 'List') {
            fieldString += ` {
                id
            }`;
        }

        acc.push(fieldString);
        return acc;
    }, []);

    return names.join('\n');
};

const getErrorMessage = (field, value) => {
    value =  value + ''; //only strings can be validated

    const ants = field.description || '';
    const errors = antValidation({ants, value});
    return errors.join('\n');
};

const formData = {};

const getFieldsFromArguments = (_args) => {
    const elements = _args.map(field => {
        const fieldConfig = getFieldConfig(field);
        const defaultValue = fieldConfig.default !== undefined ? fieldConfig.default : '';
        const NoUI = fieldConfig.noui;

        return (!NoUI &&
            <div key={`field_${field.name}`}>
                <TextField
                    placeholder="Please fill"
                    label={field.name}
                    description={field.description}
                    value={defaultValue}
                    onGetErrorMessage={ (value) => getErrorMessage(field, value) }
                    deferredValidationTime={400}
                    disabled={fieldConfig.nouserinput}
                    onChanged={ (value) => { formData[field.name] = value } }
                />
            </div>
        )
    });

    return elements;
};


export default (type) => {
    const args = getMutationArgs(type.arguments);
    const fragArgs = getMutationFragmentArgs(type.arguments);
    const returnValueNames = getResultValueNames(type.returnType);
    const uiFields = getFieldsFromArguments(type.arguments);

    const QL = `
        mutation ${type.name}(${args}) {
            ${type.name}(${fragArgs}) {
              ${returnValueNames}
            }
        }
    `;

    const MUTATION_QL = gql`${QL}`;

    class FormView extends React.Component {

        render() {
            return (
                <Mutation mutation={MUTATION_QL}>
                    {(createProduct, { data }) => (
                        <div>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    createProduct({ variables: formData });
                                }}
                            >

                                { uiFields }

                                <button type="submit">Add Todo</button>

                                <div>{ JSON.stringify(data) }</div>
                            </form>
                        </div>
                    )}
                </Mutation>
            );
        }
    }


    return FormView;
}

