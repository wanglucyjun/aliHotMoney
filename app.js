//app.js
const config = require('./config')
//var accelerometer = require('utils/accelerometer.js')
import watchshake  from '/utils/watchshake.js';
import login from '/utils/login.js'
App({
  globalData: {
    sessionInfo: '',
    needInfo:0,
    userInfo: [],
    chargeFee:[],
    sendFee:[],
    receiveFee:[],
    withdrawFee:[],
    hbType:[],
    balanceInfo:{},
    shareWords:'新年快乐大吉大利'
  },
  onLoad:function(){
    console.log("App onLoad")
  },
 
  analyzeData:function(res){
    for (var idx in that.globalData.hbType.subjects){
        var subject=hyType.subjects[idx];
        var title=subject.title;
        console.log(title)
      }
  },
  onLaunch: function () {
    var that = this
    console.log("App OnLaunch")
    login.clearSession();
    // wx.request({
    //   url:config.initUrl,
    //   success: function (res) {
    //     console.log(res.data)
    //     if(res.data.data){
    //       that.globalData.chargeFee = res.data.data.chargeFee,
    //       that.globalData.sendFee = res.data.data.sendFee,
    //       that.globalData.receiveFee = res.data.receiveFee,
    //       that.globalData.withdrawFee = res.data.data.withdrawFee,
    //       that.globalData.hbType = res.data.data.hbType
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res.data)
    //   },
    // })
    
    ////检查登录状态
    // login.checkSession({
    //   success: function (userInfo){
    //   console.log('获取用户登录态成功！')
    //   console.log(userInfo)
    // }})
    //请求成功
    //watchshake.init()
  }
})