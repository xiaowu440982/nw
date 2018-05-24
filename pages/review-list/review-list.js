const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
	data: {
    initData:[],
    title:'',       //题型标题   
    hasIntegral: '',       //个人积分
    click_num:0,//点赞数
    status:0,
	},
	onLoad: function(options) {
		var _this = this;
    var name;
    if (options.status == 0) {
      name = '待审核题目';
    }else{
      name = '审核通过题目';
    }
		_this.setData({ 
      status: options.status,
      click_num: options.click_num,
      title:name,
    })

    //请求后台获取试题
    wx.request({
      url: config.route + api.my_test_score,
      data: {
        user_id: app.globalData.user_id,
        status: options.status,
        token: config.token
      },
      success: function (res) {
        if (res.data == 0) {
          wx.showToast({
            title: '没有'+_this.data.title,
            icon: 'none',
            duration: 1500
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1600)
        } else {
          _this.setData({
            initData: res.data,
          })
        }
      }
    });
	},

	
	// 去到答题页
  toUploadListPage: function(e) {
    var id = e.currentTarget.dataset.id; 
		wx.navigateTo({
      url: path.uploadListPage + '?id=' + id
	  })
	}
})
