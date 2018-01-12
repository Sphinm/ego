(function () {

    var template = `<div class="section-content">
                        <ul class="m-list2" id="startList"></ul>
                    </div>`;

    function StarList(option) {
        // extend set
        _.extend(this, option);

        this.container = _.html2node(template);
        this.ul = this.container.querySelectorAll('ul')[0];
        this.list = document.querySelector('.star-list');

        this.initStartList();
    }

    _.extend(StarList.prototype,_.emitter);

    _.extend(StarList.prototype,{

        render: function (data) {
            var html = '';
            data.forEach(function (item) {
                html += this.renderItem(item);
            }.bind(this));
            this.ul.innerHTML = html;
        },

        renderItem: function (data) {
            var followConfig = [
                {
                    class: '',
                    icon: 'u-icon-jia',
                    text: '关注'
                },
                {
                    class: 'z-follow',
                    icon: 'u-icon-ok',
                    text: '已关注'
                }
            ];
            var config = followConfig[Number(data.isFollow)];
            var html  = `<li class="m-card">
                            <img src="../img/icon_01.png" alt="头像" class="card-avatar">
                            <div class="card-info">
                                <div class="card-name">${data.nickname}</div>
                                <div class="card-fans"><span class="works">作品 ${data.workCount}</span>粉丝 ${data.followCount}</div>
                            </div>
                            <button class="u-btn-follow ${config.class}" data-userid="${data.id}">
                                <span class="${config.icon}"></span>${config.text}
                            </button>
                        </li>`;
            return html;
        },

        followHandler: function (event) {
            var target = event.target;
            if (target.tagName.toUpperCase() === 'BUTTON'){
                if(target.dataset.loginstatus === 'false'){
                    // 弹出登录弹窗
                    this.emit('showLoginModal');
                    return;
                }

                var data;
                // data 就是点击的用户信息，这里使用假数据替代
                data = {
                    id: target.dataset.userid,
                    nickname: 'Nockle',
                    workCount: 68,
                    followCount: 945
                };

                if (_.hasClassName(target, 'z-follow')){
                    this.unFollow(data, target.parentNode);
                } else {
                    this.follow(data, target.parentNode);
                }
            }
        },

        follow: function (followInfo, replaceNode) {
            _.ajax({
                url: '/api/users?follow',
                method: 'POST',
                data: {id: followInfo.id},
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        followInfo.isFollow = true;
                        followInfo.followCount++;
                        var newNode = _.html2node(this.renderItem(followInfo));
                        replaceNode.parentNode.replaceChild(newNode, replaceNode);
                    }
                }.bind(this),
                fail: function () {}
            })
        },
        unFollow: function (followInfo, replaceNode) {
            _.ajax({
                url: '/api/users?unfollow',
                method: 'POST',
                data: {id: followInfo.id},
                success: function(data){
                    data = JSON.parse(data);
                    if(data.code === 200){
                        followInfo.isFollow = false;
                        var newNode = _.html2node(this.renderItem(followInfo));
                        replaceNode.parentNode.replaceChild(newNode, replaceNode);
                    }
                }.bind(this),
                fail: function () {}
            });
        },

        getStarList: function () {
            _.ajax({
                url: '/api/users?getstarlist',
                method: 'GET',
                success: function(data){
                    data = JSON.parse(data);
                    if(data.code === 200){
                        this.render(data.result);
                    }
                }.bind(this),
                fail: function(){}
            })
        },

        initStartList:function () {
            this.list.appendChild(this.container);
            this.getStarList();
            // 通过事件代理触发子节点事件
            _.delegateEvent(this.ul, 'button', 'click', this.followHandler.bind(this));
        }

    });


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global

    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = StarList;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return StarList
        });
    } else {
        // 直接暴露到全局
        window.StarList = StarList;
    }
})();