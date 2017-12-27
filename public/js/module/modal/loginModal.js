!function (_) {
    
    var template = ' <div class="u-modal">\
                        <div class="modal-cnt">\
                               <div class="modal-tt">\
                                    <strong>欢迎回来 </strong>\
                                   <i class="modal_cancel"></i>\
                                    <span>还没有账号？ <a class="u-link" id="goregister">立即注册</a></span>\
                                </div>\
                                <form class="m-form">\
                                    <div class="u-formitem"><input id="username" type="text" placeholder="手机号" class="u-input"> </div>\
                                    <div class="u-formitem u-formitem1"><input id="password" type="password" placeholder="密码" class="u-input"> </div>\
                                    <div class="u-formitem u-formitem2">\
                                        <div class="u-check">\
                                            <input type="checkbox" id="remember" class="u-checkbox">\
                                            <label for="remember"></label>\
                                            <span class="keep-login">保持登录</span>\
                                        </div>\
                                        <span class="f-forget"><a class="u-link">忘记密码？</a></span>\
                                    </div>\
                                    <div class="u-error">\
                                        <span class="u-icon-error"></span>\
                                        <span id="errormsg">账号或密码不正确，请重新输入</span>\
                                    </div>\
                                    <button class="u-btn-primary" type="submit">登&nbsp;&nbsp;录</button>\
                                </form>\
                            </div>\
                        </div>';
    
    function LoginModal() {
        this.container = this._layout.cloneNode(true);

        _.Model.call(this,{});
        this.initLoginEvent();
    }

    // 事件注册
    _.extend( LoginModal.prototype, _.emitter);

    // 继承通用modal
    LoginModal.prototype = Object.create(_.Model.prototype);

    _.extend(LoginModal.prototype,{
        _layout: _.html2node(template),

        initLoginEvent: function () {
            //    绑定提交事件
            //    绑定跳转注册事件
            this.container.querySelector('.u-btn-primary').addEventListener('submit',this.submits.bind(this))
        },
        check: function () {

        },
        submits: function (event) {

        }
    });


    //          5.Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = LoginModal;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return LoginModal;
        });
    } else {
        // 直接暴露到全局
        window.LoginModal = LoginModal;
    }

}(util);