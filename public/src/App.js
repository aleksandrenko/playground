import React from 'react';

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import simplifySchema from './utils/simplifySchema';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

import Nav from './Components/Nav';
import Spinner from './Components/Spinner';

import { initializeIcons } from '@uifabric/icons';
initializeIcons();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schema: null,
            isLoading: true
        };
    }

    componentDidMount() {
        const link = new HttpLink({ uri: 'http://localhost:3000/graphql/', fetch });

        introspectSchema(link).then((schema) => {
            const executableSchema = makeRemoteExecutableSchema({
                schema,
                link,
            });

            this.setState({
                schema: executableSchema,
                isLoading: false
            });
        });
    }

    render() {
        const schema = this.state.schema
            ? simplifySchema(this.state.schema)
            : [];

        return (
            <Fabric>
                { (this.props.loading || this.state.isLoading) &&
                    <Spinner label='Loading server graphql schema...' />
                }

                <Nav nav={schema} />
            </Fabric>
        );
    }
}

export default App;