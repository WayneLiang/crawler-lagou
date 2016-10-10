/**
 * Created by wayne on 16/10/8.
 */

var Models = require('../../../lib/core');
var $JobTotal = Models.$JobTotal;
var $Job = Models.$Job;

exports.getCityAnalysis = async function (ctx, next) {
  var dbData = await $JobTotal.findJobTotal({position:ctx.request.body.position});
  var totalData = [],outData = [];
  var positionToal = 0;
  dbData.forEach(function (item) {
    if(item.total){
      totalData.push( {value: item.total , name:item.city});
      positionToal += item.total;
    }
  });
  totalData.sort(function (a,b) {
    return b.value - a.value;
  });
  var other = positionToal * 0.002;
  var otherValue = 0;
  totalData.forEach(function (item) {
    if(positionToal > 100){
      if(item.value < other || item.value < 2){
        otherValue += item.value;
      }else{
        outData.push(item);
      }
    }else{
      outData.push(item);
    }

  });
  if(otherValue){
    outData.push({name:'其他',value: otherValue});
  }

  ctx.body = {
    analysis : outData,
    total : positionToal
  }
};

exports.getSalaryAnalysis = async function (ctx, next) {
  var outJson = {analysis:[]};
  var command = [];
  if(ctx.request.body.city && ctx.request.body.city != '全国'){
    command.push({$match:{'city':ctx.request.body.city,'position':ctx.request.body.position}});
  }else{
    command.push({$match:{'position':ctx.request.body.position}});
  }
  command.push({$group:{_id:'$avgsalary',count:{$sum:1}}});
  var dbData = await $Job.aggregate(command);
  var DictArr = {};
  DictArr["0-5k"] = 0;
  DictArr["6-10k"] = 0;
  DictArr["11-15k"] = 0;
  DictArr["16-20k"] = 0;
  DictArr["21-25k"] = 0;
  DictArr["26-30k"] = 0;
  DictArr["30k"] = 0;

  dbData.forEach(function (value) {
    var salaryValue = value._id;
    if (salaryValue >= 0 && salaryValue <= 5) {
      DictArr["0-5k"] += value.count;
    } else if (salaryValue >= 6 && salaryValue <= 10) {
      DictArr["6-10k"] += value.count;
    } else if (salaryValue >= 11 && salaryValue <= 15) {
      DictArr["11-15k"] += value.count;
    } else if (salaryValue >=16 && salaryValue <= 20) {
      DictArr["16-20k"] += value.count;
    } else if (salaryValue >= 21 && salaryValue <= 25) {
      DictArr["21-25k"] += value.count;
    } else if (salaryValue >= 26 && salaryValue <= 30) {
      DictArr["26-30k"] += value.count;
    } else {
      DictArr["30k"] += value.count;
    }
  })
  for (var key in DictArr){
    if(DictArr[key]){
      outJson.analysis.push({name: key,value:DictArr[key]})
    }
  }
  ctx.body = outJson;
};

exports.getWorkYearAnalysis = async function (ctx, next) {
  var legend = [ "应届毕业生", "1年以下","1-3年", "3-5年", "5-10年" , "10年以上", "不限",   "无经验" ];
  var command = [];

  if(ctx.request.body.city && ctx.request.body.city != '全国'){
    command.push({$match:{'city':ctx.request.body.city,'position':ctx.request.body.position}});
  }else{
    command.push({$match:{'position':ctx.request.body.position}});
  }
  command.push({$group:{_id:'$workYear',avgValue: {$avg:"$avgsalary"}}});
  var avgsalary = await $Job.aggregate(command);
  command[command.length - 1] = {$group:{_id:'$workYear',minValue: {$min:"$avgsalary"}}};
  var minsalary = await $Job.aggregate(command);
  command[command.length - 1] = {$group:{_id:'$workYear',maxValue: {$max:"$avgsalary"}}};
  var maxsalary = await $Job.aggregate(command);
  var outJson = {
    legend : [],
    min : [],
    avg : [],
    max : [],
  };
  legend.forEach(function (item) {
    var avg = avgsalary.filter(function (onesalary) {return onesalary._id == item;});
    if(avg[0]){
      outJson.legend.push(avg[0]._id);
      outJson.avg.push(avg[0].avgValue);
      outJson.min.push(minsalary.filter(function (onesalary) {return onesalary._id == item;})[0].minValue);
      outJson.max.push(maxsalary.filter(function (onesalary) {return onesalary._id == item;})[0].maxValue);
    }
  });
  ctx.body = outJson;
};

exports.getDistrictAnalysis = async function (ctx, next) {
  var command = [];
  command.push({$match:{'city':ctx.request.body.city,'position':ctx.request.body.position}});
  command.push({$group:{_id:'$district',value:{$sum:1}}});
  command.push({$sort:{value:-1}});
  var districtdata = await $Job.aggregate(command);
  var outData = districtdata.map(function (district) {
    if(district._id){
      return {name: district._id,value: district.value};
    }else{
      return {name: '其他',value: district.value};
    }
  });
  ctx.body = {
    analysis : outData,
  }
};

