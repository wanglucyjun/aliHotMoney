var app = getApp();
import config from '../../config'
import login from '../../utils/login.js'
// pages/square/square.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userHongbao: {},//用户红包信息
    receivedHongbao: {},//接受的红包信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('红包广场界面');
        console.log(userInfo);
        that.refresh();
      }
    });
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    this.refresh()
    my.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
    this.getReceivedHongbao();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getReceivedHongbao: function () {
    var that = this;
    console.log(that.data.receivedHongbao.page)
    my.httprequest({
      url: config.publicHongbaoUrl,
      data: {
        token: login.getSession().session.token,
        page: that.data.receivedHongbao.page + 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.data && res.data.data.list.length > 0) {

          that.data.receivedHongbao.page = that.data.receivedHongbao.page + 1
          if (that.data.receivedHongbao.page == 1) {
            //res.data.data.page = that.data.sendedHongbao.page + 1
            that.setData({
              receivedHongbao: res.data.data
            })
          } else {
            var list = that.data.receivedHongbao.list
            console.log(that.data.receivedHongbao)
            that.data.receivedHongbao.list = list.concat(res.data.data.list)

            that.setData({
              receivedHongbao: that.data.receivedHongbao
            })
          }
        }

      }
      ,
      fail: function (res) {

      }
    })
  },
  refresh: function () {
    var that = this;
    app.getBalance()
    console.log(app.globalData.balanceInfo)
    that.setData({
      userHongbao: app.globalData.balanceInfo,
    })
    console.log("that.data.receivedHongbao.page")
    that.data.receivedHongbao.page = 0
    console.log(that.data.receivedHongbao.page)
    this.getReceivedHongbao()
  },
  toShare: function (obj) {
    var that = this
    //var filePath = obj.currentTarget.id
    console.log(obj)
    console.log(obj.currentTarget.dataset.hongbaoid)
    my.navigateTo({
      url: '/pages/index/Share/Share?id=' + obj.currentTarget.dataset.hongbaoid,
    })
  },
  openOther:function(obj){
    if (obj.currentTarget.dataset.appid){
      my.navigateToMiniProgram({
        appId: obj.currentTarget.dataset.appid,
        success(res) {
          // 打开成功
        }
      })
    }
  }
})