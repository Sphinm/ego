/**
 * Authorization
 * 作品授权组件
 * */

(function () {

    var html = `<div class="m-authorization"><label>作品授权</label></div>`;


    function Authorization(opt) {
        _.extend(this, opt);

        // 缓存节点
        this.authorization = _.html2node(html);

        this.initAuthor();
    }

    _.extend(Authorization.prototype, {

        // 返回select的值
        getValue: function () {
            return {
                authorization: this.select.getValue()
            }
        },

        // 初始化组件并渲染获取到的值
        initAuthor: function () {
            this.select = new Select({parent: this.authorization});
            this.select.render([
                    {name:'不限制作品用途', value:0},
                    {name:'限制作品用途', value:1}
                ]);

            this.parent.appendChild(this.authorization);
        }
    });


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Authorization;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Authorization;
        });
    } else {
        // 直接暴露到全局
        window.Authorization = Authorization;
    }
})();