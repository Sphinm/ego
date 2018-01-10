(function(){

    var html = `<div class="m-select">
		<div class="select_list">
			<span class="select_val"></span>
			<span class="u-icon u-icon-down"></span>
		</div>
		<ul class="select_opt f-dn"></ul>
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

        render: function(data, defaultIndex){
            // 更新下拉列表
            var optionsHTML = '';
            data = data || []; // 若data为null，则默认空数组
            for(var i = 0;i < data.length;i++){
                // 格式化数据{name:,value:}
                optionsHTML += `<li data-index=${i}>${data[i].name}</li>`
            }
            this.nOption.innerHTML = optionsHTML;
            // 缓存下拉选项节点
            this.nOptions = this.nOption.children;
            // 缓存下拉选项数据
            this.options = data;
            // 置空选中项
            this.selectedIndex = undefined;
            // 默认选中第一项
            this.setSelect(defaultIndex || 0);
        },

        setSelect: function(index){
            // 取消上次选中效果
            if(this.selectedIndex !== undefined){
                _.delClassName(this.nOptions[this.selectedIndex], 'z-select');
            }
            // 为本次选中设置效果
            this.selectedIndex = index;
            // 防止被选列表为空数组报错
            if(this.nOptions.length > 0){
                _.addClassName(this.nOptions[this.selectedIndex], 'z-select');
                // 更新对外显示的选中内容
                this.nValue.innerText = this.options[this.selectedIndex].name;
            } else{
                this.nValue.innerText = '';
            }
            // 触发select事件
            this.emit('select', {
                value: this.getValue(),  // 数据值（如：地址编码）
                target: this, // 触发事件的选择器 本身，用于辅助判定级联选择器中，哪些选择器响应
                index: this.selectedIndex // 选中选项的序号，用于找出下级选择器 下拉菜单的数据
            });
        },

        getValue: function(){
            if (this.selectedIndex === 0)
            return this.options[this.selectedIndex] !== 0 ? this.options[this.selectedIndex].value : '';
        },

        toggle: function(){
            // 若关闭，则展开;若展开，则关闭
            _.hasClassName(this.nOption, 'f-dn') ? this.open() : this.close();
        },

        open: function(){
            _.delClassName(this.nOption, 'f-dn');
        },

        close: function(){
            _.addClassName(this.nOption, 'f-dn');
        },

        clickHandler: function(event){
            // 若选中的是li,则触发setSelect
            console.log(event.target.dataset)
            event.target.dataset.index !== undefined ? this.setSelect(event.target.dataset.index) : null;
            this.toggle();
        },

        init: function(){
            // 点击选择器，触发交互事件
            _.addEvent(this.container, 'click', this.clickHandler.bind(this));
            // 点击选择器外部，触发关闭选择器事件
            document.addEventListener('click', function(event){
                // 若是从选择器组件 冒泡出来的，则直接退出
                try{
                    for(var i=0;i< event.path.length; i++){
                        if(event.path[i] === this.body) return;
                    }
                } catch(e){console.log(e); }
                this.close(); // 否则，关闭选择器下拉列表
            }.bind(this));
        },

        initSelect: function(){
            this.init();
            this.parent.appendChild(this.container);

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