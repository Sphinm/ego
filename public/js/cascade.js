// 级联选择器组件
(function(){

    function Cascade(options){
        // 继承配置
        _.extend(this, options);
        // 缓存 各级选择器节点 列表
        this.selectList = [];
        // 初始化
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
            this.selectList[0].render(this.data);
        },

        change: function(index, data){
            var next = index + 1;
            if(this.selectList[index] !== data.target) return;
            if(next === this.selectList.length) return;
            // 更新渲染下拉菜单;
            this.selectList[next].render(this.getList(next, data.index));
        },

        getList: function(n, index){
            return this.selectList[n-1].options[index].list;
        },

        getValue: function(){
            var value = [];
            for(var i=0;i<3;i++){
                // 获取select选中的值
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