/**
 * 成员的信息页面
 * @author airhiki, CharTen, KAAAsS
 */
/*jshint unused: false */
/*jshint evil: true */
/*jshint eqeqeq: false */
/*jshint -W041 */
(function() {
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
    var aValue = ["加入时间分布", "入圈时间分布", "新人发帖指数", "发言成员分布", "下载表格"],
        $box = $("<div class='chartbox'></div>").insertBefore(".table-nav"), // 图表盒
        $chartlist = $('<div class ="chart"></div>'.x(aValue.length - 1)).css("display", "none").appendTo($box); // 图表列表
    $('<div class="progress"><div class="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 0%">0%</div></div>').css("display", "none").appendTo($box); // 进度条
    var $chartinfo = $('<div class = "chartinfo">正在载入，请稍后……</div>').appendTo($box), // 信息显示区
        $buttlist = $('<input type = "button" class = "chartbutton"/>'.x(aValue.length)).each(function(i) {
            $(this).val(aValue[i]);
        }), // 按钮列表
        tips = []; // 提示列表
    memberListCollect();
    var list = [],
        totalPage;

    /**
     * 获取成员列表信息
     */
    function memberListCollect() {
        var i = 1, // 计数器
            loadimg = $("<img></img>").attr("src", "http://static.yo9.com/web/static/loading.gif?e11a9bf").css("margin", "50px 350px").prependTo($box),
            progress = 0;
        $('.progress').css("display", "block"); // 显示进度条
        function src(r) { // 被回调函数，处理返回数据，决定是否进行下一次请求
            // console.log(r);
            totalPage = r.data['total_page'];
            var result = r.data.result;
            for (var e in result) {
                list.push(result[e]); // 添加元素
            }
            i++;
            if (i <= totalPage) { // 决定是否进行下一次请求,递归调用
                // console.log('当前页数i');
                progress = Math.floor(i / totalPage * 100);
                $('.progress').children().attr("aria-valuenow", progress)
                    .css("width", progress + '%').text(progress + '%'); // 更改进度条
                $chartinfo.text("已加载" + i + "页，共" + totalPage + "页……");
                loadList(i, src);
            } else { // 获取数据完毕 请求结束 显示结果
                $('.progress').css("display", "none");
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
            para['page_size'] = 100;
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
            $chartinfo.text("总人数：" + list.length + ' 总页数：' + totalPage);
            // console.log(list);
            list = list.reverse(); //倒序
            $buttlist.each(function(index, el) {
                if (index < $buttlist.length - 1) { // 除去表格按钮
                    $box.append(el);
                    el.onclick = function() {
                        $chartlist.css('display', 'none');
                        $box.scrollTo();
                        $($chartlist[index]).css("display", "block");
                        if ($($chartlist[index]).children().length) {
                            $chartinfo.text(tips[index]);
                            return;
                        }
                        eval('createChart' + (index + 1))(list);
                    };
                }
            });
            $box.append($buttlist[$buttlist.length - 1]);
            $buttlist[$buttlist.length - 1].onclick = function() {
                downloadform(list);
            };
        }
        loadList(1, src);
        $chartinfo.text("加载时间较长，请耐心等待……");
    }

    /**
     * 生成圈人数变化图表
     * @param {Array} list 数据
     */
    function createChart1(list) {
        function dataHandle(list) { //数据处理
            var data = [],
                datares = [
                    [],
                    []
                ],
                timecount = new Date(list[0]['join_time'].slice(0, 10) + " 00:05:00"), //起始时间
                timeend = new Date(),
                timebase;

            while (timecount < timeend) { //填充时间轴
                data[timecount.toLocaleDateString()] = 0;
                timecount.setTime(timecount.getTime() + 86400000); //续一天
            }
            for (var i in list) { //填数据
                timebase = new Date(list[i]['join_time']);
                data[timebase.toLocaleDateString()]++;
            }
            for (var e in data) { //拆分坐标轴
                datares[0].push(e);
                datares[1].push(data[e]);
            }
            return datares;
        }
        $chartinfo.text(tips[0] = '管理的好的话，会吸引很多小伙伴呢~');
        var myChart = echarts.init($chartlist[0]),
            datares = dataHandle(list);
        myChart.showLoading(); // 加载动画
        var option = { // 指定图表的配置项和数据
            title: {
                text: '圈人数变化',
                subtext: tableInfo
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
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['当日人数变化']
            },
            xAxis: {
                data: datares[0],
                boundaryGap: false
            },
            yAxis: {},
            series: [{
                name: '当日人数变化',
                type: 'line',
                data: datares[1]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.hideLoading();
        myChart.setOption(option);
    }

    /**
     * 创建入圈时间图表
     * @param {Array} list 数据
     */
    function createChart2(list) {
        function dataHandle(list) { // 数据处理
            var data = [],
                datares = [
                    [],
                    []
                ],
                memberid;
            data["早于2012"] = 0;
            data["2012"] = 0;
            data["2013"] = 0;
            data["2014"] = 0;
            data["2015"] = 0;
            data["2016"] = 0;
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
                    data["早于2012"]++;
                }
            }
            var most = '早于2012';
            for (var p in data) {
                if (data[p] > data[most])
                    most = p;
            }
            $chartinfo.text(tips[1] = ('看来最多的是注册于 ' + most + ' 年的小伙伴呢……'));

            function newjson(name, value, target) {
                var json = {};
                json.name = name;
                json.value = value;
                target.push(json);
            }
            for (var e in data) {
                datares[0].push(e);
                newjson(e, data[e], datares[1]);
            }
            return datares;
        }
        var datares = dataHandle(list),
            myChart = echarts.init($chartlist[1]);
        myChart.showLoading(); // 加载动画
        option = { // 指定图表的配置项和数据
            title: {
                text: '成员注册时间分布图',
                subtext: tableInfo,
                x: 'center'
            },
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: datares[0]
            },
            series: [{
                name: '注册时间',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: datares[1],
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
     * 创建新人发帖指数
     * @param {Array} list 数据
     */
    function createChart3(list) {
        /**
         * 将可读字符串转为unix时间戳
         * @param  {String} time 可读字符串
         * @return {int}         unix时间戳
         */
        function toTimestamp(time) {
            var ts = Date.parse(new Date(time));
            return ts /= 1000;
        }
        /**
         * 将unix时间戳转为可读字符串日期
         * 示例：*年*月*日
         * @param  {int} unix  unix时间戳
         * @return {String}    可读字符串
         */
        function toDateStr(unix) {
            var date = new Date();
            date.setTime(unix * 1000);
            return date.toLocaleDateString();
        }
        /*
        Parse start
         */
        var i = 0,
            cTime = Math.round(new Date().getTime() / 1000),
            newMemTime = 604800,
            lastTime = cTime - 2 * 604800, // 只需要改变这个即可确定最后的日期
            data = [],
            usrTime = 0;
        while (cTime > lastTime) {
            data[cTime] = [];
            data[cTime]['post'] = 0;
            data[cTime]['reply'] = 0;
            for (var i in list) {
                usrTime = toTimestamp(list[i]['join_time']);
                if (usrTime < cTime - newMemTime)
                    continue;
                if (usrTime > cTime)
                    break;
                data[cTime]['post'] += list[i]['post_count'];
                data[cTime]['reply'] += list[i]['reply_count'];
            }
            cTime -= 86400;
        }
        // console.debug(data);
        /*
        Draw start
         */
        var myChart = echarts.init($chartlist[2]),
            timeInfo = [];
        myChart.showLoading(); // 加载动画
        data['cPostData'] = [];
        data['cReplyData'] = [];
        data['averagePost'] = 0;
        data['averageReply'] = 0;
        for (var time in data) {
            if (isNaN(time))
                continue;
            timeInfo.push(toDateStr(time));
            data['cPostData'].push(data[time]['post']);
            data['cReplyData'].push(data[time]['reply']);
            data['averagePost'] += data[time]['post'] / 7;
            data['averageReply'] += data[time]['reply'] / 7;
        }
        $chartinfo.text(tips[2] = '7天的入圈者发帖平均数据：发帖 ' + data['averagePost'].toFixed(2) + ' 个，回复：' + data['averageReply'].toFixed(2) + ' 个。');
        option = { // 指定图表的配置项和数据
            title: {
                text: '新人发帖指数',
                subtext: tableInfo
            },
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['7日内入圈者发帖数', '7日内入圈者回复数']
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '17%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timeInfo
            },
            yAxis: [{
                name: '发帖数',
                type: 'value'
            }, {
                name: '回复数',
                type: 'value'
            }],
            series: [{
                name: '7日内入圈者发帖数',
                type: 'line',
                yAxisIndex: [0],
                data: data['cPostData']
            }, {
                name: '7日内入圈者回复数',
                type: 'line',
                yAxisIndex: [1],
                data: data['cReplyData']
            }]
        };
        myChart.hideLoading();
        myChart.setOption(option);
    }

    /**
     * 创建最多发言者
     * @param {Array} list 数据
     */
    function createChart4(list) {
        /**
         * 快速排序
         * @param  {Array}  array 待排序数组
         * @param  {String} index 排序采用的字段
         * @return {Array}        排序结果
         */
        function quickSort(oArray, index) {
            // 去除数据只有0的项目
            var array = []; // 防止更改源数组
            for (var i = 0; i < oArray.length; i++) {
                if (oArray[i][index] !== 0) {
                    array.push(oArray[i]);
                }
            }
            var i = 0;
            var j = array.length - 1;
            var sort = function(i, j) {
                if (i === j) {
                    return;
                }
                var key = array[i];
                var tempi = i;
                var tempj = j;
                while (j > i) {
                    if (array[j][index] >= key[index]) {
                        j--;
                    } else {
                        array[i] = array[j];
                        while (j > ++i) {
                            if (array[i][index] > key[index]) {
                                array[j] = array[i];
                                break;
                            }
                        }
                    }
                }
                if (tempi === i) {
                    sort(++i, tempj);
                    return;
                }
                array[i] = key;
                sort(tempi, i);
                sort(j, tempj);
            };
            sort(i, j);
            return array;
        }
        var myChart = echarts.init($chartlist[3]),
            data = [],
            post; // ,reply;
        myChart.showLoading(); // 加载动画
        /*
        Parse start
         */
        post = quickSort(list, 'post_count').reverse();
        reply = quickSort(list, 'reply_count').reverse();
        $chartinfo.text(tips[3] = '圈里有 ' + post.length + ' 人发帖过，有 ' + reply.length + ' 人回复过。');
        if (post.length > 10) {
            post = post.slice(0, 10);
        }
        if (reply.length > 10) {
            reply = reply.slice(0, 10);
        }
        // console.debug(post);
        /*
        Draw start
         */
        function newjson(name, value, selected, target) {
            var json = {};
            json.name = name;
            json.value = value;
            if (selected)
                json.selected = true;
            target.push(json);
        }
        data['name'] = [];
        data['posts'] = [];
        data['replys'] = [];
        for (var i in post) {
            data['name'][i] = post[i]['username'];
            newjson(post[i]['username'], post[i]['post_count'], i == 0, data['posts']);
        }
        for (var i in reply.reverse()) {
            data['name'].push(reply[i]['username']);
            newjson(reply[i]['username'], reply[i]['reply_count'], i == reply.length - 1, data['replys']);
        }
        option = { // 指定图表的配置项和数据
            title: {
                text: '发言成员分布图',
                subtext: tableInfo,
                x: 'center'
            },
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: data['name']
            },
            series: [{
                name: '发帖数',
                type: 'pie',
                selectedMode: 'single',
                radius: '50%',
                center: ['30%', '50%'],
                data: data['posts']
            }, {
                name: '回复数',
                type: 'pie',
                selectedMode: 'single',
                radius: '50%',
                center: ['70%', '50%'],
                data: data['replys']
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
