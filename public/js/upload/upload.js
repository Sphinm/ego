(function () {

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


// 登录modal
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
            } else{
                console.log(data);
            }
        }.bind(this),
        fail:function(){console.log('data translate fail')}
    });


})(window);


