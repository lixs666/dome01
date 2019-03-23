var bank = {

	phoneReg: /^0?1[3456789]\d{9}$/,

	//保存定时器序号
	timer: null,

	//验证码
	verifyCode: '',

	//排号
	c: 0,

	//等待人数
	n: 0,

	//验证手机号
	isPhone: function (phone) {
		return this.phoneReg.test(phone);
	},

	//封装获取id方法
	getId: function (id) {
		return document.getElementById(id);
	},

	//格式化时间
	formatDate: function (date, format) {
		//date: 日期时间对象
		//format: 格式化规则 yyyy-MM-dd hh:mm:ss
				
		var dateObj = {
			M: date.getMonth() + 1, //月
			d: date.getDate(), 			//日
			h: date.getHours(), 		//时
			m: date.getMinutes(), 	//分
			s: date.getSeconds()		//秒
		};

		//年份正则表达式
		var yearReg = /(y+)/;
		if (yearReg.test(format)) {
					//获取第一个匹配组内容
					var yearContent = RegExp.$1; //yyyy, yy

					//获取年份
					var year = date.getFullYear().toString(); //2018

					//控制年份4位还是2位
					year = yearContent.length == 4 ? year : year.slice(-2);
					
					//替换
					format = format.replace(yearReg, year);
		}

		//替换 月、日、时、分、秒
		for (var key in dateObj) {

					var keyReg = new RegExp('(' + key + '+)');

					if (keyReg.test(format)) {
						//如果验证通过
						//获取匹配组内容
						var keyContent = RegExp.$1;
						// console.log('keyContent ==> ', keyContent);

						//获取对象的值
						var keyValue = dateObj[key];
						// console.log('keyValue ==> ', keyValue);

						//控制值是否补零
						keyValue = keyValue >= 10 ? keyValue : keyContent.length == 2 ? '0' + keyValue : keyValue;

						//替换
						format = format.replace(keyReg, keyValue);

					}

		}

		return format;

	},

	//添加事件
	addEvent: function (id, type, fn, isCapture) {

		var element = this.getId(id);

		if (window.addEventListener) {
			element.addEventListener(type, fn, isCapture);
		} else {
			element.attachEvent('on' + type, fn);
		}

	},

	//初始化
	init: function () {

		//保留this 指向 调用init方法的对象
		var self = this;

		//手机号输入事件
		self.addEvent('phone', 'input', function () {

			//如果验证通过
			if (self.isPhone(this.value)) {
				self.getId('getVerifyCode').disabled = false;
			} else {
				self.getId('getVerifyCode').disabled = true;
			}

			// self.getId('getVerifyCode').disabled = !self.isPhone(this.value);

		})

		//获取验证码点击事件
		self.addEvent('getVerifyCode', 'click', function () {

			//保留this指向 id=getVerifyCode 元素
			var vm = this;

			self.verifyCode = Math.random().toString().slice(-4);

			console.log('self.verifyCode ==> ', self.verifyCode);

			//重新发送验证码时间
			var time = 15;

			vm.disabled = true;
			vm.textContent = time + 's重新发送';
			self.getId('verifyCode').disabled = false;

			//禁用手机输入框
			self.getId('phone').disabled = true;

			self.timer = setInterval(function () {

				if (time <= 0) {
					clearInterval(self.timer);
					self.timer = null;
					vm.disabled = false;
					vm.textContent = '获取验证码';

					//清空验证码输入框的内容和禁用
					self.getId('verifyCode').disabled = true;
					self.getId('verifyCode').value = '';
				} else {
					time--;
					vm.textContent = time + 's重新发送';
				}

				

			}, 1000)

		})

		//验证码输入事件
		self.addEvent('verifyCode', 'input', function () {

			if (this.value == self.verifyCode) {

				//启用取号按钮
				self.getId('getCode').disabled = false;

				//清除定时器
				clearInterval(self.timer);
				self.timer = null;
				self.getId('getVerifyCode').textContent = '获取验证码';

				this.disabled = true;
				
			}

		})

		//取号点击事件
		self.addEvent('getCode', 'click', function () {

			self.c++;

			self.n++;

			//创建item
			var itemDiv = document.createElement('div');
			itemDiv.className = 'item';

			var phoneEle = self.getId('phone')
			//获取手机号
			var phone = phoneEle.value;

			//取号日期
			var date = self.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');

			itemDiv.innerHTML = '<div>手机号: <span>' + phone + '</span></div>' +
				'<div>您的排号: <span>' + (self.c >= 10 ? self.c : '0' + self.c) + '</span></div>' +
				'<div>等待人数: <span>' + (self.n - 1) + '</span></div>' +
				'<div>取号日期: <span>' + date + '</span></div>' +
				'<div>欢迎下次光临</div>';

				self.getId('items').appendChild(itemDiv);

				this.disabled = true;
				phoneEle.value = '';
				phoneEle.disabled = false;
				self.getId('verifyCode').value = '';


		})

		//叫号点击事件
		self.addEvent('callCode', 'click', function () {

			var allItem = document.querySelectorAll('.item');

			if (allItem.length == 0) {
				alert('没人办理业务');
				return;
			}

			//移除第一个
			allItem[0].remove();

			self.n--;

		})

	}


};