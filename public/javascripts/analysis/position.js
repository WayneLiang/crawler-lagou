/**
 * Created by wayne on 16/10/8.
 */
var cityChart = echarts.init(document.getElementById('echartsCity'));
var salaryChart = echarts.init(document.getElementById('echartsSalary'));
var salaryWorkYear = echarts.init(document.getElementById('echartsWorkYear'));

var currentCity = '全国';
var currentPosition = 'Node.js';

(function () {
  showEcharts();
})();

function positionClick(element) {
  currentPosition = element.text;
  $('.curr').removeClass('curr');
  $(element).addClass('curr');
  showEcharts();
  hideMenu(element);
}
function cityClick(element) {
  currentCity = element.text;
  $('.active').removeClass('active');
  $(element).addClass('active');
  showEcharts();
}

function drawPie(element,url,title) {
// 基于准备好的dom，初始化echarts实例

  $.ajax({
    type: 'POST',
    data: {position:currentPosition,city: currentCity},
    url: url,
    success: function(data){
      element.hideLoading();
      // 指定图表的配置项和数据
      var option = {
        title : {
          text: title,
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
          {
            name: '具体数据量',
            type: 'pie',
            radius : '45%',
            center: ['50%', '50%'],
            data: data.analysis,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      if(data.total){
        option.title.subtext = '总数据量: ' + data.total;
      }else{
        option.title.subtext = '';
      }
// 使用刚指定的配置项和数据显示图表。
      element.setOption(option);
    },
    error: function(xhr, type){
      alert('Ajax error!')
    }
  })
}

function drawBar(element,url,title) {
  // 基于准备好的dom，初始化echarts实例

  $.ajax({
    type: 'POST',
    data: {position:currentPosition,city: currentCity},
    url: url,
    success: function(data){
      element.hideLoading();
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: title,
          left: 'center',
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top : '5%',
          data:['最小值','平均值','最大值']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : data.legend
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'最小值',
            type:'bar',
            data: data.min
          },
          {
            name:'平均值',
            type:'bar',

            data: data.avg
          },
          {
            name:'最大值',
            type:'bar',

            data:data.max
          }
        ]
      };

// 使用刚指定的配置项和数据显示图表。
      element.setOption(option);
    },
    error: function(xhr, type){
      alert('Ajax error!')
    }
  })

}

function hideMenu(element) {
  var menuBox = $(element).parents('.menu_box');
  menuBox.removeClass("current");
  var dn = $(element).parents(".menu_sub");
  for (var y = 0; y < dn.length; y++) {
    $(dn[y]).addClass("dn");
  }
  var siblings = menuBox.siblings();
  for (var j = 0; j < siblings.length; j++) {
    var sub = $(siblings[j]).children(".menu_sub");
    for (var n = 0; n < sub.length; n++) {
      $(sub[n]).addClass("dn");
    }
  }
}

function showEcharts() {
  cityChart.showLoading();
  salaryChart.showLoading();
  salaryWorkYear.showLoading();
  if(currentCity == '全国'){
    drawPie(cityChart,'/api/v1/city',currentCity+ currentPosition + '招聘地区分布');
  }else{
    drawPie(cityChart,'/api/v1/district',currentCity+ currentPosition + '招聘地区分布');
  }
  drawPie(salaryChart,'/api/v1/salary',currentCity+ currentPosition + '薪资分布');
  drawBar(salaryWorkYear,'/api/v1/workyear',currentCity+ currentPosition + '薪资按照工资年限统计');
}
