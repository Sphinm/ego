(function(){

    var template_cnt = `<div class="m-workscnt"></div>`;

    var template = `
		<ul class="m-workslist">
			{{#if total}}
				{{#each data}}
				<li class="item" data-id="{{id}}" data-name="{{name}}">
					<a href="/works/detail/{{id}}">
						<img src="{{coverUrl}}" alt="" />
						<h3>{{name}}</h3>
					</a>
					<div class="icons">
						<i class="u-icon u-icon-edit"></i>
						<i class="u-icon u-icon-delete"></i>
					</div>
				</li>
				{{/each}}
			{{else}}
				<div class="cnt">你还没有创建过作品</div>
			{{/if}}
		</ul>`;

    /**
     *  options = {
	*    parent: dom节点,  父容器
	*  }
     */
    function WorkList(options){

        // 继承配置
        _.extend(this, options);

        // 初始化
        this.init();
    }

    // 混入事件管理器
    _.extend(WorkList.prototype, _.emitter);

    _.extend(WorkList.prototype,{
        init: function(){

            // 添加Loading图标
            this.loading = _.html2node(`<img class="f-dn" src="../../res/images/loading.gif" />`);
            this.title.appendChild(this.loading);
            // 渲染作品内容
            this.cnt = _.html2node(template_cnt);
            this.parent.appendChild(this.cnt);

            // 查询参数 (初始化) 用于删除作品时，为 刷新列表操作 保存默认查询参数
            this.param_total = 1;
            this.param_offset = 0;
            this.param_limit = 10;

            // 获取列表信息 (初始化)
            this.getWorksList();

            // 绑定事件
            this.cnt.addEventListener('click', this.clickHandler.bind(this));
        },

        getWorksList: function(options){
            // 防止options undefined
            options = options || {};
            // 隐藏已有数据列表
            this.workList && _.addClassName(this.workList, 'f-vh');
            // 显示Loading图标
            _.delClassName(this.loading, 'f-dn');

            // 更新查询参数
            typeof options.total === 'undefined' || (this.param_total = options.total);
            typeof options.offset === 'undefined' || (this.param_offset = options.offset);
            typeof options.limit === 'undefined' || (this.param_limit = options.limit);

            _.ajax({
                url: '/api/works',
                method: 'GET',
                data: {
                    total: this.param_total,  // 是否需要返回总数
                    offset: this.param_offset, // 偏移数
                    limit: this.param_limit // 返回的 作品条数
                },
                success: function(data){
                    data = JSON.parse(data);
                    if(data.code === 200){
                        _.addClassName(this.loading, 'f-dn');
                        // 更新作品列表
                        this.renderList(data.result);
                        // 渲染分页器
                        this.renderPagination(data.result);
                    }
                }.bind(this),
                fail: function(){}
            });
        },

        renderList: function(data){
            // 是否已存在作品列表
            if(this.workList){
                // 若存在，则更新数据
                var oldWorkList = this.workList;
                this.workList = _.html2node(template(data));
                oldWorkList.parentNode.replaceChild(this.workList, oldWorkList);
            }
            else{
                // 若不存在，则新增
                this.workList = _.html2node(template(data));
                this.cnt.appendChild(this.workList);
            }
        },

        renderPagination: function(data){
            // 若没有数据，则不渲染分页器
            if(data.total === 0){return;}
            // 单例模式
            this.pagination = this.pagination || new Pagination({  // 若不存在则新建
                parent: this.parent,
                total: data.total,
                togglePageNum: this.getWorksList.bind(this)
            });
        },

        clickHandler: function(evt){
            var target = evt.target;
            // 若点的是删除按钮
            if(_.hasClassName(target, 'u-icon-delete')){
                this.delWork(target.parentNode.parentNode.dataset);
            }
            // 若点的是编辑按钮
            else if(_.hasClassName(target, 'u-icon-edit')){
                this.editWork(target.parentNode.parentNode.dataset, target);
            }
        },

        delWork: function(data){

            // 发布 显示确认弹窗事件
            this.emit('confirm', {
                content: `确定要删除作品<span>"${data.name}"</span>吗?`,
                confirmCallBack: function(){
                    _.ajax({
                        url: `/api/works/${data.id}`,
                        method: 'DELETE',
                        success: function(){
                            // 刷新列表
                            this.getWorksList();
                        }.bind(this),
                        fail: function(e){
                            console.log(e);
                        }
                    });
                }.bind(this)
            });
        },

        editWork: function(data, work_target){

            // 发布 显示确认弹窗事件
            this.emit('confirm', {
                title: '请输入新的作品名称',
                content: `<input class="u-ipt new_name" value="${data.name}" />`,
                confirmCallBack: function(evt){
                    // 弹窗组件节点
                    var confirm_modal = evt.target.parentNode.parentNode;
                    // 编辑后的 新的 作品名称
                    var new_name = confirm_modal.querySelector('.new_name').value.trim();
                    // 若新名称 不为空
                    if(new_name){
                        _.ajax({
                            url: `/api/works/${data.id}`,
                            method: 'PATCH',
                            data: {name: new_name},
                            success: function(res){
                                res = JSON.parse(res);
                                console.log(res);
                                // 要修改的作品的名称 dom节点
                                var name_node = work_target.parentNode.parentNode.getElementsByTagName('h3')[0];
                                // 修改作品名称
                                name_node.innerHTML = new_name;
                                work_target.parentNode.parentNode.dataset.name = new_name; // 同步更新 data- 上属性值
                            }.bind(this),
                            fail: function(e){
                                console.log(e);
                            },
                        });
                    }
                    console.log(new_name);
                }.bind(this)
            });
        }
    });

    // ----------------------------------------------------------------------
        // 暴露API:  Amd || Commonjs  || Global
        // 支持commonjs
        if (typeof exports === 'object') {
            module.exports = WorkList;
            // 支持amd
        } else if (typeof define === 'function' && define.amd) {
            define(function() {
                return WorkList;
            });
        } else {
            // 直接暴露到全局
            window.WorkList = WorkList;
        }

})();
