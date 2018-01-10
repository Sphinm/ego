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

cursors.forEach(function(cursor, index){
    cursor.addEventListener('click', function(){
        slider.nav(index);
    })
});

prev.addEventListener('click', function(){
    slider.prev();
});
next.addEventListener('click', function(){
    slider.next();
});

// 每次slider图片位置变化，cursor也变化，增加监听处理
slider.on('nav', function( ev ){
    var pageIndex = ev.pageIndex;
    cursors.forEach(function(cursor, index){
        if(index === pageIndex ){
            cursor.className = 'z-active';
            cursor.style.backgroundColor = '#5ed0ba';
        }else{
            cursor.className = '';
            cursor.style.backgroundColor = '#dedfdf';
        }
    })
});


// 从当前页开始轮播
slider.nav(3);

// 登录modal
var modalLogin = new LoginModal();
var registerLogin = new RegisterModal();

document.querySelector('.m-login').addEventListener('click', function(){
    (new LoginModal()).show();
    modalLogin.on('showRegisterModal', registerLogin.show.bind(registerLogin))
});


document.querySelector('.m-register').addEventListener('click', function(){
    (new RegisterModal()).show();
    registerLogin.on('showRegisterModal', modalLogin.show.bind(modalLogin));
});

new Tabs();
new Search();
new StarList();