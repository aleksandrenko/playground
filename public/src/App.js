import React from 'react';

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import simplifySchema from './utils/simplifySchema';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

import Nav from './Components/Nav';
import Spinner from './Components/Shared/Spinner';

import NoMatch from './Page/404';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import {Switch, Route, withRouter} from 'react-router-dom';

import { initializeIcons } from '@uifabric/icons';

import getView from "./Components/View";
import getFieldForm from "./Components/SingleItemView/Form";
initializeIcons();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schema: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        const link = new HttpLink({ uri: 'http://localhost:3000/graphql/', fetch });

        introspectSchema(link)
            .then((schema) => {
                const executableSchema = makeRemoteExecutableSchema({
                    schema,
                    link,
                });

                const simplifiedSchema = simplifySchema(executableSchema);

                this.setState({
                    schema: simplifiedSchema,
                    isLoading: false
                });

                //Redirect to the first if any and no url
                if (this.props.history.location.pathname.length <= 1) {
                    const firstItemInMenuName = simplifiedSchema.queryTypes[0] && simplifiedSchema.queryTypes[0].name;
                    const redirectedUrl = `/${firstItemInMenuName}`;
                    this.props.history.push(redirectedUrl);
                }
            })
            .catch((error) => {
                this.setState({
                    error,
                    isLoading: false
                });
            });
    }

    render() {
        const { error, schema } = this.state;
        const serverSchema = schema
            ? schema
            : [];

        return (
            <Fabric className="app">
                { error &&
                <MessageBar
                    messageBarType={ MessageBarType.error }
                    isMultiline={ false }
                    dismissButtonAriaLabel='Close'
                >
                    { error.message }
                </MessageBar>
                }

                { (this.props.loading || this.state.isLoading) &&
                    <Spinner label='Loading server graphql schema...' />
                }

                <nav className="page-nav">
                    <Nav schema={serverSchema} />
                </nav>

                <content className="page-content">
                    <Switch>
                        {
                            serverSchema.queryTypes &&
                            serverSchema.queryTypes.map(entry => {
                                const url = `/${entry.name}`;
                                const View = getView(entry);
                                return <Route key={url} exact path={url} component={View} />
                            })
                        }
                        {
                            serverSchema.mutationTypes &&
                            serverSchema.mutationTypes.map(entry => {
                                const url = `/${entry.name}`;
                                const View = getFieldForm(entry, serverSchema);
                                return <Route key={url} exact path={url} component={View} />
                            })
                        }
                        { !(this.props.loading || this.state.isLoading) &&
                            <Route component={NoMatch} />
                        }

                    </Switch>
                </content>
            </Fabric>
        );
    }
}

export default withRouter(App);