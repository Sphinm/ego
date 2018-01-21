/**
 * UploadPicture
 * 上传图片组件
 * 支持input上传和拖拽上传图片
 * */

(function () {

    var html = `<div class="m-upload">
		<div class="upload_controller f-cb">
			<label class="upload_title">上传图片</label>
			<div class="f-oh">
				<div class="f-cb">
					<label>
						<span class="upload_btn u-btn u-btn-primary">选择图片上传</span>
						<input class="upload_input" type="file" multiple accept="image/*" />
					</label>
					<progress class="f-dn" max="100" value="50"></progress>
					<span class="progress_msg" ></span>
				</div>
				<p class="prompt_box">提示：作品可以包含多张图片，一次选择多张图片，最多不超过10张（单张图片大小小于1M）</p>
			</div>
		</div>
		<ul class="pictures_controller f-cb">
		</ul>
	</div>`;


    function UploadPicture(opt) {

        _.extend(this, opt);

        // 缓存节点
        // 这里不复制节点是为了不妨碍后面渲染节点到页面上
        this.container = _.html2node(html);

        this.upload_btn = this.container.querySelector('.upload_btn');
        this.upload_input = this.container.querySelector('.upload_input');
        this.parent = document.querySelector('.u-main');
        this.desc = document.querySelector('.m-work-desc');
        this.progress = this.container.querySelector('progress');
        this.progress_msg = this.container.querySelector('.progress_msg');
        this.pictures_controller = this.container.querySelector('.pictures_controller');
        this.picture_list = [];

        this.initUploadPic();
    }

    // 事件发射器
    _.extend(UploadPicture.prototype, _.emitter);


    _.extend(UploadPicture.prototype, {

        changeHandler: function () {
            var files = this.upload_input.files;
            this._checkFiles(files);
            // 清空input file中列表中缓存内容
            this.upload_input.value = null;
        },

        // 拖拽上传文件并检查
        dropFiles: function (files) {
            this._checkFiles(files);
        },

        _checkFiles: function (files) {
            var maxSize = 1024 * 1024, sizeOkFiles = [], sizeExceedFiles = [], typeExceedFiles = [];

            if(files.length > 10){
                alert('图片数量超过10张了')
                return false;
            }

            [].forEach.call(files, function(item){
                if(!/^image\//.test(item.type)){
                    typeExceedFiles.push(item);
                    return false;
                }
                if(item.size < maxSize) sizeOkFiles.push(item);
                else                    sizeExceedFiles.push(item);
            });

            if(sizeExceedFiles.length > 0){
                alert('图片大小不能超过1M');
                return false;
            }

            // 禁止点击上传按钮
            _.addClassName(this.upload_btn, 'f-select');

            this._uploadFiles(sizeOkFiles);
        },

        _uploadFiles: function (files) {
            // 上传文件总数
            this.uploadfiles_total = files.length;
            // 已上传完成文件数
            this.uploadfiles_loaded = 0;
            // 上传文件进度条 数组
            this.uploadfiles_progress = [];

            for(var i=0;i<files.length;i++){
                this.uploadfiles_progress.push(0);
            }

            // 显示进度条
            this._showProgress(0, files.length);

            // 上传请求队列
            var uploadRequests = [];

            // 并发各图片上传请求
            files.forEach(function(item, index){
                uploadRequests.push(new Promise(function(resolve, reject){
                        // // 用于储存 File类型 数据
                        var data = new FormData();
                        data.append('file', item, item.name);

                        var xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.onreadystatechange = function(){
                            if(xhr.readyState === 4){
                                if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                                    resolve(JSON.parse(xhr.responseText).result);
                                } else{
                                    reject(xhr.responseText);
                                }
                            }
                        };

                        console.log(xhr.upload)
                        xhr.upload.addEventListener('progress', this.progressHandler.bind(this, index), true);
                        xhr.open('POST', '/api/works?upload');
                        xhr.send(data);

                    }.bind(this))
                        .then(function(data){
                            this._addImg(data);
                            return data;
                        }.bind(this))
                        .catch(function(){console.log('上传图片过程中抛出异常')})
                );
            }.bind(this));

            // 全部请求返回后
            Promise.all(uploadRequests)
                .then(function(){
                    this._hideProgress();
                    this._updateProgressMsg();
                    _.delClassName(this.upload_btn, 'f-select');
                }.bind(this))
                .catch(function(){console.log('请求返回后抛出异常')})
        },

        // 添加图片
        _addImg: function (data) {
            switch(Object.prototype.toString.call(data).slice(8,-1)){
                case 'String': return false;
                case 'Array':
                    data.forEach(function(item){
                        _addOneImg.call(this, item);
                    }.bind(this));
                    break;
                case 'Object':
                    _addOneImg.call(this, data);
                    break;
            }
            // 添加 单张照片
            function _addOneImg(data){
                this.picture_list.push(data);
                this.pictures_controller.appendChild(_.html2node(`
                    <li data-id="${data.id}" data-url="${data.url}">
                        <img src="${data.url}" />
                        <div class="hover_bg">
                            <i class="u-icon u-icon-delete"></i>
                        </div>
                        <button class="u-btn u-btn-link">设为封面</button>
                        <button class="u-btn u-btn-link">已设为封面</button>
                    </li>`));
            }
        },

        // HTML5原生进度条
        progressHandler: function (index, event) {
            if(event){
                this.uploadfiles_progress[index] = event.loaded / event.total;
                if(this.uploadfiles_progress[index] === 1){this.uploadfiles_loaded ++;}
            }
            this._showProgress(this.uploadfiles_progress.reduce(function(prev, cur){return prev + cur;}));
        },

        // 展示进度条信息
        _showProgress: function (value, max) {
            this.progress.max = max || this.progress.max || 0;
            this.progress.value = value;
            _.delClassName(this.progress, 'f-dn');
            this._updateProgressMsg(this.progress.value, this.progress.max);
        },

        // 更新进度条内容
        _updateProgressMsg: function (value, max) {
            var progress_msg = '';
            if(typeof value !== 'undefined' && typeof max !== 'undefined'){
                progress_msg = `共有${this.uploadfiles_total}个文件，已完成${this.uploadfiles_loaded}个文件，上传进度${parseInt(value / max * 100, 10)}%`;
            }
            // 更新进度条
            this.progress_msg.innerHTML = progress_msg;
        },

        _hideProgress: function () {
            _.addClassName(this.progress, 'f-dn');
        },

        // 设置选中图片设为封面操作
        setCoverImg: function (event) {
            if(!_.hasClassName(event.target, 'u-btn')){return;}
            [].forEach.call(this.pictures_controller.children, function(li){
                _.delClassName(li, 'z-active');
            });
            // 为当前选中li，增加选中状态
            _.addClassName(event.target.parentNode, 'z-active');
            this.coverImg = {
                id: event.target.parentNode.dataset.id,
                url: event.target.parentNode.dataset.url
            };
        },

        // 移除图片
        removeImg: function (event) {
            if(!_.hasClassName(event.target, 'u-icon')) return;

            var li = event.target.parentNode.parentNode;
            if(li.nodeName.toUpperCase() === 'LI'){
                var id =  li.dataset.id;
                // 删除li节点
                this.pictures_controller.removeChild(li);
                for(var i = this.picture_list.length - 1;i >= 0; i--){
                    if(this.picture_list[i].id === id){
                        // 则从列表中删除该图片
                        this.picture_list.splice(i,1);
                    }
                }
            }
        },

        // 接口字段 coverId coverUrl pictures
        getValue: function () {
            return {
                coverId: this.coverImg ? this.coverImg.id : undefined,
                coverUrl: this.coverImg ? this.coverImg.url : undefined,
                pictures: this.picture_list.map(function(item, index){
                    var picture = {};
                    for(let key in item){
                        picture[key] = item[key];
                    }
                    picture['position'] = index;
                    return picture;
                })
            }
        },

        // 初始化图片上传组件
        initUploadPic: function () {
            // 通过change事件使上传的内容在改变上传内容（输入域）执行
            this.upload_input.addEventListener('change', this.changeHandler.bind(this));

            // 绑定拖拽事件
            // 支持拖拽上传和选择文件上传
            this.pictures_controller.addEventListener('dragover', function(event){
                event.preventDefault();
            });

            // 拖动过程中释放鼠标触发事件
            this.pictures_controller.addEventListener('drop', function(event){
                event.preventDefault();
                this.dropFiles(event.dataTransfer.files);
            }.bind(this));

            // 设置图片封面
            this.pictures_controller.addEventListener('click', this.setCoverImg.bind(this));

            // 移除图片封面
            this.pictures_controller.addEventListener('click', this.removeImg.bind(this));

            // 渲染节点
            this.parent.insertBefore(this.container, this.desc);
        }

    });

    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = UploadPicture;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return UploadPicture;
        });
    } else {
        // 直接暴露到全局
        window.UploadPicture = UploadPicture;
    }

})();