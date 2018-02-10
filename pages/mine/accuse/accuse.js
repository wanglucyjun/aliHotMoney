var app = getApp();
import config from '../../../config'
import login from '../../../utils/login.js'
// pages/mine/accuse/accuse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.data.feedback.type=0
    if (options.id){
      this.data.feedback.ref_id = options.id;
    }
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.data.feedback.type = e.detail.value;
    this.setData({
      feedback: this.data.feedback,
    })
  }, 
  phoneInput:function(e){
    console.log('phone发生change事件，携带value值为：', e.detail.value);
    this.data.feedback.contact = e.detail.value;
  },
  contentInput: function (e) {
    console.log('desc发生change事件，携带value值为：', e.detail.value);
    this.data.feedback.desc = e.detail.value;
  },
  accuse:function(){
    var that = this;

    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        that.data.feedback.token = login.getSession().session.token
        console.log(that.data.feedback)
        wx.request({
          url: config.accuseUrl,
          data: that.data.feedback,
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '提交投诉成功！',
            });

            setTimeout(function(){wx.navigateBack();},1000);
          }
          ,
          fail: function (res) {

          }
        })
      }
    });
  }
})