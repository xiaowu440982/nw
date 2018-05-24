const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
	data: {
		initData: [],
    isLike:true,
    we: [],
    // we: false,
	},
	onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    });
    //请求后台获取排行榜
    var _this = this;
    
    wx.request({
      url: config.route + api.score_rank,
      data: {
        token: config.token,
        user_id: app.globalData.user_id
      },
      success: function (res) {
        wx.hideLoading();
        // console.log(res.data);

        _this.setData({
          initData: res.data.rank_list,
          we: res.data.we,
        });
      }
    });
	},

  // 排行版点赞功能
  sort_click_zan: function (e) {
    //请求后台获取排行榜
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var share_id = e.currentTarget.dataset.uid;
    var rank_data=_this.data.initData;
    // rank_data[index].click=2;
    // console.log(rank_data[index]);

    _this.setData({
      initData: rank_data,
      
    });

    wx.showLoading();
    wx.request({
      url: config.route + api.share_click,
      data: {
        token: config.token,
        // share_id: _this.data.share_id,
        share_id: share_id,
        // 点赞者id
        user_id: app.globalData.user_id,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status == 1) {

          rank_data[index].click = res.data.click;
          rank_data[index].user_sum = res.data.mark;
          rank_data[index].rank = res.data.rank;
          rank_data[index].isLike = false;

          // console.log(res.data);
          _this.setData({
            initData: rank_data,
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 3000,
            success: function () {
              // wx.navigateTo({
                // url: '/pages/index/index'
              // })
            }
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
            success: function () {
              // wx.navigateTo({
                // url: '/pages/index/index'
              // })
            }
          });
        }
      }
    });
  },

  //分享排行版给朋友点赞
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // console.log('/pages/get-like/get-like?uid=' + app.globalData.user_id);
    return {
      id:22,
      title: '分享积分排行版',
      path: '/pages/get-like/get-like?uid=' + app.globalData.user_id,
      // path: '/pages/index/index?uid=' + app.globalData.user_id,
      success: function (res) {
        // 转发成功
        // console.log('/pages/get-like/get-like?uid=' + app.globalData.user_id)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
