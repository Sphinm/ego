var util  =(function () {

    return {

        // 绑定事件
        addEvent: function(elem, type, listener) {
            document.addEventListener ? elem.addEventListener(type, listener):
                elem.attachEvent('on' + type, listener);
        },

        // 事件代理
        delegateEvent: function(element, tag, eventName, listener) {
            this.addEvent(element, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.tagName === tag.toUpperCase()) {
                    listener.call(target, event);
                }
            });
        },

        // 添加类名
        addClassName: function (node, className) {
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? ( current + " " + className ) : className;
            }
        },

        // 删除类名
        delClassName: function (node, className){
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
        },
        hasClassName: function (node, className){
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === 1){
                return 1;}
            else {
                return -1;
            }
        },

        //  自定义数据
        getDataset: function(ele,str) {
            if(!ele.dataset){
                var data_attributes ={};
                var arrs = ele.attributes,
                    length=arrs.length;
                for(var i=0;i<length;i++){
                    if(/^data-/.test(arrs[i].name)){
                        var key=arrs[i].name.match(/^data-(.+)/)[1];
                        var value=arrs[i].value;
                        key=key.replace(/-\w/g,function(match){
                            return match.substring(1).toUppserCase();
                        });
                        data_attributes[key]=value;
                    }
                }
                return data_attributes[str];
            }else{
                return ele.dataset[str];
            }
        },

        setDataset: function(ele,str,value) {
            if(!ele.dataset){
                var finalStr = "data-";
                var originPos = 0;
                var pos = 0;
                do {
                    pos = str.search(/[A-Z]/);
                    if (pos === -1) {
                        finalStr += str.substring(originPos);
                    } else {
                        finalStr += str.substring(originPos,pos);
                        originPos = pos;
                        str = str.substring(pos);
                    }
                } while (pos !== -1);

                ele.setAttribute(finalStr,value);
            }else{
                ele.dataset[str] = value;
            }
        },

        // html转node节点
        html2node:  function (str){
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },

         // 属性赋值
        extend: function (o1,o2){
            // console.log(o1)
        for (var i in o2) if (typeof o1[i] === 'undefined') {
                o1[i] = o2[i];
            }
            return o1;
         },

        //  AOP思想  事件发射器是一个公共服务 可以利用Spring中AOP思想来实现
        emitter: {
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
        },

        ajax: function (obj) {
            var xhr = (function () {
                if (window.XMLHttpRequest) {
                    return new XMLHttpRequest();
                } else {
                    return new ActiveXobject('Microft.XMLHttp');
                }
            })();

            obj.data = (function (data) {
                var arr = [];
                for (var i in data) {
                    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
                }
                return arr.join('&');
            })(obj.data);

            if (obj.method === 'GET') obj.url += obj.url.indexOf('?') === -1 ? '?'+obj.data : '&'+obj.data;
            if (obj.async === true) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        callback();
                    }
                };
            }
            xhr.open(obj.method, obj.url, obj.async);

        //
            if (obj.method === 'POST' || obj.method === 'PATCH' || obj.method === 'DELETE') {
                console.log(obj.method, obj.url, obj.data)
                obj.url += obj.url.indexOf('?') === -1 ? '?'+obj.data : '&'+obj.data;
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(obj.data);
            } else {
                // console.log(obj.method, obj.url, obj.data)
                xhr.send(null);
            }

            if (obj.async === false) {
                callback();
            }

            function callback() {
                if (xhr.status === 200) {
                    obj.success(xhr.responseText);			//回调传递参数
                } else {
                    alert('The error code：' + xhr.status + '，the error msg：' + xhr.statusText);
                }
            }
        },
        isPhone: function (value) {
            return  /^1(3|4|5|7|8)\d{9}$/.test(value);
        },

        isEmpty: function (value) {
            return /^S+\w+/.test(value);
        }
    }


})();