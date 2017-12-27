(function () {
    /**
     * 页面初始化
     */
    function Ego() {
        this.ajax = new Ajax();
        this.model = new Model(this.ajax);
        this.template = new Template();
        this.view = new View(this.template);
        this.controller = new Controller(this.model, this.view);
    }

    var ego = new Ego();

    function setView() {
        ego.controller.setView();
    }

    setView();
})();
