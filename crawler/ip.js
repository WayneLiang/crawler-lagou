var Models = require('../lib/core');
var $Ip = Models.$Ip;

var request = require('superagent');
var cheerio = require('cheerio');
require('superagent-proxy')(request);

(async function () {
  for(var page = 1; page <= 10; page++){
    var res = await request.get('http://www.xicidaili.com/nn/' + 1);
    var $ = cheerio.load(res.text);
    var tr = $('tr');
    for(var line = 1 ; line < tr.length ; line++ ){
      var td = $(tr[line]).children('td');
      var proxy =  'http://' + td[1].children[0].data + ':' + td[2].children[0].data;
      try {
        var testip = await request.get('http://ip.chinaz.com/getip.aspx').proxy(proxy).timeout(3000);
        if(testip.statusCode == 200 && testip.text.substring(0,4) == '{ip:' ){
          console.log(testip.text);
          await $Ip.addIp({proxy: proxy})
        }
      }catch (error){
      }
    }
  }
})();

