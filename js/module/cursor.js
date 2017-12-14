!function(_){
    // 分页指示器接口实现
    // Cursor 主体html模板
    var template =
        "<ul class='m-cursor'>\
                <li class='prev'><</li>\
                <li class='cursor crt'>1</li>\
                <li class='next'>></li>\
            </ul>";

    // Cursor 实现
    function Cursor(options) {
        // options判断，给定初始值，输入不存在为空都等于{}
        options = options || {};
        // 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
        _.extend(this, options);

        // cursor节点
        this.cursor = this._layout.cloneNode(true);

        // 总共的指示器数量
        this.dataNum = this.cursorData.length;
        // 当前显示的指示器数量，默认为8
        this.cursorNum = this.showNum || 8;

        // 根据数据初始化指示器
        if (options.cursorData) {
            this._init();
        }

        // 将后续经常用到的节点放在实例上，避免查找开销
        // 指示器节点
        this.cursors = this.cursor.querySelectorAll('.m-cursor .cursor');
        if (this.prevData) {
            this.prev = this.cursor.querySelectorAll('.m-cursor .prev');
        }
        if (this.nextData) {
            this.next = this.cursor.querySelectorAll('.m-cursor .next');
        }

        // 当前选中项
        this.crtIndex = 0;
        // 当前点击的项为界面显示的cursors中第几项
        this.currentIndex = 0;

        // 初始化事件
        this._initEvent();
    }

    // 事件注册
    _.extend( Cursor.prototype, _.emitter);

    // 构建Cursor方法
    _.extend(Cursor.prototype, {

        // 根据模板转换为节点
        _layout: _.html2node(template),

        // 和容器绑定显示接口
        show: function(container) {
            // 容器节点，如果没有传入container，默认为body节点
            this.container = container || this.container || document.body;
            // 初始化，给外部容器增加指示器组件
            this.container.appendChild(this.cursor);
        },

        // 前一个
        doPrev: function() {
            // 第一个点击无效
            if (this.crtIndex === 0) {
                return;
            }
            var index = this.crtIndex-1;
            this.select(index);
        },

        doNext: function() {
            // 最后一个点击无效
            if (this.crtIndex === this.dataNum-1) {
                return;
            }
            var index = this.crtIndex+1;
            this.select(index);
        },

        select: function(selIndex) {
            // 触发select事件
            this.emit('select',this.cursorData[selIndex],selIndex);
            this.update(selIndex);
        },

        update: function(selIndex) {
            this.crtIndex = selIndex;
            var dataNum = this.dataNum,
                cursorNum = this.cursorNum,
                middleIndex = parseInt((cursorNum+1)/2),
                needUpdate = false;

            // 当前选中项为第一项和最后一项时，prev/next不可用
            this.prev && _.delClassName(this.prev,'disabled');
            this.prev && _.delClassName(this.next,'disabled');
            if (this.prev && selIndex === 0) {
                _.addClassName(this.prev,'disabled');
            } else if (this.next && selIndex === this.dataNum-1) {
                _.addClassName(this.next,'disabled');
            }

            for (var i = 0,cursor; cursor = this.cursors[i]; i++) {
                _.delClassName(cursor,'crt');
                // 判断总的数量是否超过显示数量，更新cursors
                // 如果选择项大于中间项,更新第二项为省略号
                // 如果选择项小于所有数据项-2，更新倒数第二项为省略号
                if(dataNum > cursorNum &&
                    ((i===1 && selIndex >= middleIndex) ||
                        (i===(cursorNum-2) && selIndex<(dataNum-middleIndex-1)))) {
                    _.setDataset(cursor,'index','more');
                    cursor.innerHTML = '...';
                    _.addClassName(cursor,'disabled');
                    _.delClassName(cursor,'crt');
                    needUpdate = true;
                } else if( i!==0 && i!==(cursorNum-1)) {
                    var index = parseInt(_.getDataset(cursor,'index'));
                    if (!index && index !== 0) {
                        needUpdate = true;
                    }
                    // 仅选择中间需要改变的项才需要重新设置cursor的值
                    if (selIndex < middleIndex) {
                        index = i;
                    } else if (selIndex >= dataNum-middleIndex-1) {
                        index = (dataNum-cursorNum)+i;
                    } else {
                        index = selIndex-(middleIndex-1)+i;
                    }

                    if (needUpdate) {
                        _.setDataset(cursor,'index',index);
                        cursor.innerHTML = this.cursorData[index];
                        _.delClassName(cursor,'disabled');
                    }
                    if (index === selIndex) {
                        _.addClassName(cursor,'crt');
                    }
                } else if ((selIndex === 0 && i === 0) || ((i === cursorNum-1) && selIndex === dataNum-1)) {
                    _.addClassName(cursor,'crt');
                }
            }
        },

        _select: function() {
            var target = _.getTarget(event);
            var index = _.getDataset(target,'index');
            if (index === "more") {
                return;
            } else if(index === "prev") {
                this.doPrev();
            } else if (index === "next") {
                this.doNext();
            } else {
                index = parseInt(index);
                this.select(index);
            }
        },

        _init: function() {
            var template = "";
            // 根据数据构建指示器
            if (this.prevData) {
                template += "<li class='prev disabled' data-index='prev'>" + this.prevData + "</li>";
            }
            if (this.cursorData) {
                var length = this.cursorData.length;
                var showNum = this.cursorNum;
                for (var i = 0; i < length-1 && i < (showNum-1); i++) {
                    if (i === 0) {
                        template += "<li class='cursor crt' data-index='"+ i +"'>" + this.cursorData[i] + "</li>";
                    } else if (length > showNum && i === (showNum-2)) {
                        template += "<li class='cursor disabled' data-index='more'>...</li>";
                    } else {
                        template += "<li class='cursor' data-index='"+ i +"'>" + this.cursorData[i] + "</li>";
                    }
                }
                template += "<li class='cursor' data-index='"+ (this.dataNum-1) +"'>" + this.cursorData[this.dataNum-1] + "</li>";
            }
            if (this.nextData) {
                template += "<li class='next' data-index='next'>" + this.nextData + "</li>";
            }
            this.cursor.innerHTML = template;
        },

        // 事件初始化
        _initEvent: function() {
            // 使用事件代理绑定click事件
            _.delegateEvent(this.cursor, 'li', 'click', this._select.bind(this));
        }
    });

    //          5.Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Cursor;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Cursor;
        });
    } else {
        // 直接暴露到全局
        window.Cursor = Cursor;
    }

}(util);