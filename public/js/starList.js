!function (_) {
    function StarList(container, data) {
        this.listInfo  = data;
        this.container  = container;

    //    绑定事件
        this.container.addEventListener('click', this.followHandler.bind(this));
        this.render(data);
    }

    _.extend(StarList.prototype,_.emitter);

    _.extend(StarList.prototype,{
        render: function (data) {
            var html = '';
            data.forEach(function (item) {
                html += this.renderItem(item);
            }.bind(this));
            this.container.innerHTML = html;
        },

        renderItem: function (data) {
            var config = followConfig[Number(data.isFollow)];
            var html  = '<li class="m-card">\
                            <img src="img/icon_01.png" alt="头像" class="card-avatar">\
                            <div class="card-info">\
                                <div class="card-name">${data.nickname}</div>\
                                <div class="card-fans"><span class="works">作品 ${data.workCount}</span>粉丝 ${data.followCount}</div>\
                            </div>\
                            <button class="u-btn-follow ${config.class}" data-userId="${data.id}">\
                                <span class="${config.icon}"></span>${config.text}\
                            </button>\
                        </li>';
            return html;
        },
        followHandler: function (event) {
            var target = event.target;
            if (event.target.tagName === 'button'){
                // 不知道怎么写
                var user = window.user;
                // 未登录
                if (user.username === undefined){
                    this.emit('login');
                    return;
                }
                // 已登录
                var userId = target.dataset.userId,
                    data;
                // data 就是点击的用户信息
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

        }
    });

    //          5.Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = StarList;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return StarList;
        });
    } else {
        // 直接暴露到全局
        window.StarList = StarList;
    }
}(util);