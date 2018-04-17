
const User = require('./models/User');
const me = new User('Nikolay', 'Aleksandrenko');

import koa from 'koa'; // koa@2
import koaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import cors from '@koa/cors';
import serve from 'koa-static-server';

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

// Some fake data
const books = [
  {
    id: 0,
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    id: 1,
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String, id: Int }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// koaBody is needed just for POST.
app.use(koaBody());

router.post('/graphql', graphqlKoa({ schema: schema }));
router.get('/graphql', graphqlKoa({ schema: schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(cors());
app.use(serve({
    rootDir: './public/build/'
}));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async ctx => {
  ctx.body = `Hello World ${me.name}.`;
});

app.listen(PORT);