/**
 * Tag
 * 自定义标签组件
 * */

(function () {

    var html = `<div class="m-tag">
		<div class="f-cb">
			<label class="tag_title">标签</label>
			<ul class="tag_list"></ul>
		</div>
		<div class="f-cb">
			<label class="tag_recommend">推荐标签</label>
			<ul class="tag_rec_list"></ul>
		</div>
	</div>`;

    function Tag(opt) {

        _.extend(this, opt);

        // 缓存节点
        this.container = _.html2node(html);
        this.tagUrl = this.container.querySelector('.tag_list');
        this.tagRecUrl = this.container.querySelector('.tag_rec_list');
        this.tagList = [];
        this.tagListRec = [];

        this.initTag();

    }

    _.extend(Tag.prototype, {

        getValue:  function(){
            return this.tagList.join(',')
        },

        // 判断标签是否添加过，没有就添加到list末尾,有的话不重复添加
        // tag支持数组和字符串
        addTag: function(tags, target, before){
            let that = this;

            let add = function(tag){
                if(that.tagList.indexOf(tag) === -1){
                    typeof before === 'undefined' ? this.target.appendChild(_.html2node(`<li>${tag}</li>`)) : this.target.insertBefore(_.html2node(`<li>${tag}</li>`), this.before);
                    that.tagList.push(tag);
                }
            };

            // tags支持数组，也支持单个字符串
            if(tags && !Array.isArray(tags)) tags = [tags];


            // 遍历tags, 添加时，用到的上下文
            // 指定forEach的上下文
            let context = {};
            target && (context.target = target);
            before && (context.before = before);

            // 若是添加到选中tag节点
            target === this.tagUrl ? context.list = this.tagList: context.list = this.tagListRec;

            // 遍历tags, 添加tag
            (tags || []).forEach(add, context);
        },

        removeTag: function(event){
            if(this.tagList.indexOf(event.target.innerText) !== -1){
                // 从选中tagList中移除
                this.tagList.splice(this.tagList.indexOf(event.target.innerText),1);
                // 从节点中移除
                event.target.parentNode.removeChild(event.target);
            }
        },

        // 绑定各种事件
        addEvent: function(){
            _.addEvent(this.tagRecUrl, 'click', function(event){
                if(event.target.nodeName.toUpperCase() !== 'LI') return;
                this.addTag(event.target.innerText, this.tagUrl, this.add_tag);
            }.bind(this));

            // 点击选中标签 事件
            _.addEvent(this.tagUrl, 'click', function(event){
                if(event.target.nodeName.toUpperCase() === 'LI'){
                    this.removeTag(event);
                }
                // 自定义标签按钮
                if(event.target === this.add_tag_btn){
                    _.addClassName(this.add_tag_btn, 'f-dn');
                    _.delClassName(this.add_tag_input, 'f-dn');
                    this.add_tag_input.value = '';
                    this.add_tag_input.focus();
                }
            }.bind(this));

            // 添加自定义标签 函数
            var addCustomTag = function(event){
                if(event.target.value.trim()){
                    this.addTag(event.target.value.trim(), this.tagUrl, this.add_tag);
                }
                _.addClassName(this.add_tag_input, 'f-dn');
                _.delClassName(this.add_tag_btn, 'f-dn');
            }.bind(this);

            // 自定义标签输入框 失去焦点事件
            _.addEvent(this.add_tag_input, 'blur', addCustomTag);

            // 自定义标签输入框 按下回车键
            _.addEvent(this.add_tag_input, 'keydown', function(event){
                if(event.keyCode === 13){
                    addCustomTag(event);
                }
            });
        },

        // 初始化自定义标签列表
        initTagList: function(){
            // 自定义标签
            this.add_tag = _.html2node(`<li class="add_tag"><input class="f-dn" /><span>自定义标签</span></li>`);
            this.tagUrl.appendChild(this.add_tag);
            this.tags_recommend && this.addTag(this.tags_recommend, this.tagRecUrl);
            this.add_tag_input = this.add_tag.getElementsByTagName('input')[0];
            this.add_tag_btn = this.add_tag.getElementsByTagName('span')[0];
        },


        // 初始化标签和事件
        initTag: function(){
            if(!this.parent) console.log('请传入标签父容器节点');
            this.initTagList();
            this.addEvent();
            this.parent.appendChild(this.container);
        }

    });

    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Tag;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Tag;
        });
    } else {
        // 直接暴露到全局
        window.Tag = Tag;
    }
})();