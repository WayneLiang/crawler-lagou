var router = require('koa-router')();
var home = require('./home');

router.get('/', home.index);

module.exports = router;