// pages/index/Share/ShareHotMoney.js
var app = getApp();
import methods from '../../../utils/methods.js'
import accelerometer from '../../../utils/accelerometer.js'
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
    accelerometer.stopMove()
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  refresh:function(){
    console.log('refresh')
    var that = this;
    accelerometer.stopMove()
    wx.request({
      url: config.hongbaoDetailUrl,
      data: {
        id: that.data.hongbaoID,
        token: login.getSession().session.token
      },
      success: function (res) {
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
  startRecord: function () {
    var that = this
    console.log("stat record");

    this.setData({
      isspeaking: true,
      recordTime: 0
    })
    //读秒记时
    recordTimeInterval = setInterval(function () {
      var recordTime = that.data.recordTime += 1
      that.setData({
        recordTime: recordTime
      })
    }, 1000)
//先去check权限
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              that.speaking();
                 wx.startRecord({
                     success: function (res) {
                    that.data.userHongbao.file = res.tempFilePath
                     console.log(that.data.userHongbao.file);
                      that.data.userHongbao.text=''

                     methods.uploadFile({
                     filePath: that.data.userHongbao.file, success: function (file) {
                     that.data.userHongbao.file = file
                      that.getHongbao()
                   }
                 })
                 },
                     complete: function () {
                       clearInterval(recordTimeInterval)
                     }
                 })
             },
            fail() {
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
            },
          })
        }
        else{
          that.speaking();
          wx.startRecord({
            success: function (res) {
              that.data.userHongbao.file = res.tempFilePath
              console.log(that.data.userHongbao.file);
              that.data.userHongbao.text = ''

              methods.uploadFile({
                filePath: that.data.userHongbao.file, success: function (file) {
                  that.data.userHongbao.file = file
                  that.getHongbao()
                }
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
  stopRecord: function () {
    var that = this
     console.log("stop record");
     setTimeout(function () {
     wx.stopRecord({
      success: function (res) {
        console.log(that.data.userHongbao.file);
      },
      complete: function () {
        clearInterval(recordTimeInterval)
      }
    })
     }, 500)
     that.setData({
       isspeaking: false,
     })
     that.data.userHongbao.voiceLength=that.data.recordTime;
     console.log("now the time is " + that.data.recordTime)
  },
  //麦克风帧动画 
  speaking: function () {
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

  getHongbao:function(){
    console.log("getHongbao");
    var that = this
    if (that.data.hongbaoDetail.state == 1 && that.data.hongbaoDetail.hadSend == 0) {
      login.checkSession({
      success: function () {
        that.data.userHongbao.token = login.getSession().session.token
        //此处领红包
        wx.request({
          url: config.hongbaoGetUrl,
          data: that.data.userHongbao,
          success: function (res) {
            console.log(res)
            if(res.data.code==0){
              wx.showModal({
                title: '提示',
                content: '您领取了'+res.data.data.money
              })
              methods.getSound('kai1')
            }else{
              wx.showModal({
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

  playVoice: function (obj) {
    var that = this
    //var filePath = obj.currentTarget.id
    console.log(obj)
    console.log(obj.currentTarget.dataset.url)
    var filePath = map.get(obj.currentTarget.dataset.url)
    if (filePath){
      wx.playVoice({
        filePath: filePath,
        complete: function () {
          if (that.data.hongbaoDetail.type == 3 
          && that.data.hongbaoDetail.state == 1
          &&that.data.hongbaoDetail.hadSend==0) {
            that.data.userHongbao.file = ''
            that.data.userHongbao.text = ''
            that.getHongbao()
          }
        }
      })
    }else{
      wx.downloadFile({
        url: obj.currentTarget.dataset.url, //仅为示例，并非真实的资源
        success: function (res) {
          console.log(res.tempFilePath);
          map.set(obj.currentTarget.dataset.url, res.tempFilePath);
          wx.playVoice({
            filePath: res.tempFilePath,
            complete: function () {
              if (that.data.hongbaoDetail.type == 3 && that.data.hongbaoDetail.state == 1 && that.data.hongbaoDetail.hadSend == 0) {
                that.data.userHongbao.file = ''
                that.data.userHongbao.text = ''
                that.getHongbao()
              }
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
    accelerometer.startMove(function (sum) {
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
    
    var url=''
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
    wx.switchTab({
      url: url,
      fail:function(msg){
        console.log(msg)
      }
    })
  },
  toShare:function(){
     wx.navigateTo({
       url: 'ShareHotMoney?id=' + this.data.hongbaoID,
     })
    
  },
  gotoMine:function(){
    wx.switchTab({
      url: '../../mine/mine',
    })
  }
})
