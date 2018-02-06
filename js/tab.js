/**
 * Tab组件
 * */

(function () {

    var template =
        '<div class="m-tab">\
                <ul class="f-cb">\
                   <li class="z-active"><a href="/index.html">首页</a></li>\
                   <li><a class="work" href="/html/works/myworks.html" target="_blank">作品</a></li>\
                   <li><a href="#">圈子</a></li>\
                   <li><a href="#">奇思妙想</a></li>\
                </ul>\
               <div class="tabs-track">\
                    <div class="tabs-thumb" style="width: 68px;left: 0;"></div>\
               </div>\
           </div>';

    function Tabs(index) {
        _.extend(this, index);
        this.index = this.index || 0;

        // 缓存节点
        this.container = this._layout.cloneNode(true);
        this.nTab = this.container.querySelector('ul');
        this.nbody = document.querySelector('.m-tabs');
        this.nTabs = this.nTab.children;
        this.nThumb = this.container.querySelector('.tabs-thumb');
        this.work = this.container.querySelector('.work');

        this.init();
    }

    _.extend(Tabs.prototype, _.emitter);

    _.extend(Tabs.prototype,{

        _layout: _.html2node(template),


        // 设置选中tab状态
        setCurrent: function (index) {
            _.delClassName(this.nTabs[this.index], 'z-active');
            this.index = index;
            _.addClassName(this.nTabs[index], 'z-active');
            this.highlight(index);


        },

        // 根据offset来达到设置样式的效果
        highlight: function (index) {
            var tab = this.nTabs[index] || this.nTabs[this.index];
            this.nThumb.style.width = tab.offsetWidth + 'px';
            this.nThumb.style.left = tab.offsetLeft + 'px';
        },

        // 初始化tab组件
        init : function () {
            var that = this;
            this.nbody.appendChild(this.container);
            // 循环触发mouseenter和click 事件
            for (var i = 0; i<this.nTabs.length; i++) {
                _.addEvent(this.nTabs[i], 'click', function (index) {
                    this.setCurrent(index)
                }.bind(this,[i]));
                _.addEvent(this.nTabs[i],'mouseenter', function (index) {
                    this.highlight(index)
                }.bind(this,[i]));
            }

            _.addEvent(this.nTab,'mouseleave',function () {
                this.highlight(this.index);
            }.bind(this));


            // 作品tab需要保证用户是登录状态
            // 如果没有登录cookie则弹出登录modal
            _.addEvent(this.work, 'click', function () {
                var cookie = _.getCookie('loginSuc');
                if (cookie !== 'loginSuc') {
                    that.emit('showLoginModal');
                    that.setCurrent(that.index);
                }
            });
            this.setCurrent(this.index);
        }
    });

    //          5.Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Tabs;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Tabs;
        });
    } else {
        // 直接暴露到全局
        window.Tabs = Tabs;
    }

})();
