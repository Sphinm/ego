!function(_){

	// 表单 主体html模板
	var template = 
	'<form class="m-from">\
			<div class="form-tip">tips</div>\
	    </form>';

	 //表单验证工厂
	function Form(opt) {
		// 将数据复制到自身实例上
    	_.extend(this,opt);

	    this.form = this._layout.cloneNode(true);
	    this.formTip = this.form.querySelector(".form-tip");
	    // 初始去除消息显示
		this.formTip.style.display = "none";

	    // 初始化
	    this._init();
	}

	// 事件注册
  	_.extend( Form.prototype, _.emitter);

	// 构建Form方法
	_.extend(Form.prototype, {
		
		// 根据模板转换为节点
		_layout: _.html2node(template),

		// Form show接口
		show: function(container) {
			this.container = container || this.container || document.body;
			this.container.appendChild(this.container);
		},

		// 表单提交
		onSubmit: function() {
			var self = this;
			var event = arguments[0] || window.event;
            event.preventDefault();

			var result = [],
				errorTip = "";

			// 先进行所有的验证，获得提交数据
			for (var i = 0; i < self.forms.length; i++) {
				if (self._validator.call(self,i)) {
					result.push(self.forms[i].value);
				} else {
					if (i !== 0) {
						errorTip += "<br/>";
					}
					errorTip += self.data[i].fail;
				}
			}

			if (errorTip !== "") {
				self._error_tip(errorTip);
				return false;
			}
			
			// 最后进行提交
			self.emit("submit",result,function(success) {
				if (success) {
					// 提交成功
					self._true_tip(self.submitSuccess);
				} else {
					// 提交失败
					self._error_tip(self.submitFail);
				}
			});
		},

		// 内部接口
		_init: function() {
			var self = this;
	    	// 根据data初始化表单
	    	self.data.forEach(function(data,index) {
	    		self._formFactory(data,index);
	    	});
	    	
	    	this.forms = this.form.querySelectorAll(".form");
	    	// 初始化事件
	    	self._initEvent();
	    },

	    _formFactory: function(data,index) {
	    	if (!data.tag) return;
	    	var formData = document.createElement(data.tag);
	    	if (data.type) {
                formData.type = data.type;
	    	}
	    	if (data.text) {
                formData.innerHTML = data.text;
	    	}
	    	if (data.label) {
	    		var temp = document.createElement('label');
	    		temp.value = data.label;
	    		temp.appendChild(formData);
                formData = temp;
	    	}
	    	if (data.rules) {
                formData.placeholder = data.rules;
	    	}
	    	_.addClassName(formData,"form");
	    	this.form.appendChild(formData);
	    },

	    // 事件初始化
		_initEvent: function() {
			var self = this;
			self.forms.forEach(function(child,index) {
				_.addEvent(child, 'focus',self._default_tip.bind(self));
				_.addEvent(child, 'blur',self._validator.bind(self,index));
			});
			// 表单提交验证
			_.addEvent(self.form, "submit", self.onSubmit.bind(self));
		},

		_validator: function(index) {
			if (!this.data[index].validator) {
				return true;
			}
			var valid = this.data[index].validator,
				target = this.forms[index];
			if (valid(target.value)) {
				// 验证成功
				if (this.data[index].success) {
					this._true_tip(this.data[index].success);
				}
				return true;
			} else {
				// 验证失败
				if (this.data[index].fail) {
					this._error_tip(this.data[index].fail);
				}
				return false;
			}
		},

	    _default_tip: function (str) {
	        this.formTip.style.display = "none";
	    },
	    _true_tip: function (str) {
	    	this.formTip.style.display = "block";
	        this.formTip.innerHTML = str;
	        _.addClassName(this.formTip,'success')
	        _.addClassName(event.target,'success');
	    },
	    _error_tip: function (str) {
	        this.formTip.style.display = "block";
	        this.formTip.innerHTML = str;
	        _.addClassName(this.formTip,'fail')
	        _.addClassName(event.target,'fail');
	    }
	});

	//          5.Exports
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global 
	// 支持commonjs
	if (typeof exports === 'object') {
	    module.exports = Form;
	    // 支持amd
	} else if (typeof define === 'function' && define.amd) {
	    define(function() {
	      return Form;
	    });
	} else {
	    // 直接暴露到全局
	    window.Form = Form;
	}
	
}(util);