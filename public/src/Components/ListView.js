import React from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Grid from './Grid';
import Spinner from './Spinner';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';

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

    constructor(props) {
        super(props);

        this.state = {
            hideDialog: true,
            selectedItem: {}
        }
    }

    createColumns = (type) => type
        ? type.type.fields
            .map(field => ({
                key: `${field.name}_column`,
                name: field.name,
                fieldName: field.name,
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: field.type.toLowerCase()
            }))
        : [];

    _closeDialog = () => {
        this.setState({
            hideDialog: true
        });
    };


    _onColumnClick = (ev, column) => {
        this.setState({
            hideDialog: false,
            selectedItem: ev
        });

        console.log('click');

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


    render() {
        const type = this.props.type;
        const { loading, error, refetch } = this.props.data;
        const data = this.props.data[type.name];
        const columns = this.createColumns(type);

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

                <Dialog
                    hidden={ this.state.hideDialog }
                    onDismiss={ this._closeDialog }
                    dialogContentProps={ {
                        type: DialogType.normal,
                        title: `${ this.state.selectedItem.__typename }`
                    } }
                    modalProps={ {
                        titleAriaId: 'myLabelId',
                        subtitleAriaId: 'mySubTextId',
                        isBlocking: false,
                        containerClassName: 'ms-dialogMainOverride'
                    } }
                >
                    <div>
                        { Object.keys(this.state.selectedItem)
                            .map(itemKey => {
                                return <div key={itemKey}>{itemKey}: { this.state.selectedItem[itemKey] }</div>
                            })
                        }
                    </div>
                </Dialog>

                <Grid
                    items={data}
                    columns={columns}
                    onColumnClick={this._onColumnClick}
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