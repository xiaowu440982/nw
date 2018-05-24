const { api, config, path } = require('../../utils/config.js');

// directory.js
var address = require('../../utils/city.js')
var animation
var app = getApp();
Page({

  /**
   * 页面的初始数据
   * 当前    provinces:所有省份
   * citys选择省对应的所有市,
   * areas选择市对应的所有区
   * provinces：当前被选中的省
   * city当前被选中的市
   * areas当前被选中的区
   */
  data: {
    initData: {
      departmentArray: [],   // 所属供电局的值
      myGift: [],
    },
  	// 礼品
    prize:[],
  	hasIntegral:567,
  	exchangeBtnClass: 'ban-btn',


  	// 填写信息
  	isShowPopup: false,  // 是否显示填写信息弹窗
    isShowNoneGiftPopup: false,  // 是否显示没有奖品弹窗
    isShowGiftPopup: false,   // 是否显示我的奖品弹窗
  	areaInfoColor: 'rgba(255, 255, 255, 0.5)',  // 省市区选择框文字颜色
  	areaName: '省 市 区',
    departmentIndex: null,  // 选择所属供电局的下标
    //departmentArray: ['供电局1', '供电局2'],   // 所属供电局的值
    inputP: '',   // 省
    inputC: '',   // 市
    inputA: '',   // 区
    inputName: '',
    inputPhone: '',
    inputAddress: '',
    isCanSubmit: true,  // 防止重复提交 

    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    prizeArray: [],
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    });
    //请求后台获取礼品
    var _this = this;
    wx.request({
      url: config.route + api.getPrize,
      data: {
        token: config.token
      },
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          hasIntegral: app.globalData.sore,
          prizeArray: res.data.prize,
          initData:{
            departmentArray: res.data.gdj
          }
        })
      }
    });
    
  },

 /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var _this = this;
    // _this.showExchangeBtn(); 
    // app.getUserInfo(function() {
    //   _this.initData();
    // })
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    _this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    _this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },


	/**
	* 页面代码
	*/

	// 是否禁止兑换按钮
	showExchangeBtn: function() {  
		var _this = this;
		var exchangeBtnClass = _this.data.hasIntegral >= _this.data.needIntegral ? 
													'btn' : 'ban-btn';
		_this.setData({ exchangeBtnClass: exchangeBtnClass });
	},

  urls: function() {
    var _this = this;
    // console.log(this);
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/desc/desc"
    })
  },

	showPopup: function(e) {
		var _this = this;
    var id = e.target.dataset.id;//奖品id
    var needIntegral = e.target.dataset.need;//兑换积分
    if (_this.data.hasIntegral < needIntegral) return;
    
    //点击兑换 请求后台记录
    //查看是否填写信息
    wx.request({
      url: config.route + api.getUser,
      data: {
        user_id: app.globalData.user_id,
        pid:id,
        token: config.token
      },
      success: function (res) {
        //改变积分
        _this.setData({ hasIntegral: res.data.mysore });
        //提示
        wx.showModal({
          title: '温馨提示',
          content: '兑换完成！',
          showCancel:false,
          success: function (re) {
            if (re.confirm) {
              if (res.data.code == 1) {
                //已填写信息
                return false;
              } else {
                _this.setData({ isShowPopup: true });
              }
            } 
          }
        });
      }
    });
	},

  sendInfo: function() {
    var _this = this;

    if (!_this.data.isCanSubmit) return;
    var departmentIndex=_this.data.departmentIndex;  
   
    var postData = {
      name: _this.data.inputName.replace(/\s/g,""),
      phone: _this.data.inputPhone.replace(/\s/g,""),
      address: _this.data.inputAddress,
      prov: _this.data.inputP,
      country: _this.data.inputC,
      area: _this.data.inputA,
      from2: _this.data.initData.departmentArray[departmentIndex]
    }

    var title;
    if (!postData.name) {
      _this.showToast('请输入真实姓名');
      return;
    } else if (postData.phone.length !== 11) {
      _this.showToast('请输入联系手机号码');
      return;
    } else if (!postData.address) {
      _this.showToast('请输入具体的街道地址');
      return;
    } else if (!departmentIndex) {
      _this.showToast('请选择所属供电局');
      return;
    }

    wx.showLoading({
      title: '提交中',
    })
    // 提交信息接口 提交个人信息
    console.log('postData', postData);
    wx.request({
      url: config.route + api.addUser,
      data: {
        user_info: postData,
        user_id: app.globalData.user_id,
        token: config.token,
        // 供电局data: _this.data.initData.departmentArray[departmentIndex]
      },
      complete:function(){
        wx.hideLoading();
      },
      success: function (res) {
        if (res.data.code == 1) {
          //提交成功
          _this.showToast('登记成功');
          
        } else {
          //提交失败
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
      success:function(){
        wx.navigateBack({
          delta: 4
        })
      }
    })
  },

  // 供电局选择
  departmentChange: function(e) {
    this.setData({
      departmentIndex: e.detail.value
    })
  },

  // 关闭弹窗
  closePopup: function() {
    this.setData({ 
      isShowNoneGiftPopup: false,
      isShowGiftPopup: false
    })
  },

  // 显示我的奖品
  showGift: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    //我的奖品
    wx.request({
      url: config.route + api.myGift,
      data: {
        user_id: app.globalData.user_id,
        token: config.token
      },
      success: function (res) {

        wx.hideLoading();
      
        _this.setData({ 
          initData:{
            myGift: res.data.result
          }
        });
      
        if (_this.data.initData.myGift.length > 0) {
          _this.setData({ isShowGiftPopup: true })
        } else {
          _this.setData({ isShowNoneGiftPopup: true })
        }
      }
    });

  },


	/**
	* 城市三级联动代码
	*/

  bindPickerChange: function(e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },

  // 显示
  showMenuTap: function (e) {
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var _this = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
  },
  // 选择状态按钮
  selectState: function (e) {
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })

  },
  // 日志选择
  bindDateChange: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function () {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
  },
  
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var _this = this
    if (_this.data.addressMenuIsShow) {
      return
    }
    _this.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var _this = this
    if (isShow) {
      _this.animation.translateY(0 + 'vh').step()
    } else {
      _this.animation.translateY(40 + 'vh').step()
    }
    _this.setData({
      animationAddressMenu: _this.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var _this = this
    var city = _this.data.city
    var value = _this.data.value
    _this.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = {
      p: _this.data.provinces[value[0]].name,
      c: _this.data.citys[value[1]].name,
      a: _this.data.areas[value[2]].name
    }
    _this.setData({
      areaInfo: areaInfo,
      inputP: _this.data.provinces[value[0]].name,
      inputC: _this.data.citys[value[1]].name,
      inputA: _this.data.areas[value[2]].name,
      areaName: _this.data.provinces[value[0]].name + ' ' + _this.data.citys[value[1]].name + ' ' + _this.data.areas[value[2]].name,
      areaInfoColor: '#fff'
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },

  //复制input中的地址
  copyAddress: function (e) {
    var _this = this;
    _this.setData({
      address: e.detail.value
    })
  },

  // post表单信息
  postUserData: function() {
    var _this = this;
   
    wx.request({
      url: '',
      method: 'POST',
      data: {
      },
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function(res) {
        
      }
    })
  },

  // 获取表单信息
  getInputVal: function(e) {
    var _this = this;
    var name = '', adress = '', phone = '';
    if (e.target.dataset.type === 'name') {
      _this.setData({
        inputName: e.detail.value,
      })
    };
    if (e.target.dataset.type === 'phone') {
      _this.setData({
        inputPhone: e.detail.value,
      })
    };
    if (e.target.dataset.type === 'address') {
      _this.setData({
        inputAddress: e.detail.value,
      })
    };
  },

  // 初始化信息
  initData: function() {
    var _this = this;
    wx.request({
      url: '',
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function({data}) {
        
      }
    })
  }
 
})