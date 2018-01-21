/**
 * UserInfo
 * 用户信息组件
 * 其实有一个接口可以拿到用户信息的，回头自己实现一下
 * get /api/users?getloginuser
 * */

(function () {

    var html = Handlebars.compile(`<div class="u-avatar"></div>
	<div class="u-info">
		<em class="name" title="{{nickname}}">{{nickname}}</em>
		<span class="sex">
			<em class="u-icon {{sex}}"></em>
		</span>
	</div>
	<div class="u-info">
		<em class="age">{{age}}岁</em>
		<em class="constellation">{{zodiac}}座</em>
		<span class="address-info">
			<em class="u-icon u-icon-address"></em>
			<em class="address">{{city}}</em>
		</span>
	</div>`);

    function UserInfo(opt) {
        _.extend(this, opt);

        this.render();
    }

    // 事件发射器
    _.extend(UserInfo.prototype, _.emitter);


    var iconConfig = [
        'u-icon-male',
        'u-icon-female'
    ];

    _.extend(UserInfo.prototype, {
        render: function () {
            _.ajax({
               url: '/api/users?getloginuser',
               method: 'GET',
               success: function (data) {
                   data = JSON.parse(data);
                   var user_info = {
                       nickname: data.result.nickname,  // 昵称
                       sex: iconConfig[data.result.sex],  // 性别icon
                       age: _.calculateAge(data.result.birthday),  // 年龄
                       city: _.searchCity(ADDRESS_CODES, {province: data.result.province,city: data.result.city}),  // 城市
                       zodiac: _.calculateZodiac(data.result.birthday)  // 星座
                   };
                   console.log(data, user_info.city)
                   this.parent.innerHTML = html(user_info);
               }.bind(this),
                fail: function(){}
            });
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