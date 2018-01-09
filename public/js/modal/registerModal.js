(function () {

    var html = `<div class="u-register">
        <div class="reg-content">
        <span class="close_btn u-icon u-icon-close"></span>
        <div class="reg-logo"></div>
        <form class="m-form" id="registerform">
            <div class="u-formitem">
                <label for="phone" class="formitem_tt">手机号</label>
                <input id="phone" name="phone" placeholder="请输入11位手机号码" class="formitem_ct u-ipt yuan"/>
            </div>
            <div class="u-formitem">
                <label for="nickname" class="formitem_tt">昵 称</label>
                <input id="nickname" name="nickname" placeholder="中英文均可，至少8个字符" class="formitem_ct u-ipt yuan"/>
            </div>
            <div class="u-formitem">
                <label for="password" class="formitem_tt">密 码</label>
                <input type="password" id="password" name="password" placeholder="长度6-16个字符，不包含空格" class="yuan formitem_ct u-ipt"/>
            </div>
            <div class="u-formitem">
                <label for="comform_password" class="formitem_tt">确认密码</label>
                <input type="password" id="comform_password" name="comform_password" placeholder="" class="yuan formitem_ct u-ipt"/>
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
                    <input type="text" id="captcha" class="u-ipt" />
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
        this.checkbox = this.container.querySelector('.u-checkbox');
        this.errorParent = this.container.querySelector('.u-error');
        this.nError = this.container.querySelector('#errormsg');
        this.submitBtn = this.container.querySelector('#submit');

        // 初始化
        this.initSelects();
        this.initRegisterEvent();
    }

    // 事件注册
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
        initSelects: function(){
            // 生日 级联选择器
            this.birthdaySelect = new Cascade({
                parent: this.container.querySelector('.birthday_select'),
                // 生日数据（为了让 生日和地址 可以共用一个级联选择器组件，则构造相同的数据结构）
                data: _.createDateData()
            });
            // 地址 级联选择器
            this.locationSelect = new Cascade({
                parent:this.container.querySelector('.location_select'),
                // 地址数据
                data: _.toSelectData(ADDRESS_CODES)
            });
        },

        resetCaptcha : function(){
            // +new Date()  在github上一篇博客上看到一种很巧妙通过'+'号实现隐式转换拿到时间戳的方法
            // 通过new.Date().getTime() 或者通过new.Date().valueOf() 方式也可以
            this.captchaImg.src = `/captcha?t=${+new Date()}`
        },
        check: function(){
            var isValid = true,
                errorMsg = "";

            // 隐藏错误信息框
            _.addClassName(this.errorParent, 'f-dn');

            // 验证数据填写 是否符合规范
            var checkList = [
                [this.phone, ['require', 'phone']],
                [this.nick, ['require', 'nickname']],
                [this.pwd, ['require', 'length']],
                [this.confirmpwd, ['require', 'length']],
                [this.captcha, ['require']]
            ];
            isValid = this.checkRules(checkList);
            if(!isValid){
                errorMsg = '您输入的信息不正确哦！';
            }
            // 验证两次密码
            if(isValid && this.pwd.value !== this.confirmpwd.value){
                isValid = false;
                errorMsg = '两次密码不一致呀~';
            }

            // 验证条款是否为空
            if(isValid && !this.checkbox.checked){
                isValid = false;
                errorMsg = '您还没有同意条款呢~';
            }

            // 显示错误
            if(!isValid){
                this.nError.innerText = errorMsg;
                _.delClassName(this.errorParent, 'f-dn');
            }
            // 返回结果
            return isValid;
        },

        checkRules: function(checkRules){
            // 验证结果
            var check_result = true;

            for(var i=0;i<checkRules.length;i++){
                // 被检查的元素节点
                var checkItem = checkRules[i][0],
                    rules = checkRules[i][1],
                    flag;

                // 去除错误标示
                _.delClassName(checkItem, 'error');

                for(var j=0;j<rules.length;j++){
                    // 检测规则名称
                    var key = rules[j];
                    switch(key){
                        case 'require':
                            flag = !_.isNotEmpty(checkItem.value);
                            break;
                        case 'phone':
                            flag = _.isPhone(checkItem.value);
                            break;
                        case 'nickname':
                            flag = _.isNickName(checkItem.value);
                            break;
                        case 'length':
                            flag = _.pwdLength(checkItem.value, 6, 16);
                            break;
                    }
                    if(!flag){break;}
                }
                // 显示错误
                flag || _.addClassName(checkItem, 'error');
                flag || (check_result = false);
            }
            // 若无错误
            return check_result;
        },

        submit: function(event){
            event.preventDefault();
            // 若验证成功
            if(this.check()){
                // 构造数据
                var data = {
                    username: this.phone.value.trim(),
                    nickname: this.nick.value.trim(),
                    password: hex_md5(this.pwd.value),
                    sex: this.getRadioValue('registerform', 'sex'),
                    captcha: this.captcha.value.trim()
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
                        console.log(data);
                        data = JSON.parse(data);
                        if(data.code === 200){
                            this.hide();
                            this.emit('showLoginModal');
                        }
                        else{
                            this.nError.innerText = data.msg;
                            this.showError();
                        }
                    }.bind(this),
                    fail:function(){}
                });
            }
        },

        getRadioValue: function(registerform, sex){
            return document.getElementById(registerform)[name=sex].value;
        },

        showError: function(){
            _.delClassName(this.errorParent, 'f-dn');
        },

        initRegisterEvent: function(){
            // 订阅显示注册弹窗事件
            this.on('showRegisterModal', this.show.bind(this));
            // 为关闭按钮，绑定关闭弹窗事件
            _.addEvent(this.closeBtn, 'click', this.hide.bind(this));
            // 为二维码图片，绑定刷新事件
            _.addEvent(this.captchaImg, 'click', this.resetCaptcha.bind(this));
            // 绑定提交表单事件
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