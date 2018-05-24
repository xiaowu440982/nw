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
	/*** 跳转页面到题库列表
	 *   参数type：
	 *   0 word
	 *   1 ppt
	 *   2 excel
	 *   3 cad
	 ***/
  toTopicListPage: function(e) {
    var _this = this;
    var id = e.target.dataset.id;
    var title = e.target.dataset.title;
    //查看是否答过题
    wx.request({
      url: config.route + api.record,
      data: {
        user_id: app.globalData.user_id,
        type_id:id,
        token: config.token
      },
      success: function (res) {
        if(res.data.code == 1){
          _this.showToast(res.data.msg);
          return false;
        }else{
          wx.navigateTo({
            url: path.topicListPage + '?type_id=' + id + '&title=' + title
          })
        }
      }
    });
    
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500
    })
  },
 
})
