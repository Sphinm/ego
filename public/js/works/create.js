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
        _.delCookie('loginSuc')
    });

    document.querySelector('.m-login').addEventListener('click', function () {
        modalLogin.show();
        modalLogin.on('showRegisterModal', registerLogin.show.bind(registerLogin))
    });


    document.querySelector('.m-register').addEventListener('click', function () {
        registerLogin.show();
        registerLogin.on('showLoginModal', modalLogin.show.bind(modalLogin));
    });


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

    // 作品列表页的用户信息
    new UserInfo({
        parent: document.querySelector('.g-profile')
    });
    new WorkList({
        parent: document.querySelector('.g-wrap')
    })



})(window)