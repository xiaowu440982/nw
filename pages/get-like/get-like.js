const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
	data: {
    myShare: [],
    share_id:0
	},
  onLoad: function (options) {
    var uid = options.uid;
    console.log(uid);
    wx.showLoading({
      title: '加载中...',
    });
     
    //请求后台获取排行榜
    var _this = this;
    var has_open = setInterval(function () {
      if (app.globalData.user_id) {
        clearInterval(has_open);
       
        wx.request({
           url: config.route + api.share,
           data: {
            token: config.token,
            // 分享者id
            user_id: options.uid,
            // user_id:'<glM',
            // user_id: '=wlM',
           },
            success: function (res) {
              wx.hideLoading();
              _this.setData({
                 myShare: res.data,
            });
            }
        });
      }else{
        return false;
      }
    },1000)
    _this.setData({
      share_id: options.uid,
    });
	},

  // 点赞功能
  click_zan: function () {
    //请求后台获取排行榜
    var _this = this;
 
    wx.showLoading();
    wx.request({
      url: config.route + api.share_click,
      data: {
        token: config.token,
        // 分享者id
        share_id: _this.data.share_id,
        // share_id: '=wlM', //用户1
        // 点赞者id
        user_id: app.globalData.user_id,

      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status == 1){
          _this.setData({
            myShare: res.data,
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 5000,
            success: function () {
              setTimeout(function(){
                wx.navigateTo({
                  url: '/pages/index/index'
                })
              },4000)
              
            }
          });
        }else{
          wx.showToast({
            title:res.data.msg,
            icon:'none',
            duration:5000,
            success:function(){
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/index/index'
                })
              }, 4000)
              // wx.navigateTo({
              //   url: '/pages/index/index'
              // })
            }
          });
        }
      }
    });
  }
})
