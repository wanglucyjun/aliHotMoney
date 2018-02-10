// pages/index/Share/ShareHotMoney.js
var app = getApp();
import methods from '../../../utils/methods.js'
import watchshake from '../../../utils/watchshake.js';
import login from '../../../utils/login.js';
import config from '../../../config'
var map=new Map();
var recordTimeInterval

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userHongbao:{},
    hongbaoDetail: {},
    hongbaoID:'123',
    yaoyaodou:0,
    rate: 2,
    moving:false,
    j: 1,//帧动画初始图片 
    recordTime: 0,
    isspeaking:false
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //临时数据
    var hongbaoDetail = {}

    var userHongbao = {}
    userHongbao.id = options.id
    userHongbao.text = 0
    userHongbao.voiceLength=0
    //临时数据
    that.setData({
      userInfo: app.globalData.userInfo,
      hongbaoDetail: hongbaoDetail,
      hongbaoID: options.id,
      userHongbao: userHongbao
    })

    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('领取红包界面');
        console.log(userInfo);
        that.refresh();
      }
    });
},
  toshareChat:function(){
    
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
    console.log("onShow")
    var that = this;
    if (that.data.hongbaoDetail.type == 1 && that.data.hongbaoDetail.hadSend == 0) {
      that.startMove()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    that.setData({
      moving: false
    })
    watchshake.stopMove()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.refresh()
    my.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  refresh:function(){
    console.log('refresh')
    var that = this;
    watchshake.stopMove()
    my.httpRequest({
      url: config.hongbaoDetailUrl,
      data: {
        id: that.data.hongbaoID,
        token: login.getSession().session.token
      },
      success: function (res) {
        console.log('refreshsuccess')
        console.log(res)
       
        if (res.data.code=='0'){
          app.getBalance()
          that.setData({
            userInfo: login.getSession().userInfo,
            hongbaoDetail: res.data.data,
            yaoyaodou: app.globalData.balanceInfo.yaoyaodou
          })
          if (that.data.hongbaoDetail.type == 1 && that.data.hongbaoDetail.hadSend == 0){
            that.startMove()
          }
        }
      }
      ,
      fail: function (res) {

      }
    })
  },
  

  getHongbao:function(){
    console.log("getHongbao");
    var that = this
    if (that.data.hongbaoDetail.state == 1 && that.data.hongbaoDetail.hadSend == 0) {
      login.checkSession({
      success: function () {
        that.data.userHongbao.token = login.getSession().session.token
        //此处领红包
        my.request({
          url: config.hongbaoGetUrl,
          data: that.data.userHongbao,
          success: function (res) {
            console.log(res)
            if(res.data.code==0){
              my.showModal({
                title: '提示',
                content: '您领取了'+res.data.data.money
              })
              //提示领取成功
               my.vibrate({
                success: () => {
                
                }
              });
            }else{
              my.showModal({
                title: '提示',
                content: res.data.message
              })
            }
            //显示领取多少红包
            that.refresh()
          }
          ,
          fail: function (res) {
            
          }
        })
      }
    })
    
    }
  },
  //开始摇手机
  startMove: function () {
    var that = this
    that.setData({
      moving: true
    })
    watchshake.startMove(function (sum) {
      that.data.userHongbao.file = ''
      that.data.userHongbao.text = sum.toFixed(2)
      that.setData({
        userHongbao: that.data.userHongbao
      })
      if (sum > that.data.hongbaoDetail.content.question) {
        that.getHongbao()

      }
    })
  },
  againSend:function(){
   
    var that=this
    
    var url='../../index/index'
    if (that.data.hongbaoDetail.type == 1){
      url ='../../index/index'
    }
    if (that.data.hongbaoDetail.type == 2) {
      url = '../../kouling/kouling'
    }
    if (that.data.hongbaoDetail.type == 3) {
      url = '../../qingting/qingting'
    }
    console.log(url)
    my.switchTab({
      url: url,
      fail:function(msg){
        console.log(msg)
      }
    })
  },
  toShare:function(){
     my.navigateTo({
       url: 'ShareHotMoney?id=' + this.data.hongbaoID,
     })
    
  },
  gotoMine:function(){
    my.switchTab({
      url: '../../mine/mine',
    })
  }
})
