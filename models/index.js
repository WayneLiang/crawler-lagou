/**
 * Created by wayne on 16/9/27.
 */
var mongoose = require('mongoose');
var config = require('config-lite').mongodb;

mongoose.Promise = global.Promise;
mongoose.connect(config.url, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.url, err.message);
    process.exit(1);
  }
});

exports.City = require('./city');
exports.Position = require('./position');
exports.Job = require('./job');
exports.Ip = require('./ip');
exports.JobTotal = require('./jobTotal');