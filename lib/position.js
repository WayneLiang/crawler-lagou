/**
 * Created by wayne on 16/9/27.
 */
var Position = require('../models').Position;

//新建一个用户
exports.addPosition = function (data) {
  return Position.create(data);
};

exports.findPosition = function (data) {
  return Position.find(data).exec();
};
