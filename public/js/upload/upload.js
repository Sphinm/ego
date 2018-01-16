(function () {

    // tab组件和search组件 登录注册点击交互颜色
    var login = document.querySelector('.m-login');
    var register = document.querySelector('.m-register');
    var loginInfo = document.querySelector('.m-login-info');

    login.addEventListener('click', function () {
        login.className = ' m-login';
        register.className = ' m-register';
    });

    register.addEventListener('click', function () {
        login.className += ' m-display-login';
        register.className += ' m-display-register';
    });

    // 登录modal
    var modalLogin = new LoginModal();
    var registerLogin = new RegisterModal();

    var cookie = _.getCookie('loginSuc');

    if (cookie === 'loginSuc') {
        login.style.display = 'none';
        register.style.display = 'none';
        _.delClassName(loginInfo, 'f-dn');
    }

    document.querySelector('.login-out').addEventListener('click', function () {
        _.delCookie('loginSuc');
        login.style.display = 'block';
        register.style.display = 'block';
        _.addClassName(loginInfo, 'f-dn');
    });

    document.querySelector('.m-login').addEventListener('click', function () {
        modalLogin.show();
        modalLogin.on('showRegisterModal', registerLogin.show.bind(registerLogin))
    });


    document.querySelector('.m-register').addEventListener('click', function () {
        registerLogin.show();
        registerLogin.on('showLoginModal', modalLogin.show.bind(modalLogin));
    });


    // 到上传作品页 必须得是登录成功状态

    var tab = new Tabs();
    document.querySelector('.work').addEventListener('click', function (event) {
        var cookie = _.getCookie('loginSuc');
        if(cookie !== 'loginSuc'){
            event.preventDefault();
            tab.on('showLoginModal', modalLogin.show.bind(modalLogin));
            return false
        } else {
            tab.off('showLoginModal',modalLogin.hide.bind(modalLogin));
        }
    });


    new Search();


    // 作品授权
    (new Authorization({
        parent: document.getElementsByClassName('g-side')[0]
    })).getValue();

    // 标签
    _.ajax({
        url: '/api/tags?recommend',
        method: 'GET',
        success: function(data){
            data = JSON.parse(data);
            if(data.code === 200){
                this.tag = new Tag({
                    parent: document.querySelector('.u-main'),
                    tags_recommend: data.result.split(',')
                });
            } else console.log(data);
        }.bind(this),
        fail:function(){console.log('data translate fail')}
    });



    function checkForm(data) {
        var flag = true;
        if(that.input.value.length === 0 || that.input.value.trim() === '') {
            flag = false;
        }
        else if(data.pictures.length === 0){
            alert('请选择图片上传');
            return false
        } else if(!data.coverId || !data.coverUrl){
            alert('请设置封面图片');
            return false
        }

        return flag;
    }

    var that = this;
    this.create = document.querySelector('.submit');
    this.input = document.querySelector('.m-work-desc .u-ipt');
    this.msg =  document.querySelector('.prompt_msg');

    this.desc = document.querySelector('.m-work-desc');

    this.upload_pictures = new UploadPicture({
        parent: document.querySelector('.u-main')
    });


    // 作品描述
    function getDescValue() {
        if(that.input.value.length === 0 || that.input.value.trim() === ''){
            _.delClassName(that.msg, 'f-dn');
        } else{
            _.addClassName(that.msg, 'f-dn');
        } return {
            name: this.desc.querySelector('input').value.trim(),
            description: this.desc.querySelector('textarea').value.trim()
        };
    }

    // 原创 or 临摹
    function getWorkValue() {
         return {
             category: document.querySelector('.works input').value.trim()
        };
    }

    // 权限设置
    function getPrivilegeValue() {
        return {
            privilege: document.querySelector('.m-radio input').value.trim()
        };
    }

    // 作品权限设置
    function getAuthorizationValue() {
        return {
            authorization: document.querySelector('.m-select .select_val').innerText.trim()
        };
    }

    (function addEvent() {

        _.addEvent(this.create, 'click', function(){

            var new_work = {};

            _.extend(new_work, getDescValue());

            _.extend(new_work, getWorkValue());

            _.extend(new_work, getPrivilegeValue());

            _.extend(new_work, getAuthorizationValue());

            _.extend(new_work, this.upload_pictures.getValue());

            new_work.tag = this.tag.getValue();

            submitForm(new_work);
        }.bind(this));
    })();


    function submitForm(data) {
        if(!checkForm(data)) return;
        // 提交表单

        _.ajax({
            url: '/api/works',
            method: 'POST',
            data: data,
            success: function(res){
                res = JSON.parse(res);
                console.log(res);
                if(res.code === 200){
                    location.href = '../works/myworks.html'
                }
            },
            fail: function(e){}
        });
    }


})(window);


