!function () {
    // 创建xhr对象
    function createXmlRequest(method, url, callback) {
        var xhr = new XMLHttpRequest();
        if (xhr !== null) {
            xhr.onload = function() {
                callback(xhr.responseText);
            };
            xhr.onerror = function() {
                alert('there was an error in the request!');
            };
            xhr.open(method, url);
        } else {
            xhr = null
        }
        return xhr
    }

    /**
     * Cookie用于对页面cookie进行管理和操作，提供加密功能
     */
    function Ajax(callback) {
        callback = callback || function () {};
        this.cookie = this._updateCookie();
        callback.call(this);
    }

    Ajax.prototype = {
        _updateCookie: function () {
            var cookie = this.cookie || {};
            var all = document.cookie;
            if (all === '')
                return cookie;
            var list = all.split('; ');
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var p = item.indexOf('=');
                var name = item.substring(0, p);
                name = decodeURIComponent(name);
                var value = item.substring(p + 1);
                value = decodeURIComponent(value);
                cookie[name] = value;
            }
            this.cookie = cookie;
            return cookie;
        },

        _removeCookie: function(name) {
            document.cookie = name + '=' + '; max-age=0';
            this._updateCookie();
        },

        _setCookie: function(name, value, expires, path, domain, secure) {
            var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            if (expires)    //失效时间
                cookie += '; expires=' + expires.toGMTString();
            if (path)   //作用路径
                cookie += '; path=' + path;
            if (domain) //作用域
                cookie += '; domain=' + domain;
            if (secure) //https协议时生效
                cookie += '; secure=' + secure;
            document.cookie = cookie;
            this._updateCookie();
        },

        ajax: {
            // 请求参数序列化，把对象转换为例如'name1=value1&name2=value2'的格式
            // 暂时只写GET POST方法
            serialize: function (data) {
                if (!data) return '';
                var pairs = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) continue;
                    if (typeof data[name] === 'function') continue;
                    var value  = data[name].toString();
                    name  = encodeURIComponent(name);
                    value = encodeURIComponent(value);
                    pairs.push(name + '=' + value);
                }
                return pairs.join('&');
            },

            get: function (url, options, callback) {
                var URL = url + '?' + this.serialize(options);  // url + 查询参数序列号
                var xhr = createXmlRequest('GET', URL, callback);
                if (!xhr) throw new Error('Ajax is not supported!');
                // 处理返回数据
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {        // 4 表示浏览器请求结束
                        // status为200-300表示success，304为读取缓存
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                            callback(xhr.responseText);
                        } else {
                            console.log('The request was unsuccessful, and the error code was: '+ xhr.status);
                        }
                    }
                };
                xhr.send(null);     // get请求时null也不能省略
        },

            post: function (url, options, callback) {
                var URL = url + '?' + this.serialize(options);  // url + 查询参数序列号
                var xhr = createXmlRequest('POST', URL, callback);
                if (!xhr) throw new Error('Ajax is not supported!');
                // 处理返回数据
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {        // 4 表示浏览器请求结束
                        // status为200-300表示success，304为读取缓存
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                            callback(xhr.responseText);
                        } else {
                            console.log('The request was unsuccessful, and the error code was: '+ xhr.status);
                        }
                    }
                };

                //放在open后执行，表示文本内容的编码方式是URL编码，即除了标准字符外，每字节以双字节16进制前加个“%”表示
                xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                xhr.send(this.serialize(options));
            }
        },

        getCookie: function (name, callback) {
            callback.call(this, this.cookie[name]);
            return this.cookie[name];
        },

        setCookie: function (name, value) {
            this._setCookie(name, value);
        },

        removeCookie: function (name, callback) {
            this._removeCookie(name);
            callback.call(this);
        },

        // 用户登陆
        login: function(username,password,remember,callback) {
            var url = 'http://59.111.99.234/';
            var options =  {username: username, password: hex_md5(password), remember: remember};
            this.ajax.post(url, options, callback);
        },

        // 用户注册
        register: function (username, nickname, sex, province, city, district, birthday, password, captcha, callback) {
            var url = '';
            var options = {username: username, nickname: nickname, sex: sex, province: province, city: city, district: district,
                birthday: birthday, password: hex_md5(password), captcha: captcha};
            this.ajax.post(url, options, callback);
        },

        logout: function (callback) {
            var url = '';
            this.ajax.post(url, callback);
        }

    };

    //          Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Ajax;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Ajax;
        });
    } else {
        // 直接暴露到全局
        window.Ajax = Ajax;
    }
}();