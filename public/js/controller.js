!function (_) {
    /**
     * Controller层
     */
    function Controller(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    // 页面初始化
    Controller.prototype.setView =function () {
        this._slideShow();

    };

    // Controller层事件
    _.extend(Controller.prototype, {
        init: function () {
            // var t = this;
            this.view.bind('xxx', function () {
                this.handler(xx);
            })
        }
    })
}(util);