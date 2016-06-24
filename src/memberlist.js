/**
 * 成员的信息页面
 * @author airhiki, CharTen
 */
(function() {

    /**
     * 字符串乘法
     * @param  {String} s pre-string
     * @param  {int} n    times
     * @return {String} string
     */
    function strmult(s, n) {
        var html = '';
        var i = 0;
        while (i < n) {
            html += s;
            i++;
        }
        return html;
    }

    /*
     * 添加各类引用
     */
    if (!_hasHelper) {
        // 加入echarts
        $.getScript("http://cdn.bootcss.com/echarts/3.1.10/echarts.min.js");
        // 加入FileSaver
        $.getScript("http://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js");
        // 外部样式表
        $("head").append("<link>").children("link:last").attr({
            rel: "stylesheet",
            type: "text/css",
            href: "http://work.bcpu.tk/im9helper/css/main.css"
        });
        _hasHelper = true;
    }
    var aValue = ["获取数据", "加入时间分布", "注册时间分布", "下载表格"];
    var box = $("<div class='chartbox'></div>").insertBefore(".table-nav"); // 图表盒
    var chartlist = $(strmult('<div class ="chart"></div>', 2)).css("display", "none").appendTo(box); // 图表列表
    var chartinfo = $('<div class = "chartinfo">请点击按钮</div>').appendTo(box); // 信息显示区
    var buttlist = $(strmult('<input type = "button" class = "chartbutton"/>', 4)).each(function(i) {
        $(this).val(aValue[i]);
    }); // 按钮列表
    box.append(buttlist[0]);
    $(".chartbutton").click(MemberListCollect);
    var list = [];
    var totalPage;

    /**
     * 获取成员列表信息
     */
    function MemberListCollect() {
        var i = 1; // 计数器
        var loadimg = $("<img></img>").attr("src", "http://static.yo9.com/web/static/loading.gif?e11a9bf").css("margin", "50px 350px").prependTo(box);
        $(buttlist[0]).css("display", "none"); // 隐藏按钮
        function src(r) { // 被回调函数，处理返回数据，决定是否进行下一次请求
            // console.log(r);
            totalPage = r.data['total_page'];
            var result = r.data.result;
            for (var e in result) {
                list.push(result[e]); // 添加元素
            }
            i++;
            if (i <= totalPage) { //决定是否进行下一次请求,递归调用
                //console.log('当前页数i');
                chartinfo.text("已加载" + i + "页，共" + totalPage + "页……");
                loadList(i, src);
            } else { //获取数据完毕 请求结束 显示结果
                loadimg.css("display", "none");
                afterGetList();
            }
        }

        /**
         * 通过接口加载成员列表
         * @param  {int}   no          页数编号
         * @param  {Function} callback 回调函数
         */
        function loadList(no, callback) {
            // console.log('传入参数no',no);
            var para = getAjaxData({
                "page_no": no
            }); // 准备参数
            para.captcha = window['captcha_key'];
            para.ts = (function() {
                var d = new Date();
                return parseInt(d.getTime().toString().slice(0, 10) + "000");
            })();
            para && $.ajax({ // 发送请求
                url: apiManageList.QueryMemberList,
                type: "get",
                dataType: "json",
                data: para,
                success: function(r) {
                    // console.log('返回值r',r);
                    if (0 === r.code) {
                        callback && callback(r);
                    }
                }
            });
        }

        /**
         * 获取List后的回调
         */
        function afterGetList() {
            chartinfo.text("总人数：" + list.length + ' 总页数：' + totalPage);
            //console.log(list);
            list = list.reverse(); //倒序
            box.append(buttlist[1]);

            buttlist[1].onclick = function() {
                chartlist.css("display", "none");
                $(chartlist[0]).css("display", "block");
                if($(chartlist[0]).children().length){return}
                createChart(list);
            };
            box.append(buttlist[2]);
            buttlist[2].onclick = function() {
                chartlist.css("display", "none");
                $(chartlist[1]).css("display", "block");
                if($(chartlist[1]).children().length){return}
                createChart2(list);
            };
            box.append(buttlist[3]);
            buttlist[3].onclick = function() {
                downloadform(list);
            };
        }
        loadList(1, src);
        chartinfo.text("加载时间较长，请耐心等待……");
    }

    /**
     * 生成图表
     * @param {[type]} list 数据
     */
    function createChart(list) {
        function memberDataHandle(list) { //数据处理
            var data = [];
            var timebase;

            function timereset(time) { //调整为一天开始
                return time.slice(0, 10);
            }
            for (var i in list) {
                timebase = timereset(list[i]['join_time']);
                if (data[timebase]) {
                    data[timebase]++;
                } else {
                    data[timebase] = 1;
                }
            }
            return data;
        }
        var myChart = echarts.init(chartlist[0]);
        myChart.showLoading(); // 加载动画
        var datatime = [];
        var datamember = [];
        var datares = memberDataHandle(list);
        for (var e in datares) { // 取出数据，放入坐标轴
            datatime.push(e);
            datamember.push(datares[e]);
        }
        var option = { // 指定图表的配置项和数据
            title: {
                text: '人数分布'
            },
            backgroundColor: '#fff',
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0, // 左边在 10% 的位置。
                end: 100 // 右边在 60% 的位置。
            }, {
                type: 'inside',
                start: 0,
                end: 100
            }],
            tooltip: {},
            legend: {
                data: ['人数']
            },
            xAxis: {
                data: datatime
            },
            yAxis: {},
            series: [{
                name: '人数',
                type: 'line',
                data: datamember
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.hideLoading();
        myChart.setOption(option);
    }

    /**
     * 创建注册时间图表
     * @param {[type]} list 数据
     */
    function createChart2(list) {
        function memberDataHandle(list) { // 数据处理
            var data = [];
            data["2012年前"] = 0;
            data["2012"] = 0;
            data["2013"] = 0;
            data["2014"] = 0;
            data["2015"] = 0;
            data["2016"] = 0;
            var memberid;
            for (var i in list) {
                memberid = list[i]['member_id'];
                if (memberid >= 20593643) {
                    data["2016"]++;
                } else if (memberid >= 7532843) {
                    data["2015"]++;
                } else if (memberid >= 2954624) {
                    data["2014"]++;
                } else if (memberid >= 680418) {
                    data["2013"]++;
                } else if (memberid >= 259333) {
                    data["2012"]++;
                } else {
                    data["2012年前"]++;
                }
            }
            return data;
        }
        var myChart = echarts.init(chartlist[1]);
        myChart.showLoading(); // 加载动画
        var datares = memberDataHandle(list);
        var datatime = [];
        var datamember = [];

        function newjson(name, value, target) {
            var json = {};
            json.name = name;
            json.value = value;
            target.push(json);
        }
        for (var e in datares) {
            datatime[e] = e;
            newjson(e, datares[e], datamember);
        }
        option = { // 指定图表的配置项和数据
            title: {
                text: '成员注册时间分布图',
                subtext: '>_<',
                x: 'center'
            },
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: datatime
            },
            series: [{
                name: '注册时间',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: datamember,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        myChart.hideLoading();
        myChart.setOption(option);
    }

    /**
     * 下载数据表格
     * @param  result [description]
     * @return none
     */
    function downloadform(result) {
        var table = $("body").append("<table>").children("table:last")
            .addClass("usertable").css("display", "none")
            .append("<tr><th>UID</th><th>USERNAME</th><th>JOIN_TIME</th>");

        for (var i = 0; i < result.length; i++) {
            $("<tr><td>" + result[i]['member_id'] + "</td>" + "<td>" + result[i].username + "</td>" + "<td>" + result[i]['join_time'] + "</td>" + "</tr>").appendTo(table);
        }
        var blob = new Blob([table[0].outerHTML], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, "form.xls");
    }
})();
