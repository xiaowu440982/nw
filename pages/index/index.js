const { api, config, path } = require('../../utils/config.js');

//获取应用实例
const app = getApp();


Page({
  data: {
    userInfo: null,
    sore:'',
    ischeck: 0,//签到天数
    title1: '签到',
    title2: '您还没签到',
    title3: '',
    islike:false,

  },
  onShow: function () {
  
    wx.showLoading({
      title: '加载中...',
    });
    var _this = this;
    var has_open=setInterval(function(){
      if (app.globalData.user_id){
          clearInterval(has_open);
          wx.hideLoading();
          //请求后台获取个人积分
          wx.request({
            url: config.route + api.mySore,
            data: {
              user_id: app.globalData.user_id,
              token: config.token
            },
            success: function (res) {
              app.globalData.sore = res.data.score;
              var t1;
              var t2;
              var t3;
       
              _this.setData({
                ischeck: res.data.m_score.is_check,
                islike: res.data.m_score.status,
              });
              
              if (res.data.m_score.status != 0){
                var ts = (res.data.m_score.is_check + 1) * res.data.check_;
                t1 = '连续签到' + res.data.m_score.is_check + '天';
                t2 = '签到成功！获得' + (res.data.m_score.is_check * res.data.check_) + '积分';
                t3 = '明天签到可领' + ts + '积分';
                islike:1;
              }
              else{
                t1 = '签到';
                t2 = '您今天还没有签到喔';
                t3 = '';
                islike:0;
              }
              _this.setData({
                sore: res.data.score,
                title1: t1,
                title2: t2,
                title3: t3,
              });
            }
          });

        }else{
          return false;
        }
    },1000);

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  // 跳转页面到题库
  toTopicPage: function() {
    wx.navigateTo({
      url: path.topicPage
    })
  },

  // 跳转页面到活动说明页
  toDescPage: function() {
    wx.navigateTo({
      url: path.descPage
    })
  },

  // 跳转页面到礼品中心页面
  toGiftPage: function() {
    wx.navigateTo({
      url: path.giftPage
    })
  },

  // 跳转页面到上传题库页面
  toUploadPage: function() {
    wx.navigateTo({
      url: path.uploadPage
    })
  },

  // 跳转页面到审查页面
  toReviewPage: function() {
    wx.navigateTo({
      url: path.reviewPage
    })
  },

  // 跳转页面到排行页面
  toRankPage: function() {
    wx.navigateTo({
      url: path.rankPage
    })
  },

  // 跳转页面到我的错题库
  toWrongPage: function() {
    wx.navigateTo({
      url: path.wrongPage
    })
  },

  // 跳转页面到党员干部题库
  toPartyPage: function() {
    console.log('----')
    wx.navigateTo({
      url: path.partyPage
    })
  },

  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: config.share_msg,
      imageUrl: config.share_image,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 题库练习
  orderSign: function (e) {
    wx.navigateTo({
      url: path.topicPage
    })
    var fId = e.detail.formId;
   
    //查看是否答过题提交过 formId
    wx.request({
      url: config.route + api.formId,
      data: {
        user_id: app.globalData.user_id,
        token: config.token,
        fId: fId
      },
      success: function (res) {
        
      }
    });
  },
  //签到
  likeFun:function(){
    var _this = this;
    wx.request({
      url: config.route + api.sign,
      data: {
        user_id: app.globalData.user_id,
        token: config.token
      },
      success: function (res) {
        if(res.data.code==1){
          console.log(res.data);

          var day_time = res.data.day+1;
          var scored = _this.data.score + res.data.scores;
          _this.setData({
            title1: '连续签到' + res.data.day +'天',
            title2: '签到成功！获得' + res.data.scores + '积分',
            title3: '明天签到可领' + res.data.today + '积分',
            ischeck: res.data.day,
            score: scored,
            islike: true,
            sore: res.data.my_score
          });
          _this.showToast('签到成功');
        }else{
          _this.showToast(res.data.msg);
        }
      }
    });
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500,
      success: function () {

      }
    })
  },
})
