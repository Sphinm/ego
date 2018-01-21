/**
 * select组件
 *
 * */

(function(){

    var html = `<div class="m-select">
                    <div class="select_list">
                        <span class="select_val"></span>
                        <span class="u-icon u-icon-down"></span>
                    </div>
                    <ul class="select_opt f-no"></ul>
	            </div>`;


    function Select(options){
        // 继承配置
        _.extend(this, options);

        // 缓存节点
        this.container = this._layout.cloneNode(true);
        this.nOption = this.container.querySelector('.select_opt');
        this.nValue = this.container.querySelector('.select_val');

        // 初始化
        this.initSelect();
    }

    _.extend(Select.prototype, _.emitter);


    _.extend(Select.prototype, {
        _layout: _.html2node(html),

        // 若关闭，则展开;若展开，则关闭
        open: function(){
            _.delClassName(this.nOption, 'f-no');
        },

        close: function(){
            _.addClassName(this.nOption, 'f-no');
        },

        toggle: function(){
            _.hasClassName(this.nOption, 'f-no') ? this.open() : this.close();
        },

        // 更新下拉列表
        render: function(data, defaultIndex){
            var optionsHTML = '';
            data = data || [];
            for(var i = 0;i < data.length;i++){
                // 自定义数据格式
                optionsHTML += `<li data-index=${i}>${data[i].name}</li>`
            }
            // 缓存节点
            this.nOption.innerHTML = optionsHTML;
            this.nOptions = this.nOption.children;
            this.options = data;
            this.selectedIndex = undefined;
            this.setSelect(defaultIndex || 0);
        },

        setSelect: function(index){
            // 取消选中
            if(this.selectedIndex !== undefined){
                _.delClassName(this.nOptions[this.selectedIndex], 'z-select');
            }
            // 选中
            this.selectedIndex = index;
            if(this.nOptions.length > 0){
                _.addClassName(this.nOptions[this.selectedIndex], 'z-select');
                this.nValue.innerText = this.options[this.selectedIndex].name;
            } else{
                this.nValue.innerText = '';
            }

            // 触发select事件
            this.emit('select', {
                value: this.getValue(),     // 数据值（如：地址编码）
                target: this,               // 触发事件的选择器本身，用于辅助判定级联选择器中，哪些选择器响应
                index: this.selectedIndex   // 选中选项的序号，用于找出下级选择器 下拉菜单的数据
            });
        },

        getValue: function(){
            return typeof this.options[this.selectedIndex] !== 'undefined' ? this.options[this.selectedIndex].value : '';
        },


        // 检测选择器点击是否是选中的序号
        clickHandler: function(event){
            event.target.dataset.index !== undefined ? this.setSelect(event.target.dataset.index) : null;
            this.toggle();
        },


        // 初始化select组件并渲染到父容器
        initSelect: function(){
            this.parent.appendChild(this.container);
            _.addEvent(this.container, 'click', this.clickHandler.bind(this));
        }

    });

    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Select;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Select;
        });
    } else {
        // 直接暴露到全局
        window.Select = Select;
    }

})();