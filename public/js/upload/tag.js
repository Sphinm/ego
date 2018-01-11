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

        this.container = _.html2node(html);
        this.tagUrl = this.container.querySelector('.tag_list');
        this.parent = document.getElementsByClassName('u-main')[0];
        this.tagRecUrl = this.container.querySelector('.tag_rec_list');
        this.tagList = [];
        this.tagListRec = [];

        this.initTag();

    }

    _.extend(Tag.prototype, {

        getValue:  function(){ return this.tagList.join(',') },

        addTag: function(tags, target, before){
            // 闭包导致了this的指向变化 需要自己来指向
            var that = this;
            // 添加单个tag函数
            var add = function(tag){
                // 若未添加过此标签
                if(that.tagList.indexOf(tag) === -1){
                    // 若对位置没有要求，则直接放在尾部
                    if(typeof before === 'undefined'){
                        this.target.appendChild(_.html2node(`<li>${tag}</li>`));
                    } else{
                        this.target.insertBefore(_.html2node(`<li>${tag}</li>`), this.before);
                    }
                    that.tagList.push(tag);
                }
            };

            // tags支持数组，也支持单个字符串
            if(tags && !Array.isArray(tags)) tags = [tags];

            // 遍历tags, 添加时，用到的上下文
            // 指定forEach的上下文
            var context = {};
            target && (context.target = target);
            before && (context.before = before);
            // 若是添加到选中tag节点
            if(target === this.tagUrl){
                context.list = this.tagList;
            } else{
                context.list = this.tagListRec;
            }
            // 遍历tags, 添加tag
            (tags || []).forEach(add, context);
        },

        removeTag: function(event){
            // 若已添加过此标签
            if(this.tagList.indexOf(event.target.innerText) !== -1){
                // 从选中list中移除
                this.tagList.splice(this.tagList.indexOf(event.target.innerText),1);
                // 从视图中移除
                event.target.parentNode.removeChild(event.target);
            }
        },

        addEvent: function(){
            //   点击推荐标签 事件
            _.addEvent(this.tagRecUrl, 'click', function(event){
                if(event.target.nodeName.toUpperCase() !== 'LI') return;
                this.addTag(event.target.innerText, this.tagUrl, this.add_tag);
            }.bind(this));

            //   点击选中标签 事件
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

            //  添加自定义标签 函数
            var addCustomTag = function(event){
                // 若自定义input内 有值
                if(event.target.value.trim()){
                    this.addTag(event.target.value.trim(), this.tagUrl, this.add_tag);
                }
                _.addClassName(this.add_tag_input, 'f-dn');
                _.delClassName(this.add_tag_btn, 'f-dn');
            }.bind(this);

            //   3.3  自定义标签输入框 失去焦点事件
            _.addEvent(this.add_tag_input, 'blur', addCustomTag);

            //   3.4  自定义标签输入框 按下回车键
            _.addEvent(this.add_tag_input, 'keydown', function(event){
                if(event.keyCode === 13){
                    addCustomTag(event);
                }
            });
        },

        initTagList: function(){
            // 添加最后的自定义标签
            this.add_tag = _.html2node(`<li class="add_tag"><input class="f-dn" /><span>自定义标签</span></li>`);
            this.tagUrl.appendChild(this.add_tag);
            // 添加默认选中标签
            this.tags && this.addTag(this.tags, this.tagUrl, this.add_tag);
            // 添加推荐标签
            this.tags_recommend && this.addTag(this.tags_recommend, this.tagRecUrl);

            // 输入框
            this.add_tag_input = this.add_tag.getElementsByTagName('input')[0];
            // 自定义标签按钮
            this.add_tag_btn = this.add_tag.getElementsByTagName('span')[0];
        },


        initTag: function(){

            this.getDataTag();

            // 1.检验必传参数
            if(!this.parent){
                console.log('请传入标签父容器节点');
                return;
            }
            // 2.初始化默认标签（选中标签、推荐标签）
            this.initTagList();

            // 3.绑定事件
            this.addEvent();

            // 4.挂载组件
            this.parent.appendChild(this.container);

        },

        getDataTag: function () {
            _.ajax({
                url: '/api/tags?recommend',
                method: 'GET',
                success: function(data){
                    data = JSON.parse(data);
                    if(data.code === 200){
                        this.tag = new Tag({
                            parent: document.getElementsByClassName('u-main')[0],
                            tags_recommend: data.result.split(',')
                        });
                        console.log(parent)
                    }
                    else{
                        console.log(data);
                    }
                }.bind(this),
                fail:function(){console.log(123)}
            });
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