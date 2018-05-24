const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
	data: {
		initData: [],  		// 试题套数列表
		examData: [],  		// 处理过的数据
		type_id: '',   		// 题库类型
    	title:'',      		// 题型标题   
    	hasIntegral: '',    // 个人积分
	},
	onLoad: function(options) {
		var _this = this;
		// console.log(options);
		_this.setData({ 
	      	// type_id: options.type_id,
	      	// title: options.title,
	      	type_id: 7,
	      	hasIntegral: app.globalData.sore
	    })
	    
		// 接口拿数据
		// 放入initData中

		// console.log(options.target.dataset.id+ '-------------------');

	    // 请求后台获取试题套数
	    wx.request({
	      	url: config.route + api.testNumber,
	      	data: {
	        	// type_id: options.type_id,
	        	type_id: 7,
	        	token: config.token
	      	},
	      	success: function (res) {
	        	_this.setData({
	          		initData: res.data,
	        	})
	        	console.log('success' + res);
	      	}
	    });
		// 再执行_this.initExamData();
		_this.initExamData();
		config.questionTime = 300;
	},

	// 初始化试题
	initExamData: function() {
		var _this = this;
		var examData = [];
		// console.log(_this.data.type_id + '------------------');
		for (var i = 0, len = _this.data.initData.length; i < len; i++) {
			var attr = {
				isExpand: false,  // 是否展开
				examNum: '',      // 试题序号
				difficulty: _this.data.initData[i].difficulty,  //难度
				examIconClass: 'expand',  // icon样式
				examType: '',      // 选中的试题类型
				examId: 0,        // 试题id
			}
			
			attr.examNum = '试题' + changeNum(i);
			examData.push(attr);
		}
		_this.setData({ examData: examData });
	},

	// 去到答题页
	toQuestionPage: function(e) {
    var type_id = e.currentTarget.dataset.type; 
    var number_id = e.currentTarget.dataset.number;
		wx.navigateTo({
      		url: path.questionPage + '?type_id=' + type_id + '&number_id=' + number_id
	  	})
	}
})
