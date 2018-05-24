const { api, config, path } = require('../../utils/config.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    explain:'',
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    });
    //请求后台获取活动说明
    var _this = this;
    wx.request({
      url: config.route + api.getExplain,
      data: {
        token: config.token
      },
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          explain: res.data
        })
      }
    });
  },
})