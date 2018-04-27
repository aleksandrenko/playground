import React from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Spinner from './Spinner';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import FiltersToUrlParams from './FiltersToUrlParams';

import FieldViewFields from './FieldViewFields';

import {
    DetailsList,
    DetailsListLayoutMode,
    CheckboxVisibility
} from 'office-ui-fabric-react/lib/DetailsList';


const getTypeQuery = (type) => {
    const query = gql`
        query AppQuery {
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
        }`;

    return query;
};

class ListView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hideDialog: true,
            selectedItem: {
                data: {}
            }
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
            selectedItem: {
                data: ev
            }
        });
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
            <div className="withFilter">
                <Dialog
                    hidden={ this.state.hideDialog }
                    onDismiss={ this._closeDialog }
                    dialogContentProps={ {
                        type: DialogType.normal,
                        title: `${ this.state.selectedItem.data.__typename }`
                    } }
                    modalProps={{
                        isBlocking: false
                    }}
                >
                    <div className="dialogContent">
                        <FieldViewFields entity={this.state.selectedItem} />
                    </div>
                </Dialog>


                <div className="header">
                    <FiltersToUrlParams { ...this.props } />
                </div>

                <div className="content">
                    { error &&
                    <MessageBar
                        messageBarType={ MessageBarType.error }
                        isMultiline={ false }
                        dismissButtonAriaLabel='Close'
                    >
                        { error.message }
                    </MessageBar>
                    }

                    <DetailsList
                        items={ data }
                        columns={ columns }
                        setKey='set'
                        layoutMode={ DetailsListLayoutMode.justified }
                        isHeaderVisible={ true }
                        onItemInvoked={ this._onColumnClick}
                        checkboxVisibility={CheckboxVisibility.hidden}
                    />
                </div>

                <button onClick={() => refetch()}>Refresh</button>
            </div>
        );
    }
}

export default (type) => {
    return graphql(getTypeQuery(type), {
        props: (args) => {
            return {
                ...args,
                type
            }
        }
    })(ListView);
};