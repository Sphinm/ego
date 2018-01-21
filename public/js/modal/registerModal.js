/**
 * RegisterModal
 * 注册弹窗组件
 * */

(function () {

    var html = `<div class="u-register">
        <div class="reg-content">
        <span class="close_btn u-icon u-icon-close"></span>
        <div class="reg-logo"></div>
        <form class="m-form" id="registerform">
            <div class="u-formitem">
                <label for="phone" class="formitem_tt">手机号</label>
                <input id="phone" name="phone" autocomplete="off" placeholder="请输入11位手机号码" class="formitem_ct u-ipt yuan"/>
            </div>
            <div class="u-formitem">
                <label for="nickname" class="formitem_tt">昵 称</label>
                <input id="nickname" name="nickname" autocomplete="off" placeholder="中英文均可，至少8个字符" class="formitem_ct u-ipt yuan"/>
            </div>
            <div class="u-formitem">
                <label for="password" class="formitem_tt">密 码</label>
                <input type="password" id="password" autocomplete="off" name="password" placeholder="长度6-16个字符，不包含空格" class="yuan formitem_ct u-ipt"/>
            </div>
            <div class="u-formitem">
                <label for="comform_password" class="formitem_tt">确认密码</label>
                <input type="password" id="comform_password" autocomplete="off" name="comform_password" placeholder="" class="yuan formitem_ct u-ipt"/>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">性 别</label>
                <div class="formitem_ct">
                    <div class="sex_box">
                        <label class="radio">
                            <input type="radio" name="sex" checked value=0 />
                            <i class="u-icon u-icon-radio"></i>少男
                        </label>
                        <label class="radio">
                            <input type="radio" name="sex" value=1 />
                            <i class="u-icon u-icon-radio"></i>少女
                        </label>
                    </div>
                </div>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">生 日</label>
                <div class="formitem_ct">
                    <div class="m-cascadeselect birthday_select" id="birthday"></div>
                </div>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">所在地</label>
                <div class="formitem_ct">
                    <div class="m-cascadeselect location_select" id="location"></div>
                </div>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">验证码</label>
                <div class="formitem_ct validate">
                    <img class="captchaImg" src="/captcha" alt="" />
                    <input type="text" autocomplete="off" id="captcha" class="u-ipt" />
                </div>
            </div>
            <div class="terms">
                    <input type="checkbox" id="remember" class="u-checkbox"/>
                    <label for="remember"></label>
                    <span><a href="#" class="read">我已阅读并同意相关条款</span>
            </div>
            <div class="u-error f-dn">
                <span class="u-icon-error"></span>
                <span id="errormsg"></span>
            </div>
            <button id="submit" class="u-btn u-btn-primary" type="submit">注&nbsp;&nbsp;册</button>
        </form>
        </div>
    </div>`;

    function RegisterModal(opt) {
        opt = opt || {};
        _.extend(this, opt);

        this.container = this._layout.cloneNode(true);

        // 缓存节点
        this.closeBtn =  this.container.querySelector('.close_btn');
        this.captchaImg = this.container.querySelector('.captchaImg');
        this.phone = this.container.querySelector('#phone');
        this.nick = this.container.querySelector('#nickname');
        this.pwd = this.container.querySelector('#password');
        this.confirmpwd = this.container.querySelector('#comform_password');
        this.captcha = this.container.querySelector('#captcha');
        this.errorParent = this.container.querySelector('.u-error');
        this.nError = this.container.querySelector('#errormsg');
        this.submitBtn = this.container.querySelector('#submit');

        // 初始化选择器和注册弹窗
        this.initSelects();
        this.initRegisterEvent();
    }

    // 事件发射器
    _.extend( RegisterModal.prototype, _.emitter);

    _.extend(RegisterModal.prototype, {

        _layout: _.html2node(html),

        show: function () {
            // 给html的body节点增加整个窗体节点
            document.body.appendChild(this.container);
        },

        hide: function () {
            var container = this.container;
            document.body.removeChild(container);
        },

        // 级联选择器初始化入口
        initSelects: function(){
            this.birthdaySelect = new Cascade({
                parent: this.container.querySelector('.birthday_select'),
                data: _.createDateData()
            });
            this.locationSelect = new Cascade({
                parent:this.container.querySelector('.location_select'),
                data: _.toSelectData(ADDRESS_CODES)
            });
        },

        // 给验证码加一个随机时间戳
        resetCaptcha : function(){
            // +new Date()  在github上一篇博客上看到一种很巧妙通过'+'号实现隐式转换拿到时间戳的方法
            // 通过new.Date().getTime() 或者通过new.Date().valueOf() 方式也可以
            this.captchaImg.src = `/captcha?t=${+new Date()}`
        },


        check: function(){
            var isValid = true;

            // 隐藏错误信息框
            _.addClassName(this.errorParent, 'f-dn');

            // 验证数据
            var checkList = [
                [this.phone, ['require', 'phone']],
                [this.nick, ['require', 'nickname']],
                [this.pwd, ['require', 'length']],
                [this.confirmpwd, ['require', 'length']],
                [this.captcha, ['require']],
            ];
            isValid = this.checkRules(checkList);

            return isValid;
        },

        // 显示错误信息
        showMessage: function (msg) {
            this.nError.innerText = msg;
            _.delClassName(this.errorParent, 'f-dn');
        },

        // 检测规则
        // 这里写的还是有点问题,表单检测这块不是很熟
        checkRules: function(checkRules){
            var that = this;
            var check_result = true;

            for(var i=0;i<checkRules.length;i++){
                var checkItem = checkRules[i][0],
                    rules = checkRules[i][1],
                    flag;

                _.delClassName(checkItem, 'error');

                for(var j=0;j<rules.length;j++){
                    var key = rules[j];
                    switch(key){
                        case 'require':
                            flag = !_.isNotEmpty(checkItem.value);
                            if (!!flag) {
                                var a= '您的信息没有输入完整哦!';
                                that.showMessage(a)
                            }
                            break;
                        case 'phone':
                            flag = _.isPhone(checkItem.value);
                            if (!flag) {
                                var b = '输入的手机号码不正确!';
                                this.showMessage(b)
                            }
                            break;
                        case 'nickname':
                            flag = _.isNickName(checkItem.value);
                            if (!flag) {
                                var c = '您输入的昵称不符合要求哦!';
                                this.showMessage(c)
                            }
                            break;
                        case 'length':
                            flag = _.pwdLength(checkItem.value, 6, 16);
                            if (!flag) {
                                var d = '您输入的密码不正确哦!';
                                this.showMessage(d)
                            }
                            if (!!flag && this.confirmpwd.value !== this.pwd.value){
                                var e = '两次输入的密码不一致!';
                                this.showMessage(e);
                                _.addClassName(checkRules[3][0], 'error');
                            }
                            break;
                    }
                    if(!flag) break;
                }
                flag || _.addClassName(checkItem, 'error');
                flag || (check_result = false);
            }

            flag && _.addClassName(this.errorParent, 'f-dn');

            return check_result;
        },

        // 验证通过后提交信息
        // 这里如何比对图片中验证码是否输入准确呢？
        submit: function(event){
            event.preventDefault();
            if(this.check()){

                var data = {
                    username: this.phone.value.trim(),
                    nickname: this.nick.value.trim(),
                    password: hex_md5(this.pwd.value),
                    sex: this.getRadioValue('registerform', 'sex'),
                    captcha: this.captcha.value.trim(),
                };

                this.birthday = this.birthdaySelect.getValue().join('-');
                this.location = this.locationSelect.getValue();
                data.province = this.location[0];
                data.city = this.location[1];
                data.district = this.location[2];
                data.birthday = this.birthday;
                // 发送请求

                _.ajax({
                    url:'/api/register',
                    method:'POST',
                    data:data,
                    success:function(data){
                        data = JSON.parse(data);
                        if(data.code === 200){
                            this.hide();
                            this.emit('showLoginModal');
                        }
                        else{
                            this.nError.innerText = data;
                            this.showError();
                        }
                    }.bind(this),
                    fail:function(){}
                });
            }
        },

        // 获取性别
        getRadioValue: function(registerform, sex){
            return document.getElementById(registerform)[name=sex].value;
        },

        // 和showMessage方法写的重复了
        showError: function(){
            _.delClassName(this.errorParent, 'f-dn');
        },

        // 初始化注册组件并绑定事件
        initRegisterEvent: function(){
            _.addEvent(this.closeBtn, 'click', this.hide.bind(this));
            _.addEvent(this.captchaImg, 'click', this.resetCaptcha.bind(this));
            _.addEvent(this.submitBtn, 'click', this.submit.bind(this));
        }

    });


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = RegisterModal;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return RegisterModal;
        });
    } else {
        // 直接暴露到全局
        window.RegisterModal = RegisterModal;
    }

})();