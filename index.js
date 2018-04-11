const Koa = require('koa');
const app = new Koa();

const User = require('./models/User');
const me = new User('Nikolay', 'Aleksandrenko');


app.use(async ctx => {
  ctx.body = `Hello World ${me.name}.`;
});

app.listen(3000);