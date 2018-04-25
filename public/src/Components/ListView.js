import React from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Grid from './Grid';
import Spinner from './Spinner';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

const _onColumnClick = (ev, column) => {
    console.log('_onColumnClick', ev, column);
    // const { columns, items } = this.state;
    // let newItems = items.slice();
    // const newColumns = columns.slice();
    // const currColumn = newColumns.filter((currCol, idx) => {
    //     return column.key === currCol.key;
    // })[0];
    // newColumns.forEach((newCol) => {
    //     if (newCol === currColumn) {
    //         currColumn.isSortedDescending = !currColumn.isSortedDescending;
    //         currColumn.isSorted = true;
    //     } else {
    //         newCol.isSorted = false;
    //         newCol.isSortedDescending = true;
    //     }
    // });
    // newItems = this._sortItems(newItems, currColumn.fieldName, currColumn.isSortedDescending);
    // this.setState({
    //     columns: newColumns,
    //     items: newItems
    // });
};

const createColumns = (type) => type
    ? type.type.fields.map(field => ({
        key: `${field.name}_column`,
        name: field.name,
        fieldName: field.name,
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        onColumnClick: _onColumnClick,
        data: field.type.toLowerCase(),
        isPadded: true
    }))
    : [];

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

class ListView extends React.Component {
    render() {
        const type = this.props.type;
        const { loading, error, refetch } = this.props.data;
        const data = this.props.data[type.name];
        const columns = createColumns(type);

        console.log('ListView', type);

        if (loading) {
            return <Spinner label='Loading ...' />
        }

        return (
            <div>
                { error &&
                    <MessageBar
                        messageBarType={ MessageBarType.error }
                        isMultiline={ false }
                        dismissButtonAriaLabel='Close'
                    >
                        { error.message }
                    </MessageBar>
                }

                <Grid
                    items={data}
                    columns={columns}
                />
                <button onClick={() => refetch()}>Refresh</button>
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
    })(ListView);
};