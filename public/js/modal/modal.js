(function(){
    // 接口实现
    // 基础modal

    // 标题
    // 自定义内容
    // 关闭按钮
    // 确定
    // 取消

    var template = `<div class="m-alertmodal">
		<span class="close_btn u-icon u-icon-close"></span>
		<div class="modal_tt">
			<strong>提示信息 :</strong>
		</div>
		<div class="modal_ct">
			<p class="alert_msg">确定要删除“唯美的”的吗</p>
			<button class="u-btn u-btn-primary submit_btn">确定</button>
			<button class="u-btn u-btn-primary cancel_btn">取消</button>
		</div>
	</div>`;

    // Modal 实现
    function Modal(options) {
        // 将原型上的_layout赋值一份到Modal构造函数中，保证每个实例有自己的节点
        // cloneNode方法，设置为 true，如果您需要克隆节点及其属性，以及后代，设置为 false，如果您只需要克隆节点及其后代
        // 即 div.m-modal 节点
        this.container = this._layout.cloneNode(true);
        this.alert_msg = this.container.querySelector('.alert_msg');
        this.submit_btn = this.container.querySelector('.submit_btn');
        this.close_btn = this.container.querySelector(".close_btn");
        this.cancel = this.container.querySelector('.cancel_btn');

        // 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
        _.extend(this, options);


        // 初始化事件
        this._initEvent();
    }

    // 事件注册
    _.extend( Modal.prototype, _.emitter);

    // 构建Modal方法
    _.extend(Modal.prototype, {

        // 根据模板转换为节点
        _layout: _.html2node(template),

        setContent: function(content){
            if(!content) return;
            //支持两种字符串结构和DOM节点
            if(content.nodeType === 1){
                this.body.innerHTML = "";
                this.body.appendChild(content);
            }else{
                this.body.innerHTML = content;
            }
        },

        // Modal show接口
        show: function(content) {
            if(content) this.setContent(content);
            // 给html的body节点增加整个窗体节点
            document.body.appendChild(this.container);
        },

        showMsg: function (msg) {
            this.alert_msg.innerText = msg;
            this.show()
        },

        // Modal hide接口
        hide: function() {
            var container = this.container;
            document.body.removeChild(container);
        },

        _onCancel: function() {
            this.emit("cancel");
            this.hide();
        },
        _onSubmit:function () {

        },

        // 事件初始化
        _initEvent: function() {
            this.on('confirm', this.showMsg.bind(this));
            _.addEvent(this.close_btn, 'click',this._onCancel.bind(this));
            _.addEvent(this.cancel, 'click', this._onCancel.bind(this));
            _.addEvent(this.submit_btn, 'click', this._onSubmit.bind(this))
        }
    });


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Modal;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Modal;
        });
    } else {
        // 直接暴露到全局
        window.Modal = Modal;
    }

})();