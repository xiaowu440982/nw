const { api, config, path } = require('../../utils/config.js');

// directory.js
var address = require('../../utils/city.js')
var animation
var app = getApp();
Page({

  /**
   * @initData: 页面的初始数据
   */
  data: {
    
    // 填写信息
    style: '',  // 选择题目类型
    inputContent: '',   // 上传题目内容
    type_name: '',//题库类型
  },

  onLoad: function (options) {
    var _this = this;
    //请求后台获取试题
    wx.request({
      url: config.route + api.myTest,
      data: {
        id: options.id,
        token: config.token
      },
      success: function (res) {
        _this.setData({
          style: res.data.style,
          type_name: res.data.type,
          inputContent: res.data.content,
        })
      }
    });
  },
  sendInfo: function () {
    var _this = this;
    wx.navigateBack({
        delta: 1
    })
  },
  // 初始化信息
  initData: function () {
    var _this = this;
    wx.request({
      url: '',
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function ({ data }) {

      }
    })
  }

})