(function () {

    // 到上传作品页 必须得是登录成功状态


    // tab组件和search组件 登录注册点击交互颜色
    var login = document.querySelector('.m-login');
    var register =document.querySelector('.m-register');


    login.addEventListener('click',function () {
        login.className = ' m-login';
        register.className = ' m-register';
    });

    register.addEventListener('click',function () {
        login.className += ' m-display-login';
        register.className += ' m-display-register';
    });


    // 登录 & 注册
    var modalLogin = new LoginModal();
    var registerLogin = new RegisterModal();

    document.querySelector('.m-login').addEventListener('click', function(){
        modalLogin.show();
        modalLogin.on('showRegisterModal', registerLogin.show.bind(registerLogin))
    });


    document.querySelector('.m-register').addEventListener('click', function(){
        registerLogin.show();
        registerLogin.on('showRegisterModal', modalLogin.show.bind(modalLogin));
    });


    new Tabs();
    new Search();
    new UploadPicture();


    // 作品授权
    (new Authorization({parent: document.getElementsByClassName('g-side')[0]})).getValue();

    // 标签
    _.ajax({
        url: '/api/tags?recommend',
        method: 'GET',
        success: function(data){
            data = JSON.parse(data);
            if(data.code === 200){
                this.tag = new Tag({
                    parent: document.getElementsByClassName('u-main')[0],
                    tags_recommend: data.result.split(',')
                });
            } else console.log(data);
        }.bind(this),
        fail:function(){console.log('data translate fail')}
    });

    // 判断作品名称不为空
    // 作品创建完应该提交到别的页面。这里只是简单的加个提示消息
    var that = this;
    this.create = document.querySelector('.submit');
    this.input = document.querySelector('.m-work-desc .u-ipt');
    this.msg =  document.querySelector('.prompt_msg');

    this.create.addEventListener('click', function () {
        if (that.input.value.length === 0 || that.input.value.trim() === '') {
           _.delClassName(that.msg, 'f-dn');
        } else {
            _.addClassName(that.msg, 'f-dn');
            console.log('作品创建成功')
        }
    })


})(window);


