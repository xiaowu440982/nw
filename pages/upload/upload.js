const { api, config, path } = require('../../utils/config.js');
const app = getApp()

Page({
  data: {
    types: [],
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    });
    //请求后台获取题库类型
    var _this = this;
    wx.request({
      url: config.route + api.testType,
      data: {
        token: config.token
      },
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          types: res.data
        })
      }
    });
  },
	/*** 跳转页面
	 ***/
  toUploadDescPage: function(e) {
    var _this = this;
    var id = e.target.dataset.id;
    var title = e.target.dataset.title;
    wx.navigateTo({
      url: path.uploadDecPage + '?type_id=' + id + '&title=' + title
    }) 
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500
    })
  },
 
})
