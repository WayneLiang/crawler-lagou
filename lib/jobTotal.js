/**
 * Created by wayne on 16/10/5.
 */
var JobTotal = require('../models').JobTotal;

//新建一个用户
exports.addJobTotal = function (data) {
  return JobTotal.create(data);
};

exports.findJobTotal = function (data) {
  return JobTotal.find(data).exec();
};
