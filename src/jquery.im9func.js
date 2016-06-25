/**
 * 这是IM9 Helper所需的jQuery相关函数库
 * @author KAAAsS
 */

/*jshint -W032 */
;
(function($) {
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
        }
    });
})(jQuery);
