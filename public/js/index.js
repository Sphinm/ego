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
        _.delCookie('loginSuc');
        _.addClassName(loginInfo, 'f-dn');
        login.style.display = 'block';
        register.style.display = 'block';
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


        // 轮播图初始化过程

    var cursors = document.querySelectorAll('.m-cursor .cursor');
    var prev = document.querySelectorAll('.g-banner #prev')[0];
    var next = document.querySelectorAll('.g-banner #next')[0];

    var slider = new Slider({
        //视口容器
        container: document.querySelector('.g-banner'),
        // 是否允许拖拽
        drag: true,
        // 是否自动轮播
        auto: true
    });

    cursors.forEach(function (cursor, index) {
        cursor.addEventListener('click', function () {
            slider.nav(index);
        })
    });

    prev.addEventListener('click', function () {
        slider.prev();
    });
    next.addEventListener('click', function () {
        slider.next();
    });

    // 每次slider图片位置变化，cursor也变化，增加监听处理
    slider.on('nav', function (ev) {
        var pageIndex = ev.pageIndex;
        cursors.forEach(function (cursor, index) {
            if (index === pageIndex) {
                cursor.className = 'z-active';
                cursor.style.backgroundColor = '#5ed0ba';
            } else {
                cursor.className = '';
                cursor.style.backgroundColor = '#dedfdf';
            }
        })
    });

    // 从当前页开始轮播
    slider.nav(3);



    /** ------------------------------------------------------------*/


        // 明日之星列表在未登录的时候弹出登录弹窗
        // 通过cookie判断是否是登录状态

    var star = new StarList();
    star.on('showLoginModal', modalLogin.show.bind(modalLogin));


    /** ------------------------------------------------------------*/

        // tab组件初始化，由于从作品调到另外的页面必须保证用户是已登录的状态
        // 所以我们在这里也要判断用户是否登录，没有登录弹出登录框
        // tab组件我只实现了一个，侧边栏那个没注意到

    var tab = new Tabs();
    document.querySelector('.work').addEventListener('click', function (event) {
        tab.setCurrent(1);
        var cookie = _.getCookie('loginSuc');
        if(cookie !== 'loginSuc'){
            event.preventDefault();
            tab.on('showLoginModal', modalLogin.show.bind(modalLogin));
            return false
        } else {
            tab.off('showLoginModal',modalLogin.hide.bind(modalLogin));
        }
    });

    // 搜索框初始化
    new Search();


})(window);
