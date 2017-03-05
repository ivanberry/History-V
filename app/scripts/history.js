//fetch the browser data
function getAllHistory() {

    let options = {};

    //一周时间
    let endTime = new Date().valueOf();
    let startTime = endTime - 1000 * 60 * 60 * 24 * 7;

    //默认查询参数
    let defaults = {
        text: '',
        startTime: startTime, //ms
        endTime: endTime
    };

    arguments[0] ? arguments[0] : options = defaults;

    
    //属性存在就覆盖，不存在使用默认,若未传入arguments，怎么办？
    if (arguments[0] && typeof arguments[0] === 'object') {
        options = extendDefaults(defaults, arguments[0]);
    }

    function extendDefaults(source, properties) {
        let property;
        for (property in properties) {
            //不往原型链上找属性
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }

        return source;
    }

    chrome.history.search(options, (result) => {
        // console.table(result);
        // converteData(result, renderChart);
        filterData(result, renderChart);
    });
}

//data handler
function filterData(rawData, cb) {
    //bk
    let conf = {};
    let data = [];
    let filterData = [];
    let reg = /https?:\/\/[\w+.]{3,}/g;

    //ES6+
    //1. custructor the rawData of the duplicate domain
    for (let i = 0; i < rawData.length; i++) {
        let url = rawData[i].url.match(reg);
        let title = rawData[i].title; //''

        if (url && !!title) {
            //重组数据
            data.push({ name: rawData[i].title, url: rawData[i].url.match(reg)[0], value: rawData[i].visitCount });
        }
    }

    //去重
    for (let i = 0; i < data.length; i++) {
        let unique = true;
        for (let j = 0; j < filterData.length; j++) {
            if (data[i].url === filterData[j].url) {
                filterData[j].value++;
                unique = false;
            }
        }
        if (unique) {
            filterData.push(data[i]);
        }
    }

    conf.data = filterData;
    cb(conf);
}

//render charts
function renderChart(conf) {

    let data = conf.data;

    let option = {
        title: {
            text: 'History-V',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '访问来源',
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
            }
        ]
    };



    // type = conf.type || 'line';

    let myChart = echarts.init(document.querySelector('#history'));

    myChart.setOption(option);
}

getAllHistory();
