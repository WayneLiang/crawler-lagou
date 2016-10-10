/**
 * Created by wayne on 16/9/27.
 */
var router = require('koa-router')();
var analysis = require('./analysis');

router.post('/city', analysis.getCityAnalysis);
router.post('/district', analysis.getDistrictAnalysis);
router.post('/salary', analysis.getSalaryAnalysis);
router.post('/workyear', analysis.getWorkYearAnalysis);


module.exports = router;