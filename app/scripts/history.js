'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//fetch the browser data
function getAllHistory() {

    var options = {};

    //一周时间
    var endTime = new Date().valueOf();
    var startTime = endTime - 1000 * 60 * 60 * 24 * 7;

    //默认查询参数
    var defaults = {
        text: '',
        startTime: startTime, //ms
        endTime: endTime
    };

    //参数为空
    arguments[0] ? arguments[0] : options = defaults;

    if (arguments[0] && _typeof(arguments[0]) === 'object') {
        options = extendDefaults(defaults, arguments[0]);
    }

    function extendDefaults(source, properties) {
        var property = void 0;
        for (property in properties) {
            //不往原型链上找属性
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }

        return source;
    }

    chrome.history.search(options, function (result) {
        filterData(result, renderChart);
    });
}

//data handler
function filterData(rawData, cb) {
    //bk
    var conf = {};
    var data = [];
    var filterData = [];
    var reg = /https?:\/\/[\w+.]{3,}/g;

    //ES6+
    //1. custructor the rawData of the duplicate domain
    for (var i = 0; i < rawData.length; i++) {
        var url = rawData[i].url.match(reg);
        var title = rawData[i].title; //''

        if (url && !!title) {
            //重组数据
            data.push({ name: rawData[i].title, url: rawData[i].url.match(reg)[0], value: rawData[i].visitCount });
        }
    }

    //去重
    for (var _i = 0; _i < data.length; _i++) {
        var unique = true;
        for (var j = 0; j < filterData.length; j++) {
            if (data[_i].url === filterData[j].url) {
                filterData[j].value++;
                unique = false;
            }
        }
        if (unique) {
            filterData.push(data[_i]);
        }
    }

    conf.data = filterData;
    cb(conf);
}

//render charts
function renderChart(conf) {

    var data = conf.data;

    var option = {
        title: {
            text: 'History-V',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
            name: '历史记录',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    // type = conf.type || 'line';

    var myChart = echarts.init(document.querySelector('#history'));

    myChart.setOption(option);
}

let calendar = flatpickr('.time',{
    defaultDate: 'today',
    dataFormat: 'U',
    mode: 'range',
    onChange: (selectedDates, dataStr, instance) => {
        //return range timestamps
        let startTime, endTime;
        for (let i = 0; i < selectedDates.length; i++) {
            if (selectedDates[i]) {
                startTime = selectedDates[0].getTime();
                endTime = selectedDates[1].getTime();
            }
        }
        getAllHistory({
            startTime: startTime,
            endTime: endTime
        });
    }
});

getAllHistory();