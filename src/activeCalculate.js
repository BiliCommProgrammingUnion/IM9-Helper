/**
 * 最近七日的信息页面
 * @author airhiki
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

    var box = $("<div class='chartbox'></div>").prependTo(".group-table"); // 图表盒
    $('<div class ="chart"></div>'.x(2)).css("display", "none").appendTo(box);
    var chartlist = $('.chart'), // 图表列表
        chartinfo = $('<div class = "chartinfo">请点击按钮</div>').appendTo(box),
        aValue = ['生成图表', '生成退圈图表']; // 信息显示区
    $('<input type = "button" class = "chartbutton"/>'.x(aValue.length)).appendTo(box).each(function(i) {
        $(this).val(aValue[i]);
    });
    var weekinfo = [];
    $('tbody tr').each(function() {
        var a = [];
        weekinfo.push(a);
        $(this).children().each(function() {
            a.push($(this).text());
        });
    }); // 解析table
    weekinfo.reverse();
    weekdata = dataHandle(weekinfo);
    $('.chartbutton:first').click(function() {
        chartlist.css('display', 'none');
        $(chartlist[0]).height('660px').css("display", "block");
        createChart(weekdata);
        chartinfo.text("七日数据");
    });
    $('.chartbutton:last').click(function() {
        chartlist.css('display', 'none');
        $(chartlist[1]).css("display", "block");
        createChart2(weekdata);
        chartinfo.text("退圈数据");
    });

    function dataHandle(list) { //数据处理
        var data = [
            [],
            [],
            [],
            [],
            []
        ];
        var e = 1;
        for (var i in list) {
            data[0].push(list[i][0]);
            e = 1;
            while (e < 5) {
                data[e].push(parseInt(list[i][e]));
                e++;
            }
        }
        return data;
    }
    /**
     * 生成图表
     * @param {Array} list 数据
     */
    function createChart(datares) {
        var myChart = echarts.init(chartlist[0]);
        myChart.showLoading(); // 加载动画
        var option = { // 指定图表的配置项和数据
            title: {
                text: '兴趣圈周数据',
                subtext: tableInfo
            },
            backgroundColor: '#fff',
            grid: [{
                top: '12%',
                height: '38%'
            }, {
                top: '58%',
                height: '38%'
            }],
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['日增人数', '总人数', '发帖', '回复']
            },
            xAxis: [{
                gridIndex: 0,
                data: datares[0],
                boundaryGap: false
            }, {
                gridIndex: 1,
                data: datares[0],
                boundaryGap: false
            }],
            yAxis: [{
                gridIndex: 0,
                name: '日增人数',
                type: 'value'
            }, {
                gridIndex: 0,
                name: '总人数',
                type: 'value',
                min: 'datamin'
            }, {
                gridIndex: 1,
                name: '发帖',
                type: 'value'
            }, {
                gridIndex: 1,
                name: '回复',
                type: 'value'
            }],
            series: [{
                name: '日增人数',
                type: 'line',
                xAxisIndex: [0],
                yAxisIndex: [0],
                data: datares[1]
            }, {
                name: '总人数',
                type: 'line',
                xAxisIndex: [0],
                yAxisIndex: [1],
                data: datares[2]
            }, {
                name: '发帖',
                type: 'line',
                xAxisIndex: [1],
                yAxisIndex: [2],
                data: datares[3]
            }, {
                name: '回复',
                type: 'line',
                xAxisIndex: [1],
                yAxisIndex: [3],
                data: datares[4]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.hideLoading();
        myChart.setOption(option);
    }
})();
