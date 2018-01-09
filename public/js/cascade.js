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
                // 创建 选择级组件 (Select中，完成挂载)
                var select = new Select({
                    parent: this.parent
                });
                // 订阅 select事件，用于触发级联关系
                // 绑定this，绑定参数i
                this.on('select', this.change.bind(this, i));
                // 缓存选择器节点
                this.selectList[i] = select;
            }
            // 1级下拉菜单,初始化数据
            this.selectList[0].render(this.data);
        },

        change: function(index, data){
            // 无关的选择器，不做任何操作，直接退出。
            if(this.selectList[index] !== data.target){return;}
            // 下级选择器，若是末级选择器，则退出
            var next = index + 1;
            if(next === this.selectList.length){return;}
            // 否则，更新渲染下级 选择菜单;
            this.selectList[next].render(this.getList(next, data.index));
        },

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