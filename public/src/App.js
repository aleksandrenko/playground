// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
//
//
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }
//
// export default App;


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
