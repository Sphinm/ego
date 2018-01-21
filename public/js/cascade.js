/**
 * 级联选择器组件
 * 这个组件仅作为一个中介组件触发级联操作
 */

(function(){

    function Cascade(options){
        _.extend(this, options);

        this.selectList = [];

        this.initCascade();
    }

    _.extend(Cascade.prototype, _.emitter);

    _.extend(Cascade.prototype, {

        initCascade: function(){
            for(var i=0;i<3;i++){
                var select = new Select({
                    parent: this.parent
                });
                // 订阅 select事件，用于触发级联关系
                select.on('select', this.change.bind(this, i));
                this.selectList[i] = select;
            }
            // 渲染初始化数据
            this.selectList[0].render(this.data);
        },

        // 渲染下一级数据
        change: function(index, data){
            var next = index + 1;
            // 非级联选择器
            if(this.selectList[index] !== data.target) return;

            // 到最后一级，不渲染数据
            if(next === this.selectList.length) return;
            // 更新渲染下拉菜单;
            this.selectList[next].render(this.getList(next, data.index));
        },

        // 获取第n级列表数据
        getList: function(n, index){
            return this.selectList[n-1].options[index].list;
        },

        getValue: function(){
            var value = [];
            for(var i=0;i<3;i++){
                value.push(this.selectList[i].getValue());
            }
            return value;
        }
    });

    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Cascade;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Cascade;
        });
    } else {
        // 直接暴露到全局
        window.Cascade = Cascade;
    }

})();