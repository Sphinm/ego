/**
 * LoginModal
 * 登录弹窗组件
 * */

(function () {

    var html = `<div class="u-modal">
                        <div class="modal-cnt">
                               <div class="modal-tt">
                                    <strong>欢迎回来 </strong>
                                    <i class="modal-cancel"></i>
                                    <span>还没有账号？ <a class="u-link" id="goregister">立即注册</a></span>
                                </div>
                                <form class="m-form">
                                    <div class="u-formitem"><input id="username" type="text" autocomplete="off" placeholder="手机号" class="u-input"> </div>
                                    <div class="u-formitem u-formitem1"><input id="password" autocomplete="off" type="password" placeholder="密码" class="u-input"> </div>
                                    <div class="u-formitem u-formitem2">
                                        <div class="u-check">
                                            <input type="checkbox" id="remember" class="u-checkbox">
                                            <label for="remember"></label>
                                            <span class="keep-login">保持登录</span>
                                        </div>
                                        <span class="f-forget"><a class="u-link">忘记密码？</a></span>
                                    </div>
                                    <div class="u-error f-dn">
                                        <span class="u-icon-error"></span>
                                        <span class="errorMsg"></span>
                                    </div>
                                    <button class="u-btn-primary" type="submit">登&nbsp;&nbsp;录</button>
                                </form>
                            </div>
                        </div>`;

    function LoginModal(opt) {
        opt = opt || {};
        _.extend(this, opt);

        this.container = this._layout.cloneNode(true);


        // 缓存节点
        this.userName = this.container.querySelector('#username');
        this.password = this.container.querySelector('#password');
        this.logins = document.querySelector('.m-login');
        this.registers = document.querySelector('.m-register');
        this.loginInfo = document.querySelector('.m-login-info');
        this.close = this.container.querySelector('.modal-tt .modal-cancel');
        this.submit = this.container.querySelector('.u-btn-primary');
        this.remember = this.container.querySelector('.u-checkbox');
        this.ErrorParent = this.container.querySelector('.u-error');
        this.nError = this.container.querySelector('.errorMsg');
        this.goregister = this.container.querySelector('#goregister');


        this.initLoginEvent();

    }

    // 事件发射器
    _.extend(LoginModal.prototype, _.emitter);

    _.extend(LoginModal.prototype,{

        _layout: _.html2node(html),

        show: function() {
            // 给html的body节点增加整个窗体节点
            document.body.appendChild(this.container);
        },

        // 隐藏时候需要把用户填写的数据清空
        hide: function() {
            var container  = this.container;
            document.body.removeChild(container);
            _.addClassName(this.ErrorParent, 'f-dn');
            _.delClassName(this.userName, 'error');
            _.delClassName(this.password, 'error');
            this.userName.value = '';
            this.password.value = '';
        },

        // 点击立即注册隐藏登录modal 触发注册modal
        register: function () {
            this.hide();
            this.emit('showRegisterModal');
        },

        // 登录成功后修改状态
        lastSuc: function () {
            this.logins.style.display = 'none';
            this.registers.style.display = 'none';
            _.delClassName(this.loginInfo, 'f-dn');
        },

        // 和hide方法类似，多了一个触发cancel事件
        onCancel: function() {
            this.emit("cancel");
            this.hide();
        },

        // 检查用户名和密码是否为空以及长度判断
        // 我觉得还需要判断密码输入是否和注册时一致，但是不知道怎么去判断，后面的验证码也是类似
        check: function () {
            var isValid = true,
                flag = true;

            // 验证用户名
            flag = _.isPhone(this.userName.value) && flag;
            flag = !_.isNotEmpty(this.userName.value) && flag;
            flag ? _.delClassName(this.userName, 'error') : _.addClassName(this.userName, 'error');
            isValid = isValid && flag;

            // 验证密码
            flag = true;
            flag = !_.isNotEmpty(this.password.value) && flag;
            flag = _.pwdLength(this.password.value) && flag;
            flag ? _.delClassName(this.password, 'error') : _.addClassName(this.password, 'error');
            isValid = isValid && flag;

            isValid || (this.nError.innerText = '账号或密码错误，请输入正确密码~');

            this.showError();

            isValid ? _.addClassName(this.ErrorParent, 'f-dn'): this.showError();

            return isValid;
        },

        showError: function () {
            _.delClassName(this.ErrorParent, 'f-dn');
        },

        // 提交用户信息前先阻止默认事件
        // 检查cookie状态，并设置选中‘保持登录’的失效时间
        _submit: function (event) {
            var that = this;
            event.preventDefault();

            var user = {
                username: that.userName.value.trim(),
                password: hex_md5(that.password.value),
                remember: !!that.remember.checked
            };


            if (that.check()) {
                _.ajax({
                    url: '/api/login',
                    method: 'POST',
                    data: user,
                    success: function (data) {
                        var dataOrz = JSON.parse(data);
                        console.log(data)
                        if (dataOrz.code === 200) {
                            that.hide();
                            that.emit('login', data.result);
                            that.lastSuc();
                            _.setCookie('loginSuc', 'loginSuc');
                        } else {
                            that.hide();
                            alert('账号可能未注册');
                        }
                    },
                    fail: function () {}
                })
            }
        },

        // 初始化登录弹窗组件并绑定事件
        initLoginEvent: function () {
            //  绑定事件
            _.addEvent(this.close, 'click' ,this.onCancel.bind(this));
            _.addEvent(this.goregister, 'click', this.register.bind(this));
            _.addEvent(this.submit, 'click', this._submit.bind(this));
        },
    });

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
})();
