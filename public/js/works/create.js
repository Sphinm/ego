(function () {

    // tab组件和search组件 登录注册点击交互颜色
    // 后期这里需要整合到组件中
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


    /** ------------------------------------------------------------*/

    // 登录和注册modal
    // 在登录弹窗中点击‘立即注册’打开注册弹窗并关闭登录弹窗
    // 完成注册后关闭注册弹窗打开登录弹窗
    // 同样需要整合到初始化组件中

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

    /** ------------------------------------------------------------*/


    // tab组件初始化，由于从作品调到另外的页面必须保证用户是已登录的状态
    // 所以我们在这里也要判断用户是否登录，没有登录弹出登录框

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

    // 初始化搜索框
    new Search();

    // 作品列表页的用户信息
    new UserInfo({
        parent: document.querySelector('.g-profile')
    });

    // 初始化作品列表页
    new WorkList({
        parent: document.querySelector('.g-wrap')
    })



})(window)