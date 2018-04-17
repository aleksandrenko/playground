
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

function App({ data: { products, refetch } }) {
    return (
        <div>
            <button onClick={() => refetch()}>Refresh</button>
            <ul>{products && products.map(products => <li key={products.id}>{products.name}</li>)}</ul>
        </div>
    );
}

export default graphql(gql`
  query AppQuery {
    products {
      id
      name
    }
  }
`)(App);
