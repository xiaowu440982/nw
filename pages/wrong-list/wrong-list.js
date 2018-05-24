const { api, config, path } = require('../../utils/config.js');
const { changeNum } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    initData: [],  //试题套数列表
    examData: [],  // 处理过的数据
    type_id: '',       // 题库类型
    title: '',       //题型标题   
    hasIntegral: '',       //个人积分
  },
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      type_id: options.type_id,
      title: options.title,
      hasIntegral: app.globalData.sore
    })
    // 接口拿数据
    // 放入initData中
    // 再执行_this.initExamData();
    //_this.initExamData();


    //请求后台获取错题套数
    wx.request({
      url: config.route + api.wrongNumber,
      data: {
        type_id: options.type_id,
        user_id: app.globalData.user_id,
        token: config.token
      },
      success: function (res) {
        if(res.data == 0){
          wx.showToast({
            title: '您没有错题',
            icon: 'none',
            duration: 1500
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1600)
        }else{
          _this.setData({
            initData: res.data,
          })
        }
      }
    });
  },

  // 初始化试题
  initExamData: function () {
    var _this = this;
    var examData = [];
    for (var i = 0, len = _this.data.initData.length; i < len; i++) {
      var attr = {
        isExpand: false,  // 是否展开
        examNum: '',      // 试题序号
        difficulty: _this.data.initData[i].difficulty,  //难度
        examIconClass: 'expand',  // icon样式
        examType: '',      // 选中的试题类型
        examId: 0,        // 试题id
      }

      attr.examNum = '试题' + changeNum(i);
      examData.push(attr);
    }
    _this.setData({ examData: examData });
  },


  // 去到答题页
  toQuestionPage: function (e) {
    var type_id = e.currentTarget.dataset.type;
    var number_id = e.currentTarget.dataset.number;
    console.log(number_id);
    wx.navigateTo({
      url: path.wrongQuestionPage + '?type_id=' + type_id + '&number_id=' + number_id
    })
  }
})
