import React from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import FormFields from "./FormFields";
import Details from './Details';

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

const formData = {};


export default (type) => {
    const args = getMutationArgs(type.arguments);
    const fragArgs = getMutationFragmentArgs(type.arguments);
    const returnValueNames = getResultValueNames(type.returnType);

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
                            <FormFields
                                type={type}
                                formData={formData}
                                onSubmit={ (formData) => createProduct({ variables: formData }) }
                            />

                            <div>
                                <Details entity={data} />
                            </div>
                        </div>
                    )}
                </Mutation>
            );
        }
    }

    return FormView;
}

