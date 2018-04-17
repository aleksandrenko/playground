
const User = require('./models/User');
const me = new User('Nikolay', 'Aleksandrenko');

import koa from 'koa'; // koa@2
import koaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import cors from '@koa/cors';
import serve from 'koa-static-server';

import schema from './schema/';

const app = new koa();
const router = new koaRouter();
const PORT = 3000;


// koaBody is needed just for POST.
app.use(koaBody());

router.post('/graphql', graphqlKoa({ schema: schema }));
router.get('/graphql', graphqlKoa({ schema: schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

// app.use(async ctx => {
//   ctx.body = `Hello World ${me.name}.`;
// });


app.use(serve({
    rootDir: './public/build/'
}));

app.listen(PORT);