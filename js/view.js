!function (_) {
    /**
     * view层 提供两个接口：
     *  bind(eventName, handler)
     *  事件注册和处理
     *
     *  render(command, parameterObject)
     *  绘制（根据命令和选择项）
     */

    function View(template) {
        _.extend(this, template);

        // Tabs
        this.tabs = document.querySelector('.m-tabs');

        // search
        this.search = document.querySelector('.m-search');

        // slide
        this.slide = document.querySelector('.g-banner');

    }

    // 事件注册
    _.extend(View.prototype, _.emitter);

    // view层事件
    _.extend(View.prototype, {
        bind: function (event, handler) {
            var t = this;
        },

        render: function (viewCmd, parameter) {
            var t = this;
        }
    })


    //          Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = View;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return View;
        });
    } else {
        // 直接暴露到全局
        window.View = View;
    }
}(util);