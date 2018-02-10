//index.js
//获取应用实例
const app = getApp()
var recordTimeInterval
import methods from '../../utils/methods.js'
import login from '../../utils/login.js'
Page({
  data: {
    houBaoStyle:1,
    userInfo:[],
    hbType: [],
    shuoming: '小伙伴们听完你说的话就能领取赏金',
    ispublic:0,
    Money:'',
    zhifu:'',
    balance:'0.0',
    Number:'',
    fuwufee:'0.0',
    hasRecord:false,
    recording:false,
    filePath:'',
    tempFilePath:'',
    rate:0.01,
    minVal:0.01,
    tips:'录音你想说的内容',
    serverFilePath:'',
    j: 1,//帧动画初始图片 
    recordTime: 0,
    advancedSetting: false,
    shareWords: '不服来战',
    items: [
      { name: '0', value: '均分' },
      { name: '1', value: '随机', checked: 'true' },
      { name: '2', value: '先到多得'},
    ],
    moneyType: '1'
  },
  
  //事件处理函数
  onLoad: function () {
    var that = this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('发送倾听包界面');
        console.log(userInfo);
        app.getBalance();
        that.refresh();
      }
    });

  },
  refresh:function(){
    var that = this;
    var tipArray = methods.getModel(2).tips;
    console.log("tips length " + tipArray.length)
    Math.random() * (tipArray.length - 1)
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
    console.log("random " + num)
    that.setData({
      tips: tipArray[num],
      userInfo: login.getSession().userInfo,
      balanceInfo: app.globalData.balanceInfo,
    })

  },
  // 跳转链接

  tomyRecord:function(){
    var that = this;
    wx.navigateTo({
      url: './mRecord/myRecord',
    })

  },
  // 获取页面填入的值
  koulingInput:function(e){
    var that = this;
    console.log(e.detail.value)
    that.setData({
      kouling:e.detail.value,
    })
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
    })
    console.log("acountbalance is " + app.globalData.balanceInfo.allMoney)
    console.log("now money is " + that.data.Money)
    var sendfee = methods.getSendFee(2, that.data.Money)
    console.log(sendfee)
    var chargefee = methods.getChargeFee(2, (that.data.Money - app.globalData.balanceInfo.allMoney))
    if (chargefee < 0) {
      chargefee = 0
    }
   
    console.log("chargefee is " + chargefee)
    var fee = (sendfee + chargefee).toFixed(2);
    var balance = that.data.Money*1 + fee*1
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

  toShare:function(e) {
    var that = this;
    console.log(e.detail.value)
    if(this.data.Money==''){
    
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

    else if(this.data.Number==''){
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
    else{
      console.log(that.data.tempFilePath)

      methods.uploadFile({filePath:that.data.tempFilePath,success:function(obj){
        var value = obj
        //console.log()
        console.log("server file path is " + value)
        methods.hongbaoCreate(3, '', '', that.data.Money, that.data.Number, that.data.fuwufee, value, that.data.recordTime, that.data.moneyType,that.data.ispublic)
      }})



    console.log(e.detail.value);
  }
  },

  startRecord:function(){
    var that = this
    console.log("stat record");
    this.setData({
      recording:true,
      recordTime:0
    })
    console.log(this.data.recording);
    //读秒记时
    recordTimeInterval = setInterval(function () {
      var recordTime = that.data.recordTime += 1
      that.setData({
        recordTime: recordTime
      })
    }, 1000)
   //先去check是否有权限
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              that.speaking();
              wx.startRecord({
                success: function (res) {
                  that.setData({
                    tempFilePath: res.tempFilePath
                  })
                },
                complete: function () {
                  clearInterval(recordTimeInterval)
                }
              })
            },
            fail(){
                wx.showModal({
                  title: '申请权限',
                  content: '需要开通录音权限哦',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      wx.openSetting({
                        
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      wx.showToast({
                        title: '需要开通权限哦',
                      })
                    }
                  }
                })
               
            }
          })
        }
        else{
          that.speaking();
        wx.startRecord({
         success: function (res) {
            that.setData({
            tempFilePath:res.tempFilePath
             })
           },
            complete: function () {
           clearInterval(recordTimeInterval)
         }
         })
        }
      }
    })


  },
 stopRecord:function(){
     var that=this
     console.log("recording is"+that.data.recording)
     setTimeout(function(){
     wx.stopRecord({
        success:function(){
        console.log("stop record")
      }
     })
 
     }, 500)
     console.log('stop record success')
     clearInterval(recordTimeInterval)
    that.setData({
      hasRecord:true,
      recording: false
    })
    console.log("now the time is " + that.data.recordTime)
 },

  playVoice: function () {
   var that = this
    var filePath=that.data.tempFilePath
   console.log(filePath);
   wx.playVoice({
     filePath: filePath,
   })
  },
  //麦克风帧动画 
  speaking:function() {
    var _this = this;
    //话筒帧动画 
    var i = 1;
    this.timer = setInterval(function () {
      i++;
      i = i % 5;
      _this.setData({
        j: i
      })
    }, 300);
  },
  clicksetting: function (e) {
    var that = this
    console.log("switch is " + e.detail.value)
    if (e.detail.value == true) {
      that.setData({
        advancedSetting: true
      })
    }
    else {
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
      url: '/pages/index/Share/Share?id=347',
    })
  },
  clickhelp: function () {
    wx.navigateTo({
      url: '../mine/help/help',
    })
  }

})
