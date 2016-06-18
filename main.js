var _url = document.URL;

// 判断是否打开
try {
    if (typeof('_hasHelper') == "undefined") {
        var _hasHelper = false;
    }
} catch (e) {
    var _hasHelper = false;
}
if (_hasHelper) {
    alert('程序已经打开！');
} else {
    // 选择页面
    if (_url.slice(33, 43) == "MemberList") { // 在用户列表界面
        $.getScript("http://work.bcpu.tk/im9helper/memberlist.js");
    } else if (_url.slice(33, 41) == "PostList") { // 在用户列表界面
        alert('帖子页面');
    } else {
        _hasHelper = false;
        alert('请在兴趣圈管理界面使用！');
    }
}
