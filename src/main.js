var _url = document.URL, _baseUrl = "http://git.oschina.net/BCPU/IM9-Helper/raw/master/src";

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
    // 选择页面
    if (_url.slice(33, 43) === "MemberList") { // 在用户列表界面
        $.getScript(_baseUrl + "/memberlist.js");
    } else if (_url.slice(33, 41) === "PostList") { // 在用户列表界面
        $.getScript(_baseUrl + "/article.js");
    } else {
        _hasHelper = false;
        alert('请在兴趣圈管理界面使用！');
    }
}
