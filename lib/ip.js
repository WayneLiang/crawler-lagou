/**
 * Created by wayne on 16/9/30.
 */
var Ip = require('../models').Ip;

//新建一个用户
exports.addIp = function (data) {
  return Ip.create(data);
};

exports.findIp = function (data) {
  return Ip.find(data).exec();
};
