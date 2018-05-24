const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');

//获取应用实例
const app = getApp()

Page({
	data: {
    initData: [],       //题目
		showData: [],
		currentIndex: 0,    // 当前题目的下标
		time: 0,        //  倒计时
		isLessTime: false,    // 是否剩时不多
		timeInterval: null,    // 计时器
		isShowPopup: false,    // 是否显示答题完成弹窗
    type_id:0,//题型ID
    sore:0,//积分
    numbe:0,
		start:1,
	},

	onLoad: function(options) {
		var _this = this;
    _this.setData({
      type_id: options.type_id
    });
    //获取题目
    wx.request({
      url: config.route + api.getTest,
      data: {
        user_id: app.globalData.user_id,
        type_id: options.type_id,
        number_id: options.number_id,
        token: config.token
      },
      success: function (res) {
        _this.setData({
          initData: res.data.data,
          start: res.data.start
        });
        _this.initData();
        _this.countDownTime();
      }
    });
	},

	initData: function(id) {
		var _this = this;
		var initData = _this.data.initData;
		// 接口获取数据，传入initData
		for (var i = 0, len = initData.length; i < len; i++) {
			initData[i].num = '试题' + changeNum(i);
			for (var j = 0; j < initData[i].option.length; j ++) {
				initData[i].option[j].itemClass = 'item-default';
			}
		}
		_this.setData({ 
			showData: initData[_this.data.currentIndex], 
			initData: initData
		})
	},

	// 选择答案
	selectAnswer: function(e) {
		var _this = this;
		var data = _this.data.showData;
		var index = parseInt(e.target.dataset.option);

		// 多项选择时，标记答案
		if (data.type === 1) {  
      if (!data.option[index].isSelected) {
        data.option[index].isSelected = true;
        data.option[index].itemClass = 'item-selected';
        _this.setData({ showData: data  })
        return;
      } else {
        data.option[index].isSelected = false;
        data.option[index].itemClass = 'item-default';
        _this.setData({ showData: data  })
        return;
      }
		}

		// 非多项选择答对时
		if (data.option[index].attr) {
			data.option[index].itemClass = 'item-right';
	
      //增加积分
      var n = parseInt(_this.data.sore) + parseInt(data.sore);
      _this.setData({ sore: n });
      _this.numadd();
      _this.nextQuestion(data);
      return false;
		}else{
      //提交后台记录错题
      wx.request({
        url: config.route + api.addErroe,
        data: {
          user_id: app.globalData.user_id,
          key: data.id,
          tid: data.test_id,
          content: data.option[index],
          token: config.token
        },
        success: function (res) {

        }
      });
    } 
    
		// 非多项选择答错时
		data.option[index].itemClass = 'item-wrong';
		for (var i = 0, len = data.option.length; i < len; i++) {
			if (data.option[i].attr) {
				data.option[i].itemClass = 'item-right';
			}
		}
		_this.nextQuestion(data);
	},

	// 多选判断
	selectMul: function() {
		var _this = this;
		var data = _this.data.showData;
    var isError=0;
		for (var i = 0, len = data.option.length; i < len; i++) {
			if (data.option[i].attr) {  // 如果正确
				data.option[i].itemClass = 'item-right';
			}
			if (data.option[i].isSelected && !data.option[i].attr) {  // 如果错误
				data.option[i].itemClass = 'item-wrong';
        isError=1;
			}
		}
    if (isError==0){
      var n = parseInt(_this.data.sore) + parseInt(data.sore);
      _this.setData({ sore: n });
      _this.numadd();
    }else{
      //提交后台记录错题
      wx.request({
        url: config.route + api.addErroe,
        data: {
          user_id: app.globalData.user_id,
          key: data.id,
          tid: data.test_id,
          content: data.option,
          types:2,
          token: config.token
        },
        success: function (res) {

        }
      });
    }
		_this.nextQuestion(data);
	},

	// 下一题
	nextQuestion: function(data) {
		var _this = this;
		var currentIndex = _this.data.currentIndex + 1;
		_this.setData({ showData: data })
		// 完成答题
		if (currentIndex >= _this.data.initData.length) {
      //提交后台，保存积分
      wx.request({
        url: config.route + api.addSore,
        data: {
          user_id: app.globalData.user_id,
          sore: _this.data.sore,
          type_id: _this.data.type_id,
          token: config.token
        },
        success: function (res) {
          
        }
      });
			clearInterval(_this.data.timeInterval);
			setTimeout(() => {
				_this.setData({ isShowPopup: true })
			}, config.nextQuestionTime)
			return;
		}

		setTimeout(() => {
			_this.setData({
				currentIndex: currentIndex,
				showData: _this.data.initData[currentIndex]
			})
		}, config.nextQuestionTime)
	},
  //增加答对数
  numadd: function () {
    var _this = this;
    _this.data.numbe++;

    _this.setData({
      numbe: _this.data.numbe,
    })
  },
	// 回到首页
	toIndexPage: function() {
		var _this = this;
		_this.setData({ isShowPopup: false });
    wx.navigateBack({
      delta: 4
    })
		// wx.navigateTo({
	  //     url: path.indexPage
	  //   })
	},

	// 时间倒计时
	countDownTime: function() {
		var _this = this;
		// 初始化时间
		_this.setData({ time: config.questionTime })

		// 倒计时
		var timeInterval = setInterval(function() {
			if (_this.data.time === config.lessTime + 1) {
				_this.setData({ isLessTime: true })
			}
			if (_this.data.time === 0) {
				clearInterval(_this.data.timeInterval);
				return;
			}
			_this.setData({ time: _this.data.time-1 })
		}, 1000)
		_this.setData({ timeInterval: timeInterval })
	},
	
	likeFun: function() {
    var _this = this;
    var data = _this.data.showData;
		if (data.islike) {
			// 已点过赞
      _this.showToast('您已点过赞啦');
		} else {
			// 点赞
      wx.request({
        url: config.route + api.click,
        data: {
          user_id: app.globalData.user_id,
          tid: data.test_id,
          key:data.id,
          token: config.token
        },
        success: function (res) {
          if(res.data.code==1){
            var currentIndex= _this.data.currentIndex;
            _this.data.initData[currentIndex].click_num =_this.data.initData[currentIndex].click_num+1;
            _this.data.initData[currentIndex].islike = true;
            _this.setData({
              currentIndex: currentIndex,
              showData: _this.data.initData[currentIndex]
            })

            _this.showToast('感谢您的支持');
          }else{
            _this.showToast(res.data.msg);
          }
        }
      });
		}
	},
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500,
      success: function () {
        
      }
    })
  },
})
