/**
 * Created by wayne on 16/10/10.
 */
var request = require('superagent');
require('superagent-proxy')(request);
var cheerio = require('cheerio');

var Models = require('../lib/core');
var $City = Models.$City;
var $Position = Models.$Position;
var $JobTotal = Models.$JobTotal;
var $Job = Models.$Job;
var $Ip = Models.$Ip;
var ipNo = 0;
var ips;


(async function () {
  await crawlerCity();
  await crawlerPosition();
  await crawlerJob(crawlerJobTotal);
  await crawlerJob(crawlerJobs);
  process.exit();
})();


async function crawlerCity() {
  var res = await request.get('http://www.crawler.com/lbs/getAllCitySearchLabels.json');
  var citys = res.body.content.data.allCitySearchLabels;
  for(var cityLabel in citys){
    for(var value of citys[cityLabel]){
      await $City.addCity({name : value.name, code : value.code, label : cityLabel});
    }
  }
  console.log('**************finish crawer city data***************');
}

async function crawlerPosition() {
  var res = await request.get('http://www.crawler.com');
  var $ = cheerio.load(res.text);
  var length = $('#sidebar .menu_box').length;
  var positions,position = {};
  for(var num=0 ; num < length; num++){
    position.name = $($('.menu_main h2')[num]).text().replace(/\n/g,'').replace(/ /g,'');
    position.sub = [];
    var menu_sub = ($($('.menu_sub')[num]).children('dl'));
    for(var subnum=0 ; subnum < menu_sub.length; subnum++){
      var subPosition = {};
      subPosition.name = $(menu_sub[subnum]).children('dt').children('a').text();
      subPosition.position = [];
      positions = $(menu_sub[subnum]).children('dd').children('a');
      for(var positionnum=0 ; positionnum < positions.length; positionnum++){
        subPosition.position.push($(positions[positionnum]).text());
      }
      position.sub.push(subPosition);
    }
    await $Position.addPosition(position);
  }
  console.log('**************finish crawer position data***************');
}

async function crawlerJob(crawlerFn) {
  ipNo = 0;
  var city = await $City.findCity({});
  var positionDb = await $Position.findPosition({});
  var position = [];
  positionDb.forEach(function (positionFirst) {
    positionFirst.sub.forEach(function (positionSub) {
      positionSub.position.forEach(function (item) {
        position.push({name:item,firstTag: positionFirst.name,secondTag:positionSub.name});
      })
    })
  });
  console.log('start',city.length,position.length);
  ips = await $Ip.findIp({});
  for(var cityNo = 0; cityNo < city.length; cityNo++){
    for(var positionNo = 0; positionNo < position.length; positionNo++){
      try{
        await crawlerFn(city[cityNo].name,position[positionNo],1);
      }catch (error){
        console.log('crawle job error');
      }

    }
  }
  console.log('end',city.length,position.length);
  console.log('**************finish crawler job***************');
}

async function crawlerJobTotal(city,position) {
  var proxy = ips[ipNo++].proxy;
  var positionResult,jobResult;
  if(ipNo >= ips.length){
    ipNo = 0;
  }
  try {
    positionResult = await request
        .post('http://www.crawler.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&city='+city)
        .type('application/x-www-form-urlencoded')
        .send({ kd: position.name, pn: 1,first:true }).proxy(proxy).timeout(3000);
  }catch(error){
    console.log('request error, again');
    return await crawlerJobTotal(city,position);
  }
  var totalCount;
  if(positionResult.body && positionResult.body.success
      && (positionResult.body.content.length != 0)
      && (positionResult.body.content.positionResult!= 0)){
    totalCount = positionResult.body.content.positionResult.totalCount;
    console.log(city,position.name,1,Date.now(),totalCount);
    var item = {};
    item.city = city;
    item.position = position.name;
    item.firstTag = position.firstTag;
    item.secondTag = position.secondTag;
    item.total = totalCount;
    await $JobTotal.addJobTotal(item);
  }else{
    console.log('could not get positionResult,again',proxy);
    return await crawlerJobTotal(city,position);
  }
}

async function crawlerJobs(city,position,page) {

  var proxy = ips[ipNo++].proxy;
  var positionResult,jobResult;
  if(ipNo >= ips.length){
    ipNo = 0;
  }
  console.log('crawlerJobs-----------------------',proxy,page);
  if(page == 1){
    try {
      positionResult = await request
          .post('http://www.crawler.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&city='+city)
          .type('application/x-www-form-urlencoded')
          .send({ kd: position.name, pn: page,first:true }).proxy(proxy).timeout(3000);
    }catch(error){
      console.log('request error, again',page);
      return await crawlerJobs(city,position,page);
    }
    var totalCount, pageSize,resultCount,pageCount,pageNo;
    if(positionResult.body && positionResult.body.success
        && (positionResult.body.content.length != 0)
        && (positionResult.body.content.positionResult!= 0)){
      totalCount = positionResult.body.content.positionResult.totalCount;
      resultCount = positionResult.body.content.positionResult.resultSize;
      jobResult = positionResult.body.content.positionResult.result;
      pageSize = positionResult.body.content.pageSize;
      console.log(city,position.name,page,Date.now(),totalCount,resultCount);
      await setInDb(city,position,jobResult);
      pageCount = Math.ceil(totalCount/pageSize);
      for(pageNo=2 ; pageNo <= pageCount ; pageNo++){
        var data = await crawlerJobs(city,position,pageNo);
        if(data === false){
          break;
        }
      }
    }else{
      console.log('could not get positionResult,again',page,proxy);
      return await crawlerJobs(city,position,page);
    }
  }else{
    try {
      positionResult = await request
          .post('http://www.crawler.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&city='+city)
          .type('application/x-www-form-urlencoded')
          .send({ kd: position.name, pn: page,first:true }).proxy(proxy).timeout(3000);
    }catch(error){
      console.log('request error, again',page);
      return await crawlerJobs(city,position,page);
    }
    if(positionResult.body && positionResult.body.success
        && (positionResult.body.content.length != 0)
        && (positionResult.body.content.positionResult!= 0)){
      if(positionResult.body.content.pageNo == 0){
        return false;
      }
      jobResult = positionResult.body.content.positionResult.result;
      resultCount = positionResult.body.content.positionResult.resultSize;
      totalCount = positionResult.body.content.positionResult.totalCount;
      console.log(city,position.name,page,Date.now(),totalCount,resultCount);
      await setInDb(city,position,jobResult);
    }else{
      console.log('could not get positionResult,again',page,proxy);
      return await crawlerJobs(city,position,page);
    }
  }
}

function setInDb(city,position,result) {
  result.forEach(async function (item) {
    var salarysplit = item.salary.replace(/[k\u4e00-\u9fa5]/g, "").split("-");
    var salary = 0;
    var salaryValue = 0;
    if(salarysplit.length == '2'){
      salarysplit.forEach(function (item) {
        salary += parseInt(item);
      });
      salaryValue = salary/2;
    }else{
      salaryValue = parseInt(salarysplit[0]);
    }
    item.cityName = city;
    item.position = position.name;
    item.firstTag = position.firstTag;
    item.secondTag = position.secondTag;
    item.avgsalary = salaryValue;
    await $Job.addJob(item);
  })
}

