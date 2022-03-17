const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const router = new Router();
const app = new Koa();

app.use(cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST']
}));
app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

const messages = [];
let nextId = 1;

router.get('/messages', async (ctx, next) => {
    const from = Number(ctx.request.query.from)
    if (ctx.request.query.from === 0) {
        ctx.response.body = JSON.stringify(messages);
        return;
    }

    const fromIndex = messages.findIndex(o => o.id === from);
    if (fromIndex === -1) {
        ctx.response.body = JSON.stringify(messages);
        return;
    }

    ctx.response.body = JSON.stringify(messages.slice(fromIndex + 1));
});

router.post('/messages', async(ctx, next) => {
    const message = JSON.parse(ctx.request.body);
    messages.push({data: message, id: nextId++});
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
app.listen(port, () => console.log('server started'));