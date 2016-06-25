/**
 * 这是IM9 Helper所需的jQuery相关函数库
 * @author KAAAsS
 */

/*jshint -W032 */
;
(function($) {
    function arrayToJson(o) {
        var r = [];
        if (typeof o === "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o === "object") {
            if (!o.sort) {
                for (var i in o)
                    r.push(i + ":" + arrayToJson(o[i]));
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++) {
                    r.push(arrayToJson(o[i]));
                }
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString();
    }
    // 增加jQuery內建方法
    $.fn.extend({
        "scrollTo": function(speed) {
            if (speed === undefined) var speed = 800;
            if (this.prop('id') !== "") $.history("#" + this.prop('id'));
            $("html,body").stop(true).animate({
                    scrollTop: this.offset().top
                },
                speed);
            return this;
        },
        "store": function(key) {
            if (key !== undefined)
                $.store(key, this.serializeArray()); // JSON.stringifier
            return this;
        }
    });
    // 增加jQuery全局方法
    $.extend({
        history: function(url) {
            if (url === undefined) return;
            history.pushState(null, "", url);
        },
        scrollTo: function(filter, speed) {
            if (speed === undefined) var speed = 2000;
            if (filter === undefined) var filter = 'body';
            $(filter).eq(0).scrollTo(speed);
        },
        store: function(key, value) {
            if (key === undefined) return false;
            if (value === undefined) { // 取值
                return localStorage.getItem(key);
            } else { // 设置值
                if (value === null) {
                    localStorage.removeItem(key);
                    return true;
                }
                if (Object.prototype.toString.call(value) !== "[object String]") { // 如果value不是字符串
                    value = arrayToJson(value); // JSON.stringifier(value);
                }
                if (value.length > 5200000) return false;
                return localStorage.setItem(key, value);
            }
        }
    });
})(jQuery);
