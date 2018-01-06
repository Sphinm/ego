(function (root) {
    var _ = Object.create(null);
    root._ = _;



    _.addEvent = function(ele, type, fn) {
        document.addEventListener ? ele.addEventListener(type, fn): ele.attachEvent('on' + type, fn);
    }

        // 事件代理
    _.delegateEvent = function(ele, tag, eventName, fn) {
            _.addEvent(ele, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.tagName === tag.toUpperCase()) {
                    fn.call(target, event);
                }
            });
        };

        // 添加类名
    _.addClassName = function (node, className) {
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? ( current + " " + className ) : className;
            }
        };

        // 删除类名
    _.delClassName = function (node, className){
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
        };

    _.hasClassName = function (node, className){
            var current = node.className || "", flag;
            if ((" " + current + " ").indexOf(" " + className + " ") === -1){
                flag = false;
            } else {
                flag = true;
            }
            return flag;
        };

        // html转node节点
    _.html2node =  function (str){
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        };

         // 属性赋值
    _.extend = function (o1,o2){
            // console.log(o1)
        for (var i in o2) if (typeof o1[i] === 'undefined') {
                o1[i] = o2[i];
            }
            return o1;
         };

    _.emitter = {
            // 注册事件
            on: function(event, fn) {
                var handles = this._handles || (this._handles = {}),
                    calls = handles[event] || (handles[event] = []);

                // 找到对应名字的栈
                calls.push(fn);

                return this;
            },

            // 解绑事件
            off: function(event, fn) {
                if(!event || !this._handles) this._handles = {};
                if(!this._handles) return;

                var handles = this._handles , calls;

                if (calls = handles[event]) {
                    if (!fn) {
                        handles[event] = [];
                        return this;
                    }
                    // 找到栈内对应listener 并移除
                    for (var i = 0, len = calls.length; i < len; i++) {
                        if (fn === calls[i]) {
                            calls.splice(i, 1);
                            return this;
                        }
                    }
                }
                return this;
            },

            // 触发事件
            emit: function(event){
                var args = [].slice.call(arguments, 1),
                    handles = this._handles, calls;

                if (!handles || !(calls = handles[event])) return this;
                // 触发所有对应名字的listeners
                for (var i = 0, len = calls.length; i < len; i++) {
                    calls[i].apply(this, args)
                }
                return this;
            }
        };

    _.ajax = function (obj) {
        var xhr = (function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else {
                return new ActiveXobject('Microft.XMLHttp');
            }
        })(), data;


        if (obj.method.toUpperCase() === 'GET') {
            obj.url += obj.data ? ('?'+ _.serialize(obj.data)) : '';
        }


        if (obj.method.toUpperCase()  === 'POST' || obj.method.toUpperCase()  === 'PATCH') {
            data = obj.data ? JSON.stringify(obj.data) : null;
            console.log(obj.data, obj.url, obj.method)
        }

        xhr.open(obj.method, obj.url, true);

        // 请求头 设置需要放在open方法后面执行，否则会报错
        xhr.setRequestHeader('Content-Type','application/json');



        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                    obj.success(xhr.responseText);
                }else{
                    obj.fail(xhr);
                    console.log('The error code：' + xhr.status + ' and msg is ：' + xhr.statusText);
                }
            }
        };


        xhr.send(data);
    };

    _.serialize = function (data) {
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
    };

    _.isPhone = function (value) {
            return  /^1(3|4|5|7|8)\d{9}$/.test(value);
        };

    _.isNotEmpty = function (value) {
            return !value.trim();
        };

    _.pwdLength = function (value) {
        return /[a-zA-Z0-9]/.test(value) && value.length >= 6;
    }


})(window);