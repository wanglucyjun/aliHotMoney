// pages/index/Share/ShareHotMoney.js
var app = getApp();
import config from '../../../config'
import login from '../../../utils/login.js';
import methods from '../../../utils/methods.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hongbaoID: '123',
    hongbaoDetail:{},
    shareWords:'摇摇乐翻天'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    
    console.log(options);
    that.setData({
      hongbaoID: options.id,
      shareWords:app.globalData.shareWords
    })
    that.refersh()
  },
  refersh: function () {
    console.log('refersh')
    var that = this;
    my.httpRequest({
      url: config.hongbaoDetailUrl,
      data: {
        id: that.data.hongbaoID,
        token: login.getSession().session.token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          hongbaoDetail: res.data.data,
        })
      }
      ,
      fail: function (res) {

      }
    })
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var Object = []
    Object.title = methods.getShareWords(0)
    Object.desc = "新年快乐"
    Object.path = "pages/index/Share/Share?id=" + this.data.hongbaoID
    return Object
  }
})