/**
 * 最近七日的信息页面
 */
(function() {
    /*
     * 添加各类引用
     */
    if (!_hasHelper) {
        // 加入echarts
        $.getScript("http://cdn.bootcss.com/echarts/3.1.10/echarts.min.js");
        // 外部样式表
        $("head").append("<link>").children("link:last").attr({
            rel: "stylesheet",
            type: "text/css",
            href: "http://work.bcpu.tk/im9helper/css/main.css"
        });
        _hasHelper = true;
    }

    var box = $("<div class='chartbox'></div>").appendTo(".main-content-page"); // 图表盒
    var chartlist = $('<div class ="chart" style = "height:600px"></div>').css("display", "none").appendTo(box); // 图表列表
    var chartinfo = $('<div class = "chartinfo">请点击按钮</div>').appendTo(box); // 信息显示区
    var buttlist = $('<input type = "button" class = "chartbutton" value = "生成图表"/>');// 按钮列表
    var weekinfo = [];
    var weekinfosrc = $($("table").children()[1]).children()
    weekinfosrc.each(function() {
        var a = []
        weekinfo.push(a);
        $(this).children().each(function() {
            a.push($(this).text());
        });
    })//解析table
    weekinfo.reverse();
    weekdata = dataHandle(weekinfo);
    buttlist.click(function(){
        chartlist.css("display", "block");
        createChart(weekdata);
        chartinfo.text("七日数据");
    })
    box.append(buttlist);
    function dataHandle(list) { //数据处理
        var data = [[],[],[],[],[]];
        var e = 1;
        for (var i in list) {
            data[0].push(list[i][0]);
            e = 1;
            while(e<5){
                data[e].push(parseInt(list[i][e]));
                e++;
            }
        }
        return data;
    }
    /**
     * 生成图表
     * @param {[type]} list 数据
     */
    function createChart(datares) {
        var myChart = echarts.init(chartlist[0]);
        myChart.showLoading(); // 加载动画
        var option = { // 指定图表的配置项和数据
            title: {
                text: '兴趣圈周数据'
            },
            backgroundColor: '#fff',
            grid: [
                {top: '10%', height: '38%'},
                {top: '56%', height: '38%'}
            ],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['日增人数','总人数','发帖','回复']
            },
            xAxis: [
                {
                    gridIndex: 0,
                    data: datares[0]
                },
                {
                    gridIndex: 1,
                    data: datares[0]
                }
            ],
            yAxis:  [
                {
                    gridIndex: 0,
                    name: '日增人数',
                    type: 'value'
                },
                {
                    gridIndex: 0,
                    name: '总人数',
                    type: 'value',
                    min:'datamin'
                },
                {
                    gridIndex: 1,
                    name: '发帖',
                    type: 'value'
                },
                {
                    gridIndex: 1,
                    name: '回复',
                    type: 'value'
                }
                ],
            series: [
                {
                    name: '日增人数',
                    type: 'line',
                    xAxisIndex: [0],
                    yAxisIndex: [0],
                    data: datares[1]
                },
                {
                    name: '总人数',
                    type: 'line',
                    xAxisIndex: [0],
                    yAxisIndex: [1],
                    data: datares[2]
                },
                {
                    name: '发帖',
                    type: 'line',
                    xAxisIndex: [1],
                    yAxisIndex: [2],
                    data: datares[3]
                },
                {
                    name: '回复',
                    type: 'line',
                    xAxisIndex: [1],
                    yAxisIndex: [3],
                    data: datares[4]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.hideLoading();
        myChart.setOption(option);
    }
})();
