import React from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

import antValidation from "antvalidation";

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import simplifySchema from "../utils/simplifySchema";

import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';

const localStorage = window.localStorage;

const LOCAL_STORAGE_KEYS = {
    GRAPHQL_URL: 'graphqlUrl'
};

class Config extends React.Component {
    constructor(props) {
        super(props);

        const savedUrl = localStorage.getItem(LOCAL_STORAGE_KEYS.GRAPHQL_URL) || '';

        this.state = {
            inputValue: savedUrl,
            graphQlUrl: savedUrl,
            showPanel: !savedUrl,
            isLoading: false,
            isSchemaLoaded: false
        };
    }

    componentDidMount() {
        if (this.state.graphQlUrl) {
            this.loadSchemaFromEndpoint(this.state.graphQlUrl);
        }
    }

    updateState = ({error, isLoading, schema}) => {
        const newState = {
            error: error || null,
            isLoading: isLoading || false,
            schema: schema || null
        };

        this.setState(newState);
        this.props.onUpdate(newState);
    };

    loadSchemaFromEndpoint = (uri) => {
        this.updateState({ isLoading: true });

        const link = new HttpLink({ uri, fetch });

        introspectSchema(link)
            .then((schema) => {
                const executableSchema = makeRemoteExecutableSchema({
                    schema,
                    link,
                });

                const simplifiedSchema = simplifySchema(executableSchema);
                this.updateState({ schema: simplifiedSchema });
            })
            .catch((error) => {
                console.log('Loading schema error', JSON.stringify(error), error.response, error.bodyText);
                this.updateState({
                    error: `Error ${error.response.status}: ${error.response.statusText}`
                });
            });
    };

    getErrorMessage = (value) => {
        const isLocalHost = value.includes('localhost');
        const ants = '@required @url';
        const errors = antValidation({ants, value});

        return isLocalHost
            ? ''
            : errors.join('\n');
    };

    onChanged = (inputValue) => {
        this.setState({ inputValue });
    };

    onSubmit = () => {
        const newValue = this.state.inputValue;
        localStorage.setItem(LOCAL_STORAGE_KEYS.GRAPHQL_URL, newValue);

        this.setState({
            graphQlUrl: newValue
        });

        this.loadSchemaFromEndpoint(newValue);
    };

    onClosePanel = () => {
        this.setState({ showPanel: false });
    };

    onShowPanel = () => {
        this.setState({ showPanel: true });
    };

    getMessageBlock = () => {
        const { error, isLoading, schema } = this.state;
        const isSchemaLoaded = schema && !isLoading;

        return (
            isLoading &&
            <MessageBar messageBarType={null}>
                <Spinner size={SpinnerSize.small} className="schemaLoader" />
                Loading server graphql schema...
            </MessageBar>
            || error &&
            <MessageBar messageBarType={MessageBarType.error}>
                {error}
            </MessageBar>
            || isSchemaLoaded &&
            <MessageBar messageBarType={MessageBarType.success}>
                Schema loaded successfully
            </MessageBar>
            ||
            <MessageBar messageBarType={ MessageBarType.info }>
                Specify the address of your GraphQL end-point to continue
            </MessageBar>
        );
    };

    render() {
        const { inputValue, graphQlUrl, isLoading } = this.state;
        const isDisabledSaveBtn = !!this.getErrorMessage(inputValue).length || (inputValue === graphQlUrl);
        const MessageBlock = this.getMessageBlock();

        return (
            <section className="config">
                <Panel
                    isOpen={ this.state.showPanel }
                    type={ PanelType.medium  }
                    hasCloseButton={false}
                >
                    { MessageBlock }

                    <br />

                    <TextField
                        placeholder="GraphQL endpoint url ..."
                        value={inputValue}
                        prefix='url:'
                        disabled={isLoading}
                        deferredValidationTime={200}
                        onGetErrorMessage={this.getErrorMessage}
                        onChanged={this.onChanged}
                    />

                    <br />

                    <DefaultButton
                        onClick={this.onSubmit}
                        primary={ true }
                        disabled={isDisabledSaveBtn}
                    >
                        Save
                    </DefaultButton>

                    <DefaultButton onClick={this.onClosePanel}>
                        Close
                    </DefaultButton>
                </Panel>

                <IconButton
                    iconProps={ { iconName: 'Settings' } }
                    onClick={this.onShowPanel}
                />

            </section>
        );
    }
}

export default Config;