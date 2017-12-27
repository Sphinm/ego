!function (_) {
    /**
     * Model层
     */

    function Model(store) {
        this.store = store;
    }

    _.extend(Model.prototype,{
        getLogin: function (callback) {
            this.store.getCookie('loginSuc', callback);
        },
        loginSuccess: function(){
            this.store.setCookie('loginSuc',1);
        },
        login: function(userName,password,remember,callback) {
            this.store.login(userName,password,remember,callback);
        },
        register: function (username, nickname, sex, province, city, district, birthday, password, captcha, callback) {
            this.store.register(username, nickname, sex, province, city, district, birthday, password, captcha, callback);
        }
    });

    //          Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Model;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Model;
        });
    } else {
        // 直接暴露到全局
        window.Model = Model;
    }
}(util);