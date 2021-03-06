const app = getApp()
import config from '../../../config'
import methods from '../../../utils/methods.js'
import login from '../../../utils/login.js'
// pages/mine/draw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userHongbao: {},
    withdrawFee: {},
    tempFilePath:'',
    drawdata:{},
    canDraw:false,
    money:'',
    actualfee: 0.00,
    drawfee: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.data.drawdata.type = 2;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('领取红包界面');
        //console.log(userInfo);
        that.refresh();
      }
    });
    
  },
  refresh: function(){
    var that = this;
    // console.log("this.data.drawdata");
    // console.log(this.data.drawdata);
    methods.getBalance(
        { 
          success:function(balanceInfo){
            that.setData({
              userInfo: login.getSession().userInfo,
              userHongbao: app.globalData.balanceInfo,
              withdrawFee: app.globalData.withdrawFee,
              drawdata: that.data.drawdata,
              money: ''
            })
          }
        });
    console.log("this.data.drawdata");
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  checkMoney:function(value){
    var that = this;
    var userHongbao = that.data.userHongbao;
    value = value*1;
    if (!userHongbao.dayCanDraw){
      my.showToast({
        content: "今日不可兑换",
      })
      return false;
    }
    if (value > userHongbao.withdrawableMoney || value > userHongbao.oneTimesLimit) {
      my.showToast({
        content: "兑换额大于可用券值",
      })
      return false;
    }
    if (value < userHongbao.minWithdrawMoney) {
      my.showToast({
        content: "兑换额太小",
      })
      return false;
    }
    return true;
  },
  MoneyInput: function (e) {
    var that = this;
    var userHongbao = that.data.userHongbao;
    console.log(e.detail.value)
    if (e.detail.value==0){
      that.setData({
        money: '',
        actualfee: 0,
        drawfee: 0,
        canDraw: false
      })
      return '';
    }
    if (!that.checkMoney(e.detail.value)){
      that.setData({
        money: '',
        actualfee: 0,
        drawfee: 0,
        canDraw: false
      })
      return '';
    }else{
      
      var drawfee = methods.getWithdrawFee(0, e.detail.value)*1
      var actualfee = e.detail.value * 1
      var fee = (actualfee + drawfee).toFixed(2);
      console.log(fee)
      if (fee > parseFloat(that.data.userHongbao.allMoney) ) {
        actualfee = that.data.userHongbao.allMoney-drawfee
      }
      actualfee = actualfee.toFixed(2);
      console.log(actualfee)
      that.setData({
        money: e.detail.value,
        actualfee: actualfee,
        drawfee: drawfee,
        canDraw:true
      })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  applyGetMoney:function(){
    var userHongbao = this.data.userHongbao;
    var drawdata = this.data.drawdata;
    var that=this;
  
    if (!that.checkMoney(that.data.money)){
      return ;
    }
    console.log(drawdata);
    drawdata.type=2

    if (userHongbao.needAccount==0){
        that.data.drawdata.content = userHongbao.account;
      }
      if (!that.data.drawdata.content||that.data.drawdata.content==""){
        my.showToast({
          content: "请输入账号！",
        })
        return;
   }
    //此处检验用户授权
    console.log('4');
    that.getMoney();
  },
  getMoney: function () {

    var that = this;
    login.checkSession({
      success: function () {
        that.data.drawdata.token = login.getSession().session.token;
        that.data.drawdata.money = that.data.money;
        
        my.httpRequest({
          url: config.hongbaoDrawUrl,
          data: that.data.drawdata,
          success: function (res) {
            console.log(res.data)
            if (methods.receiveCode(res)) {
                my.alert({
                  title: '提示',
                  content: '兑换申请成功，1～5个工作日到账',
                  buttonText: '我知道了',
                  success(){
                    setTimeout(function(){my.navigateBack();},1000);
                  }
                });
                that.refresh();
            }
         }
          ,
          fail: function (res) {
              my.showToast({
                content: '兑换失败，请稍后再试',
               
              })
          }
        })
      }
    })
  },
  accountInput:function(e){
    var that = this;
    console.log(e.detail.value)
    that.data.drawdata.content = e.detail.value;
  },
  allDraw:function(e){
    console.log(e);
    e.detail.value=this.data.userHongbao.withdrawableMoney;
    this.MoneyInput(e);
  }
})