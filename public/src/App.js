import React from 'react';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

import Nav from './Components/Nav';
import Config from './Components/Config';

import NoMatch from './Page/404';

import {Switch, Route, withRouter} from 'react-router-dom';

import { initializeIcons } from '@uifabric/icons';

import getView from "./Components/View";
import getFieldForm from "./Components/SingleItemView/Form";
import Spinner from './Components/Shared/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import QueryMaker from './Components/QueryMaker';

initializeIcons();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schema: null,
            schemaLoadingError: null,
            schemaLoading: null
        };
    }

    changeConfig = ({schema, error, isLoading}) => {
        this.setState({
            schema,
            schemaLoadingError: error,
            schemaLoading: isLoading
        });

        //Redirect to the first if any and no url
        if (schema && this.props.history.location.pathname.length <= 1) {
            const firstItemInMenuName = schema.queryTypes[0] && schema.queryTypes[0].name;
            const redirectedUrl = `/${firstItemInMenuName}`;
            this.props.history.push(redirectedUrl);
        }
    };

    render() {
        const { schema, schemaLoading, schemaLoadingError } = this.state;
        const { loading } = this.props;

        return (
            <Fabric className="app">
                <Config onUpdate={ this.changeConfig } />

                <QueryMaker schema={schema} />

                { !schema && !schemaLoading && !schemaLoadingError &&
                <div className="noSchemaWrapper">
                    <MessageBar messageBarType={MessageBarType.info}>
                        <strong>No schema</strong>
                        <p>Did you enter a valid url for the graphQL endpoint?</p>
                    </MessageBar>
                </div>
                }

                { schemaLoadingError &&
                <div className="noSchemaWrapper">
                    <MessageBar messageBarType={MessageBarType.error}>
                        <strong>Schema loading error:</strong>
                        <p>{ schemaLoadingError }</p>
                        <br/>
                        <p>Check the Config and the GraphQL end-point.</p>
                    </MessageBar>
                </div>
                }

                { schemaLoading &&
                <Spinner className="fullPageSpinner" label="Loading Schema ..." />
                }

                { loading &&
                <Spinner className="fullPageSpinner" label="Loading data ..."/>
                }

                { schema &&
                <nav className="page-nav">
                    <Nav schema={schema} />
                </nav>
                }

                { schema &&
                <content className="page-content">
                    <Switch>
                        {
                            schema.queryTypes &&
                            schema.queryTypes.map(entry => {
                                const url = `/${entry.name}`;
                                const View = getView(entry, schema);
                                return <Route key={url} exact path={url} component={View}/>
                            })
                        }
                        {
                            schema.mutationTypes &&
                            schema.mutationTypes.map(entry => {
                                const url = `/${entry.name}`;
                                const View = getFieldForm(entry, schema);
                                return <Route key={url} exact path={url} component={View}/>
                            })
                        }
                        <Route component={NoMatch}/>

                    </Switch>
                </content>
                }
            </Fabric>
        );
    }
}

export default withRouter(App);