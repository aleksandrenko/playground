import React from 'react';
import gql from "graphql-tag";
import {graphql} from "react-apollo/index";

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import Spinner from './Spinner';


const getQueryQL = (type) => {
    //TODO these two can be extracted and used in multiple places

    const queryName = type.name;
    const props = type.type.fields
        .map(field => {
            let string = field.name;

            if (field.type === 'List') {
                string += `{ id }`;
            }

            return string;
        })
        .join('\n');
    const varDefinitions = type.arguments.reduce((acc, arg, index, args) => {
        if (index === 0) {
            acc += '(';
        }

        const isRequiredString = arg.isRequired ? '!' : '';
        acc += `$${arg.name}: ${arg.type}${isRequiredString}`;

        if (index+1 === args.length) {
            acc += ')';
        } else {
            acc += ', ';
        }

        return acc;
    }, '');
    const vars = type.arguments.reduce((acc, arg, index, args) => {
        if (index === 0) {
            acc += '(';
        }

        acc += `${arg.name}: $${arg.name}`;

        if (index+1 === args.length) {
            acc += ')';
        } else {
            acc += ', ';
        }

        return acc;
    }, '');

    const qlString = `
              query ${queryName}Query${varDefinitions} {
                ${queryName}${vars} {
                  ${ props }
                }
              }
            `;

    console.log('gql', qlString);

    return gql`
        ${qlString}
    `;
};

class SingleView extends React.Component {

    render() {
        const type = this.props.type;
        const { loading, error, refetch } = this.props.data;
        const data = this.props.data[type.name];

        if (loading) {
            return <Spinner label='Loading ...' />
        }

        const uiFields = type.type.fields.map(field => {
            return (data && !error &&
                <div key={`field_${field.name}`}>
                    <div><b>{ field.name }:</b> {data[field.name]}</div>
                    <div>{ field.description }</div>
                </div>
            )
        });

        return (
            <div>
                { error && <div style={{ color: 'red' }}>{ error.message }</div> }
                { uiFields }
                <DefaultButton onClick={() => refetch()}>Refresh</DefaultButton>
            </div>
        );
    }
}

export default (type) => {
    return graphql(getQueryQL(type),
    {
        options: (ownProps) => ({
            variables: ownProps.params || {}
        }),
        props: (args) => {
            return {
                ...args,
                type
            }
        }
    }
    )(SingleView);
};