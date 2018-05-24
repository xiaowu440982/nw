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
    sore: 0,//答对数
  },

  onLoad: function (options) {
    var _this = this;
    //获取错题目
    wx.request({
      url: config.route + api.wrongTest,
      data: {
        type_id: options.type_id,
        number_id: options.number_id,
        user_id: app.globalData.user_id,
        token: config.token
      },
      success: function (res) {
        _this.setData({
          initData: res.data
        });
        _this.initData();
        _this.countDownTime();
      }
    });
  },

  initData: function (id) {
    var _this = this;
    var initData = _this.data.initData;
    // 接口获取数据，传入initData
    for (var i = 0, len = initData.length; i < len; i++) {
      initData[i].num = '试题' + changeNum(i);
      for (var j = 0; j < initData[i].option.length; j++) {
        initData[i].option[j].itemClass = 'item-default';
      }
    }
    _this.setData({
      showData: initData[_this.data.currentIndex],
      initData: initData
    })
  },

  // 选择答案
  selectAnswer: function (e) {
    var _this = this;
    var data = _this.data.showData;
    var index = parseInt(e.target.dataset.option);

    // 多项选择时，标记答案
    if (data.type === 1) {
      data.option[index].isSelected = true;
      data.option[index].itemClass = 'item-selected';
      _this.setData({ showData: data })
      return;
    }

    // 非多项选择答对时
    if (data.option[index].attr) {
      data.option[index].itemClass = 'item-right';
      _this.nextQuestion(data);
      //增加答对数
      _this.numadd();
      //提交后台删除错题记录
      wx.request({
        url: config.route + api.delErroe,
        data: {
          user_id: app.globalData.user_id,
          tid: data.er_id,
          token: config.token
        },
        success: function (res) {
        }
      });
      return;
    } else {
      //提交后台记录错题
      wx.request({
        url: config.route + api.addErroe,
        data: {
          user_id: app.globalData.user_id,
          key: data.id,
          tid: data.test_id,
          er_id: data.er_id,
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
  selectMul: function () {
    var _this = this;
    var data = _this.data.showData;
    var isError = 0;
    for (var i = 0, len = data.option.length; i < len; i++) {
      if (data.option[i].attr) {  // 如果正确
        data.option[i].itemClass = 'item-right';
      }
      if (data.option[i].isSelected && !data.option[i].attr) {  // 如果错误
        data.option[i].itemClass = 'item-wrong';
        isError = 1;
      }
    }
    if (isError == 0) {
      //增加答对数
      _this.numadd();
      //提交后台删除错题记录
      wx.request({
        url: config.route + api.delErroe,
        data: {
          user_id: app.globalData.user_id,
          tid: data.er_id,
          token: config.token
        },
        success: function (res) {
        }
      });
    } else {
      //提交后台记录错题
      wx.request({
        url: config.route + api.addErroe,
        data: {
          user_id: app.globalData.user_id,
          key: data.id,
          tid: data.test_id,
          er_id: data.er_id,
          content: data.option,
          types: 2,
          token: config.token
        },
        success: function (res) {

        }
      });
    }
    _this.nextQuestion(data);
  },
  //增加答对数
  numadd:function(){
    var _this = this;
    _this.data.sore++;
    console.log(_this.data.sore);
    _this.setData({
      sore: _this.data.sore,
    })
  },
  // 下一题
  nextQuestion: function (data) {
    var _this = this;
    var currentIndex = _this.data.currentIndex + 1;
    _this.setData({ showData: data })
    // 完成答题
    if (currentIndex >= _this.data.initData.length) {
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

  // 回到首页
  toIndexPage: function () {
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
  countDownTime: function () {
    var _this = this;
    // 初始化时间
    _this.setData({ time: config.questionTime })

    // 倒计时
    var timeInterval = setInterval(function () {
      if (_this.data.time === config.lessTime + 1) {
        _this.setData({ isLessTime: true })
      }
      if (_this.data.time === 0) {
        clearInterval(_this.data.timeInterval);
        return;
      }
      _this.setData({ time: _this.data.time - 1 })
    }, 1000)
    _this.setData({ timeInterval: timeInterval })
  },
})
