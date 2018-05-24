const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
	data: {
		initData: [],  //试题套数列表
		examData: [],  // 处理过的数据
		type_id: '',       // 题库类型
    title:'',       //题型标题   
    hasIntegral: '',       //个人积分
    test_score:0,//上传获得的积分
    test_click: 0,//上传获得的点赞数
	},
	onLoad: function() {
		var _this = this;
    //请求后台获取上传获得的积分
    wx.request({
      url: config.route + api.test_score,
      data: {
        user_id: app.globalData.user_id,
        token: config.token
      },
      success: function (res) {
        _this.setData({
          test_score: res.data.score_num,
          test_click: res.data.click_num,
        })
      }
    });
	},

	// 去到答题页
  toReviewListPage: function(e) {
    var _this = this;
    var status = e.currentTarget.dataset.status; 
		wx.navigateTo({
      url: path.reviewListPage + '?status=' + status + '&click_num=' + _this.data.test_click
	  })
	}
})
