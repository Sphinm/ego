/**
 * 编辑或删除作品弹窗组件
 * 这个组件本来是想做一个公共modal去给别的modal实现继承的，但是后面觉得差的有点多久单独写了
 * */

(function(){
    // 接口实现
    // 基础modal

    // 标题
    // 自定义内容
    // 关闭按钮
    // 确定
    // 取消

    var html = `<div class="m-confirm">
		<span class="close_btn u-icon u-icon-close"></span>
		<div class="modal_tt">
			<strong>提示信息 :</strong>
		</div>
		<div class="modal_ct">
			<p class="confirm_msg"></p>
			<button class="u-btn u-btn-primary submit_btn">确定</button>
			<button class="u-btn u-btn-primary cancel_btn">取消</button>
		</div>
	</div>`;

    // Modal 实现
    function Modal(options) {
        // 将原型上的_layout赋值一份到Modal构造函数中，保证每个实例有自己的节点
        // cloneNode方法，设置为 true，如果您需要克隆节点及其属性，以及后代，设置为 false，如果您只需要克隆节点及其后代
        this.container = this._layout.cloneNode(true);

        // 缓存节点
        this.title = this.container.querySelector('.modal_tt');
        this.confirm_msg = this.container.querySelector('.confirm_msg');
        this.submit_btn = this.container.querySelector('.submit_btn');
        this.close_btn = this.container.querySelector(".close_btn");
        this.cancel_btn = this.container.querySelector('.cancel_btn');

        // 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
        _.extend(this, options);

        this._initEvent();
    }

    // 事件注册
    _.extend( Modal.prototype, _.emitter);

    // 构建Modal方法
    _.extend(Modal.prototype, {

        // 根据模板转换为节点
        _layout: _.html2node(html),

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
            msg.title && (this.title.innerHTML = msg.title);
            this.confirm_msg.innerHTML = msg.content || '';
            this.confirmCallBack = msg.confirmCallBack || console.log('没有回调事件');
            this.show();
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

        // 事件初始化
        _initEvent: function() {
            // 注册confirm事件，在作品列表页的编辑和删除事件上触发
            this.on('confirm', this.showMsg.bind(this));
            _.addEvent(this.close_btn, 'click',this.hide.bind(this));
            _.addEvent(this.cancel_btn, 'click', this._onCancel.bind(this));
            _.addEvent(this.submit_btn, 'click', function (event) {
                this.confirmCallBack(event);
                this.hide();
            }.bind(this));

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