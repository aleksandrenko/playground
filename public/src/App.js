
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';


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

            console.log(executableSchema); //Graphql server schema
            console.log(schema); //Graphql server schema
            console.log(executableSchema._queryType._fields);

            this.setState({
                schema: executableSchema,
                isLoading: false
            });
        });
    }

    render() {
        console.log(this.state);
        const fields = this.state.schema
            ? Object.values(this.state.schema._queryType._fields)
            : [];

        return (
            <Fabric>
                { (this.props.loading || this.state.isLoading) &&
                    <h1>loading</h1>
                }

                types: {
                    fields.map(field => {
                        const url = `./fields/${field.name}/`;
                        const name = field.name;
                        return <div>
                            <a href={url} key={name}>{ name }</a>
                        </div>;
                    })
                }

                <DefaultButton
                    text='I am a FABRIC Button'
                    primary={ true }
                    href='#/components/button'
                />

                {/*<button onClick={() => refetch()}>Refresh</button>*/}
                {/*<ul>{products && products.map(products => <li key={products.id}>{products.name}</li>)}</ul>*/}
            </Fabric>
        );
    }
}

export default graphql(gql`
  query AppQuery {
    products {
      id
      name
    }
  }
`)(App);
