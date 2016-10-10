var City = require('../models').City;

//新建一个用户
exports.addCity = function (data) {
  return City.create(data);
};

exports.findCity = function (data) {
  return City.find(data).exec();
};
