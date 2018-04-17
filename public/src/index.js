import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { ApolloProvider } from 'react-apollo';
import { client } from './ApolloClient';

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
const link = new HttpLink({ uri: 'http://localhost:3000/graphql/', fetch });

introspectSchema(link).then((schema) => {
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        link,
    });

    console.log(executableSchema); //Graphql server schema
    console.log(executableSchema._queryType._fields);
});



ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
