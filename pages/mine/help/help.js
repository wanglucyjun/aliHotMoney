const config = require('../../../config')
// pages/mine/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      helpinfos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      wx.request({
        url: config.hongbaoHelpUrl,
        data: {
          //token: app.globalData.sessionInfo
        },
        success: function (res) {
          console.log(res)
          if (res.data.data){
          var list = res.data.data.lists
          for (var i = 0, len = list.length; i < len; ++i) {
            list[i].open = false
            list[i].id=i
          }
          res.data.data.lists=list
          that.setData({
            helpinfos: res.data.data,
          })
          }
        }
        ,
        fail: function (res) {

        }
      })
      
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
  kindToggle: function (e) {
    console.log(e)
    var id = e.currentTarget.id, list = this.data.helpinfos.lists;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.data.helpinfos.lists = list
    this.setData({
      helpinfos: this.data.helpinfos
    });
  }
 })