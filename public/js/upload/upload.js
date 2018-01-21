(function () {
    /**
     * upload 初始化页面
     * 由于没有初始化顶栏，所以有的部分是粘贴过来的
     * @type {Element}
     */

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



    /** ------------------------------------------------------------*/

    // tab组件初始化，由于从作品调到另外的页面必须保证用户是已登录的状态
    // 所以我们在这里也要判断用户是否登录，没有登录弹出登录框
    // tab组件我只实现了一个，侧边栏那个没注意到

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

    // 搜索框初始化
    new Search();


    // 作品授权
    (new Authorization({
        parent: document.getElementsByClassName('g-side')[0]
    })).getValue();




    /** ------------------------------------------------------------*/

    // 标签初始化
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

    /** ------------------------------------------------------------*/


    // 上传图片模块检查
    // 点击‘创建’按钮需要把相关字段的值取到
    // 作品分类 0 1，分别对应原创和临摹
    // 上传图片 有id、name、url等字段
    // 标签有 tag 字段
    // 权限设置和授权类型都是枚举类型
    // 只有拿到这些字段我们才能上传成功

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

    // 缓存节点
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

    // 作品授权设置
    function getAuthorizationValue() {
        return {
            authorization: document.querySelector('.m-select .select_val').innerText.trim()
        };
    }

    // 设置自执行函数
    // 点击创建btn 拿到相应的字段值，再检测数据是否缺失，合格后再提交
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
        _.ajax({
            url: '/api/works',
            method: 'POST',
            data: data,
            success: function(res){
                res = JSON.parse(res);
                console.log(res);
                if(res.code === 200){
                    // 拿到数据返回作品列表页
                    location.href = '../works/myworks.html'
                }
            },
            fail: function(){}
        });
    }


})(window);


