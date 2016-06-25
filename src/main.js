/*jshint unused: false */
var _url = document.URL,
    _baseUrl = "http://git.oschina.net/BCPU/IM9-Helper/raw/master/src";

/**
 * 字符串乘法
 * @param  {int} n    times
 * @return {String} string
 */
String.prototype.x = function(n) {
    var html = '';
    var i = 0;
    while (i < n) {
        html += this;
        i++;
    }
    return html;
};
/**
 * 字符串是否开始于
 * @param  {String} str    待比较的字符串
 * @return {String} string
 */
String.prototype.startWith = function(str) {
    if (str == null || str === "" || this.length === 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) === str)
        return true;
    else
        return false;
    return true;
};

// 判断是否打开
try {
    if (typeof('_hasHelper') === "undefined") {
        var _hasHelper = false;
    }
} catch (e) {
    var _hasHelper = false;
}
if (_hasHelper) {
    alert('程序已经打开！');
} else {
    // 生成表数据
    var tableInfo = $("#community_name").html() + " " + 　new Date().toLocaleDateString();
    if (_url.startWith("http://www.im9.com/manage/manage-MemberList.html")) { // 在用户列表界面
        $.getScript(_baseUrl + "/resolver/MemberList.js");
    } else if (_url.startWith("http://www.im9.com/manage/manage-PostList.html")) { // 在帖子界面
        $.getScript(_baseUrl + "/resolver/PostList.js");
    } else if (_url.startWith("http://www.im9.com/manage/manage-activeCalculate.html")) { // 在圈统计界面
        $.getScript(_baseUrl + "/resolver/ActiveCalculate.js");
    } else {
        _hasHelper = false;
        alert('请在兴趣圈管理界面使用！');
    }
}
