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
      url: config.route + api.testTypeError,
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
	/*** 跳转页面到题库列表
	 *   参数type：
	 *   0 word
	 *   1 ppt
	 *   2 excel
	 *   3 cad
	 ***/
  toTopicListPage: function(e) {
    var id = e.target.dataset.id;
    var title = e.target.dataset.title;
    wx.navigateTo({
      url: path.wrongListPage + '?type_id=' + id + '&title=' + title
    })
  }
})
