(function () {

    function UserInfo(opt) {
        _.extend(this, opt);


        var user = {
            nickname: 'Amber',  // 昵称
            sex: '女',  // 性别icon
            age: '22',  // 年龄
            city: '北京',  // 城市
            xingzuo: '天秤'  // 星座
        };

        var html = `<div class="">
                <div class="u-avatar"></div>
                <div class="u-info">
                <em class="name" title="${user.nickname}">${user.nickname}</em>
                <span class="sex">
                    <em class="u-icon ${user.sex}"></em>
                </span>
            </div>
            <div class="u-info">
                <em class="age">${user.age}岁</em>
                <em class="constellation">${user.xingzuo}座</em>
                <span class="address-info">
                    <em class="u-icon u-icon-address"></em>
                    <em class="address">${user.city}</em>
                </span>
            </div>`;

        this.container = _.html2node(html);
        this.render();
    }

    _.extend(UserInfo.prototype, _.emitter);


    _.extend(UserInfo.prototype, {

        render: function () {

            // 这里需要判断前一个页面的登录信息后取data中的数据，可是我这里获取不到，暂时使用假数据
            // this.on('login', function(data) {
                // 定义数据结构
                //
                // var iconConfig = [
                //     'u-icon-male',
                //     'u-icon-female'
                // ];

                this.parent.appendChild(this.container);

            // }.bind(this));
        }
    });


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global

    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = UserInfo;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return UserInfo
        });
    } else {
        // 直接暴露到全局
        window.UserInfo = UserInfo;
    }

})();