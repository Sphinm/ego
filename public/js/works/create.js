(function () {

    // tab组件和search组件 登录注册点击交互颜色
    var login = document.querySelector('.m-login');
    var register = document.querySelector('.m-register');


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


    document.querySelector('.m-login').addEventListener('click', function () {
        modalLogin.show();
        modalLogin.on('showRegisterModal', registerLogin.show.bind(registerLogin))
    });


    document.querySelector('.m-register').addEventListener('click', function () {
        registerLogin.show();
        registerLogin.on('showLoginModal', modalLogin.show.bind(modalLogin));
    });


    new Tabs();
    new Search();

    // 作品列表页的用户信息
    new UserInfo({
        parent: document.querySelector('.g-profile')
    })

    // (new UserInfo).on('login', function (data) {
    //     console.log(data)
    // })

})(window)