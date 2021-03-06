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
        console.log('领券界面');
        watchshake.setdefalutss(login.getInitData().defalutss);
       
        that.refresh();
      },
      fail:function(){
        my.navigateBack({
          delta: 1
        });
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
    my.stopPullDownRefresh()
    var that=this;
     //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('领券界面');
        watchshake.setdefalutss(login.getInitData().defalutss);
       
        that.refresh();
      },
      fail:function(){
       
      }
    });
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
        console.log(JSON.stringify(res))
       
        if (methods.receiveCode(res)) {
          
          that.setData({
              userInfo: login.getSession().userInfo,
              hongbaoDetail: res.data.data
          })
          if (that.data.hongbaoDetail.type == 1 && that.data.hongbaoDetail.hadSend == 0){
              that.startMove()
            }
          if(that.data.hongbaoDetail.is_public==1){
            methods.getBalance(
            { 
              
              success:function(balanceInfo){
              console.log('test');
              that.setData({
                yaoyaodou: app.globalData.balanceInfo.yaoyaodou
                })
              }
            });
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
        that.data.userHongbao.token = login.getSession().session.token
        //此处领红包
        my.httpRequest({
          url: config.hongbaoGetUrl,
          data: that.data.userHongbao,
          success: function (res) {
            console.log(res)
            if (methods.receiveCode(res)) {

              console.log(JSON.stringify(res))
              my.showToast({
                title: '提示',
                content: '您领取了'+res.data.data.money,
                duration: 1000,
              })
              console.log("开始震动了");
              //提示领取成功
               my.vibrate({
                  success: () => {
                    Console.log("震动了1");
                   
                  }
                });
                my.vibrate({
                  success: () => {
                    Console.log("震动了2");
                   
                  }
               });
            }
            //显示领取多少红包
            that.refresh()
          }
          ,
          fail: function (res) {
            
          }
        })
    }
  },
  //开始摇手机
  startMove: function () {
    

    console.log("ShareStart");
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
        watchshake.stopMove();
        that.getHongbao();

      }
    })
  },
  againSend:function(){
   
    var that=this
    
    var url='../../yaoyao/yaoyao'
    if (that.data.hongbaoDetail.type == 1){
      url ='../../yaoyao/yaoyao'
    }
    if (that.data.hongbaoDetail.type == 2) {
      url = '../../kouling/kouling'
    }
    if (that.data.hongbaoDetail.type == 3) {
      url = '../../qingting/qingting'
    }
    console.log(url)
    my.navigateTo({
      url: url,
      fail:function(msg){
        console.log(msg)
      }
    })
  },
  toIndex:function(){
     my.navigateTo({
       url: '../../index/index',
     })
  },
  toShare:function(){
     my.navigateTo({
       url: 'ShareHotMoney?id=' + this.data.hongbaoID,
     })
    
  },
  gotoMine:function(){
    my.navigateTo({
      url: '../../mine/mine',
    })
  }
})
