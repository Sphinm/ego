/**
 * 作品列表组件
 * */

(function(){

    var template_cnt = `<div class="m-workscnt"></div>`;

    var template = Handlebars.compile(`
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
		</ul>`);


    function WorkList(options){
        _.extend(this, options);

        // 缓存节点
        this.loading = document.querySelector('.u-icon-load');
        this.cnt = _.html2node(template_cnt);
        this.parent.appendChild(this.cnt);

        this.initWorkList();
    }

    // 事件发射器
    _.extend(WorkList.prototype, _.emitter);

    _.extend(WorkList.prototype,{

        // 渲染作品列表
        getWorksList: function(options){
            options = options || {};
            this.workList && _.addClassName(this.workList, 'f-dn');
            _.delClassName(this.loading, 'f-dn');

           // if (parseInt(options.total)* parseInt(options.limit) > parseInt(options.offset)) {

               // 更新查询参数
               typeof options.total === 'undefined' || (this.param_total = options.total);
               typeof options.offset === 'undefined' || (this.param_offset = options.offset);
               typeof options.limit === 'undefined' || (this.param_limit = options.limit);

               _.ajax({
                   url: '/api/works',
                   method: 'GET',
                   data: {
                       total: this.param_total,
                       offset: this.param_offset,
                       limit: this.param_limit // 每页作品数
                   },
                   success: function (data) {
                       data = JSON.parse(data);
                       if (data.code === 200) {
                           _.addClassName(this.loading, 'f-dn');
                           this.renderList(data.result);
                           // 渲染分页器
                           this.renderPage(data.result);
                       }
                   }.bind(this),
                   fail: function () {
                   }
               });
           // } else return false;
        },

        renderPage: function (data) {
            // 若没有数据，则不渲染分页器
            if(data.total === 0) return;
            this.pagination = this.pagination || new Pagination({  // 若不存在则新建
                parent: this.parent,
                total: data.total,
                togglePageNum: this.getWorksList.bind(this)
            });
        },

        renderList: function(data){
            if(this.workList){
                var oldWorkList = this.workList;
                this.workList = _.html2node(template(data));
                oldWorkList.parentNode.replaceChild(this.workList, oldWorkList);
            } else{
                this.workList = _.html2node(template(data));
                this.cnt.appendChild(this.workList);
            }
        },

        // 点击删除或编辑触发事件进行操作
        clickHandler: function(event){
            var target = event.target;
            if(_.hasClassName(target, 'u-icon-delete')){
                this.delWork(target.parentNode.parentNode.dataset);
            }
            if(_.hasClassName(target, 'u-icon-edit')){
                this.editWork(target.parentNode.parentNode.dataset, target);
            }
        },

        // 删除作品
        delWork: function(data){
            // 这里需要调用Modal组件对象来触发事件
            var alert = new Modal()
            alert.emit('confirm', {
                content: `确定要删除作品<span>&nbsp;"&nbsp;${data.name}&nbsp;"&nbsp;</span>吗?`,
                confirmCallBack: function(){
                    _.ajax({
                        url: `/api/works/${data.id}`,
                        method: 'DELETE',
                        success: function(){
                            this.getWorksList();
                        }.bind(this),
                        fail: function(){}
                    });
                }.bind(this)
            });
        },

        // 修改作品名称
        editWork: function(data, work_target){
            var alert = new Modal();
            alert.emit('confirm', {
                title: '输入新名称',
                content: `<input class="u-ipt new_name" value="${data.name}" />`,
                confirmCallBack: function(event){
                    var confirm_modal = event.target.parentNode.parentNode;
                    var new_name = confirm_modal.querySelector('.new_name').value.trim();
                    // 如果新的作品名为空则不修改
                    if(new_name){
                        _.ajax({
                            url: `/api/works/${data.id}`,
                            method: 'PATCH',
                            data: {name: new_name},
                            success: function(data){
                                data = JSON.parse(data);
                                console.log(data)
                                var name_node = work_target.parentNode.parentNode.querySelector('h3');
                                name_node.innerHTML = new_name;
                                work_target.parentNode.parentNode.dataset.name = new_name;
                            }.bind(this),
                            fail: function(){}
                        });
                    }
                }.bind(this)
            });
        },

        initWorkList: function(){
            // 默认查询参数
            this.param_total = 1;
            this.param_offset = 0;
            this.param_limit = 15;

            this.getWorksList();

            this.cnt.addEventListener('click', this.clickHandler.bind(this));
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
