const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser')();
const config = require('config-lite');
const log4js = require('koa-log4');
const logger = log4js.getLogger(config.loggerName);

const web = require('./routes/web/index');
const api = require('./routes/api/v1/index');

app.use(log4js.koaLogger(log4js.getLogger("http"), { level: 'auto',format: config.logFormat }));
logger.setLevel('DEBUG');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

router.use('/api/v1', api.routes(), api.allowedMethods());
router.use('/', web.routes(), web.allowedMethods());


app.use(router.routes(), router.allowedMethods());
// response


app.on('error', function(err, ctx){
  logger.error(err.stack);
  // logger.error('server error', err, ctx);
});

module.exports = app;