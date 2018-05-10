import React from 'react';

import { graphql } from 'react-apollo';
import Spinner from '../Shared/Spinner';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';

import Details from '../SingleItemView/Details';

import {
    DetailsList,
    DetailsListLayoutMode,
    CheckboxVisibility
} from 'office-ui-fabric-react/lib/DetailsList';

import getQueryQL from '../../utils/generateQL';

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

    _onColumnClick = (ev) => {
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
            <div className="list-content">
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
                        <Details entity={this.state.selectedItem} />
                    </div>
                </Dialog>

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

                <button onClick={() => refetch()}>Refresh</button>
            </div>
        );
    }
}

export default (type) => {
    return graphql(getQueryQL(type), {
        options: (ownProps) => ({
            variables: ownProps.params || {}
        }),
        props: (args) => {
            return {
                ...args,
                type
            }
        }
    })(ListView);
};