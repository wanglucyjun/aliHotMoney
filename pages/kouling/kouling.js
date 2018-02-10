//kouling.js
//获取应用实例
const app = getApp()
var methods = require('../../utils/methods.js')
var login = require('../../utils/login.js');
Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming1: '小伙伴们说对口令就能获得随机赏金',
    kouling: '',
    ispublic: 0,
    zhifu: '',
    balance: '0.0',
    Money: '',
    Number: '',
    fuwufee: '0.0',
    tips:"新的一年大吉大利",
    advancedSetting:false,
    shareWords: '不服来战',
    items: [
      { name: '0', value: '均分' },
      { name: '1', value: '随机', checked: 'true' },
      { name: '2', value: '先到多得'},
    ],
    moneyType: '1'
  },

  onLoad: function () {

    var that = this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('发送摇摇包界面');
        console.log(userInfo);
        app.getBalance();
        that.refresh();
      }
    });
    
  },
  refresh: function () {
    var that = this;
    var tipArray = methods.getModel(1).tips;
    console.log("tips length " + tipArray.length)
    Math.random() * (tipArray.length - 1)
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
    console.log("random " + num)
    that.setData({
      userInfo: login.getSession().userInfo,
      balanceInfo: app.globalData.balanceInfo,
      tips: tipArray[num],
      kouling: tipArray[num]
    })
  },
  // 跳转链接

  tomyRecord: function () {
    var that = this;
    wx.navigateTo({
      url: './mRecord/myRecord',
    })

  },
  // 获取页面填入的值
  koulingInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      kouling: e.detail.value,
    })
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
    })
    console.log("now money is" + that.data.Money)
    that.setData({
      fuwufee: methods.getSendFee(1, that.data.Money).toFixed(2),
    })

    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
    })
    console.log(app.globalData.balanceInfo)
    console.log("acountbalance is " + app.globalData.balanceInfo.allMoney)
    console.log("now money is " + that.data.Money)
    var sendfee = methods.getSendFee(1, that.data.Money)
    console.log(sendfee)
    var chargefee = methods.getChargeFee(1, (that.data.Money - app.globalData.balanceInfo.allMoney))
    if (chargefee < 0) {
      chargefee = 0
    }
    console.log("chargefee is " + chargefee)
    var fee = (sendfee + chargefee).toFixed(2);
    var balance = that.data.Money * 1 + fee * 1
    if (balance > app.globalData.balanceInfo.allMoney) {
      balance = app.globalData.balanceInfo.allMoney
    }
    that.setData({
      fuwufee: fee,
      balance: balance,
      zhifu: that.data.Money + fee - balance
    })
    console.log("now fuwufee is" + that.data.fuwufee)

  },
  NumberInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Number: e.detail.value,
    })
  },

  toShare: function (e) {
    var that = this;
    console.log(e.detail.value)
    if (this.data.Money == '') {

      wx.showModal({
        title: '提示',
        content: '请先输入金额',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

    else if (this.data.Number == '') {
      wx.showModal({
        title: '提示',
        content: '请输入红包个数',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
      console.log('fdjkdfslkj');
      if (that.data.kouling==''){
        that.data.kouling = that.data.tips
      }
      console.log(that.data.kouling);
      methods.hongbaoCreate(2, that.data.kouling, '', that.data.Money, that.data.Number, that.data.fuwufee, '', '', that.data.moneyType,that.data.ispublic)
     
    }
  },
  clicksetting:function(e){
      var that=this
      console.log("switch is "+e.detail.value)
      if(e.detail.value==true){
      that.setData({
        advancedSetting:true
      })
      }
      else{
        that.setData({
          advancedSetting: false
        })
      }

  },
  clickpublic: function (e) {
    var that = this
    console.log("switch is " + e.detail.value)
    that.data.ispublic = e.detail.value ? 1 : 0;
  },
  shareInput: function (e) {
    //var that = this;
    // that.setData({
    //   shareWords: e.detail.value,
    // })
    app.globalData.shareWords = e.detail.value

  },
  radioChange: function (e) {
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.setData({
      moneyType: e.detail.value
    })
  },
  clickexample: function () {
    wx.navigateTo({
      url: '/pages/index/Share/Share?id=346',
    })
  },
    clickhelp: function () {
    wx.navigateTo({
      url: '../mine/help/help',
    })
  }


})
