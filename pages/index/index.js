var app = getApp();
import config from '../../config'
import login from '../../utils/login.js'
// pages/square/square.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     receivedHongbao: {},//接受的红包信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //this.onRefresh();  
    console.log('红包广场界面');
    that.refresh();
  },
  onRefresh:function(){
    my.getAuthCode({
      scopes: 'auth_base',
      success: function (result) {
       console.log(JSON.stringify(result))
        //检查登录状态
       login.checkSession({
          success: function (userInfo) {
            console.log('红包广场界面');
            console.log(userInfo);
            that.refresh();
          }
        });
      },
      fail:function(result){
        console.log(JSON.stringify(result))
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
    my.showLoading({
      content: '加载中...',

    });
    setTimeout(() => {
      my.hideLoading();
    }, 1000);
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
    my.httpRequest({
      url: config.publicHongbaoUrl,
      data: {
        page: that.data.receivedHongbao.page + 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.code <100 && res.data.data.list.length > 0) {

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
  },
  tomine:function(){
    my.navigateTo({
      url: '/pages/mine/mine',
    })
  },
  toyaoyao:function(){
    my.navigateTo({
      url: '/pages/yaoyao/yaoyao',
    })
  }
})