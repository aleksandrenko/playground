
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

function App({ data: { books, refetch } }) {
    return (
        <div>
            <button onClick={() => refetch()}>Refresh</button>
            <ul>{books && books.map(book => <li key={book.id}>{book.title} - {book.author}</li>)}</ul>
        </div>
    );
}

export default graphql(gql`
  query AppQuery {
    books {
      id
      title
      author
    }
  }
`)(App);
