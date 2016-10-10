/**
 * Created by wayne on 16/9/28.
 */
var Job = require('../models').Job;

//新建一个用户
exports.addJob = function (data) {
  return Job.create(data);
};
exports.findJob = function () {
  return Job.find(arguments[0],arguments[1]);
};
exports.aggregate = function (command) {
  return Job.aggregate(command).exec();
};
exports.distinct = function (data) {
  if(typeof data == 'string'){
    return Job.distinct(data).exec();
  }else if(typeof data == 'object' && data.field){
    data.conditions = data.conditions || {};
    return Job.distinct(data.field,data.conditions).exec();
  }
};
exports.update = function (query,update,options) {
  return Job.update(query,update,options || {}).exec(function (err,data) {
    console.log(data)
  });
};