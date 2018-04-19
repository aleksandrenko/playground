import React from 'react';
import gql from "graphql-tag";
import {graphql} from "react-apollo/index";

import Spinner from './Spinner';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
import { Slider } from 'office-ui-fabric-react/lib/Slider';

const getTypeQuery = (type) => {
    const query = `
        ${type.name} {
            ${
        type.type.fields
            .map(field => {
                let string = field.name;

                if (field.type === 'List') {
                    string += `{
                                id
                            }`;
                }

                return string;
            })
            .join('\n')
        }
        }
    `;

    return query;
};

class SingleView extends React.Component {
    getErrorMessage = (field, value) => {

        if (field.type === 'Int') {
            if (!Number.isInteger(value)) {
                return 'Value showed be an Int';
            }
        }

        return value.length < 3
            ? ''
            : `The length of the input value should less than 3, actual is ${value.length}.`;
    };

    render() {
        const type = this.props.type;
        const { loading, error, refetch } = this.props.data;
        const data = this.props.data[type.name];

        if (loading) {
            return <Spinner label='Loading ...' />
        }

        const uiFields = type.type.fields.map(field => {
            return (
                <div key={`field_${field.name}`}>
                    <TextField
                        placeholder="Please fill"
                        label={field.name}
                        description={field.description}
                        value={data[field.name] || ''}
                        onGetErrorMessage={ (value) => this.getErrorMessage(field, value) }
                        deferredValidationTime={200}
                    />
                </div>
            )
        });

        return (
            <div>
                <h1>{ type.name }</h1>
                { error && <div style={{ color: 'red' }}>{ error.message }</div> }

                { uiFields }

                <DefaultButton
                    onClick={ () => { console.log('Update TODO') }}
                    primary={ true }
                >
                    Update
                </DefaultButton>

                <DefaultButton onClick={() => refetch()}>Refresh</DefaultButton>
            </div>
        );
    }
}

export default (type) => {
    return graphql(gql`
      query AppQuery {
        ${getTypeQuery(type)}
      }
    `, {
        props: (args) => {
            return {
                ...args,
                type
            }
        }
    })(SingleView);
};