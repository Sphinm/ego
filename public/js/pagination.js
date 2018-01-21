(function () {

    /**
     * 分页器组件
     * @type {number}
     */

    // 默认选中页码
    var DEFAULT_CURRENT_PAGE = 1;
    // 默认显示页码个数
    var DEFAULT_SHOW_NUM = 6;
    // 默认每页显示数量
    var DEFAULT_ITEMS_LIMIT = 15;


    function Pagination(options) {
        console.log(options)
        // 继承配置
        _.extend(this, options);
        this.current = options.current || DEFAULT_CURRENT_PAGE;
        this.showNum = options.showNum || DEFAULT_SHOW_NUM;
        this.itemsLimit = options.itemsLimit || DEFAULT_ITEMS_LIMIT;
        this.totalNum = Math.ceil(this.total / this.itemsLimit);


        this.container = _.html2node('<ul class="m-pagination f-cb"></ul>');
        this.renders();
        this.addEvent();
    }

    _.extend(Pagination.prototype, {
        renders: function () {
            this.startNum = Math.floor((this.current - 1) / this.showNum) * this.showNum + 1;
            this.endNum = Math.min(this.startNum + this.showNum - 1, this.totalNum);

            // 分页器结构
            // js中类型问题真的头疼，这里不强制转整型还不对
            var html = `<li data-page="1" class="${parseInt(this.current) === 1 ? 'disabled' : ''}">第一页</li>`;
            html += `<li data-page="${this.current - 1}" class="${parseInt(this.current) === 1 ? 'disabled' : ''}">上一页</li>`;
            for(let i=this.startNum;i<=this.endNum;i++){
                html += `<li data-page="${i}" class="${i === parseInt(this.current) ? 'z-active' : ''}">${i}</li>`;
            }
            html += `<li data-page="${this.current - 0 + 1}" class="${parseInt(this.current)=== parseInt(this.totalNum) ? 'disabled' : ''}">下一页</li>`;
            html += `<li data-page="${this.totalNum}" class="${parseInt(this.current) === parseInt(this.totalNum) ? 'disabled' : ''}">尾页</li>`;
            this.container.innerHTML = html;

            this.parent.appendChild(this.container);
        },


        // 判断当前页面是不是第一页和最后一页，是的话设置disabled状态
        setStatus: function (page) {
            // 更新当前页
            this.current = page;
            // 刷新分页器
            this.renders();
            // 重新渲染分页器组件
            this.togglePageNum({
                total: 1,
                offset: (this.current - 1) * this.itemsLimit,
                limit: this.itemsLimit
            });
        },

        // 设置点击事件
        addEvent: function () {
            // 容器节点，事件代理
            this.container.addEventListener('click', function(event){
                // 有页码，且未被禁用时
                if(event.target.dataset.page && ! _.hasClassName(event.target, 'disabled')){
                    // 切换页码
                        this.setStatus(event.target.dataset.page);
                }
            }.bind(this));
        }


    });


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global

    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Pagination;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Pagination
        });
    } else {
        // 直接暴露到全局
        window.Pagination = Pagination;
    }
})();