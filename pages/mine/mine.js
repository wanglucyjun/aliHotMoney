// pages/mine/mine.js
var app = getApp();
import config from '../../config'
import login from '../../utils/login.js';
import methods from '../../utils/methods.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userHongbao:{},//用户红包信息
    sendedHongbao:{},//发送的红包信息
    receivedHongbao:{},//接受的红包信息
    drawlist:{},//提现记录
    mineRecod:1,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('发送摇摇包界面');
        console.log(userInfo);
        that.refresh();
      },
      fail:function(){
        my.navigateBack({
          delta: 1
        });
      }
    });
  },
  // tab 切换函数
  changeTab: function (e) {
    var that = this;
    that.setData({
      mineRecod: e.currentTarget.dataset.num
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
    if (this.data.mineRecod==1){
      this.getSendedHongbao();
      this.setData({
              page: this.data.sendedHongbao.page+1
    });
    } else if (this.data.mineRecod == 2){
      this.getReceivedHongbao();
      this.setData({
              page: this.data.receivedHongbao.page+1
    });
    }
    else if (this.data.mineRecod == 3) {
      this.getDrawlist();
      this.setData({
              page: this.data.drawlist.page+1
    });
    }
    
  },
  getDrawlist: function () {
    var that = this;
    console.log(that.data.drawlist)
    my.httpRequest({
      url: config.drawListUrl,
      data: {
        token: login.getSession().session.token,
        page: that.data.drawlist.page + 1
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        var result=methods.receiveCode(res)
        if(result=false){
          return 
        }
        if (res.data.data && res.data.data.list.length >= 0) {
          that.data.drawlist.page = that.data.drawlist.page + 1
          if (that.data.drawlist.page == 1) {
            //res.data.data.page = that.data.sendedHongbao.page + 1
            that.setData({
              drawlist: res.data.data
            })
          } else {
            var list = that.data.drawlist.list
            console.log(that.data.drawlist)
            that.data.drawlist.list = list.concat(res.data.data.list)

            that.setData({
              drawlist: that.data.drawlist
            })
          }
        }

      }
      ,
      fail: function (res) {
        methods.serverError
      }
    })
  },
  getReceivedHongbao:function(){
    var that = this;
    console.log(that.data.receivedHongbao.page)
    my.httpRequest({
      url: config.hongbaoReceivedUrl,
      data: {
        token: login.getSession().session.token,
        page: that.data.receivedHongbao.page + 1
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        methods.receiveCode(res)
        if (res.data.data && res.data.data.list.length >=0) {

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
        methods.serverError(res)

      }
    })
  },
  getSendedHongbao: function() {
    var that = this;
    my.httpRequest({
      url: config.hongbaoSendedUrl,
      data: {
        token: login.getSession().session.token,
        page: that.data.sendedHongbao.page + 1
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        methods.receiveCode(res)
        if (res.data.data && res.data.data.list.length>=0){
          
          that.data.sendedHongbao.page = that.data.sendedHongbao.page+1
          if (that.data.sendedHongbao.page==1){
            //res.data.data.page = that.data.sendedHongbao.page + 1
            that.setData({
              sendedHongbao: res.data.data
            })
          }else{
            var list= that.data.sendedHongbao.list
            console.log(that.data.sendedHongbao)
            that.data.sendedHongbao.list=list.concat(res.data.data.list)
            
            that.setData({
              sendedHongbao: that.data.sendedHongbao
            })
          }
        }
      }
      ,
      fail: function (res) {
          methods.serverError(res)
      }
    })
  },
  refresh:function(){
    var that = this;
    app.getBalance()
    that.setData({
      userInfo: login.getSession().userInfo,
      userHongbao: app.globalData.balanceInfo,
    })
    that.data.sendedHongbao.page=0
    console.log("that.data.receivedHongbao.page")
    that.data.receivedHongbao.page=0
    that.data.drawlist.page = 0
    
    console.log(that.data.receivedHongbao.page)
    this.getReceivedHongbao()
    this.getSendedHongbao()
    this.getDrawlist()
  },
  toShare:function(obj){
    var that = this
    //var filePath = obj.currentTarget.id
    console.log(obj)
    console.log(obj.currentTarget.dataset.hongbaoid)
    my.navigateTo({
      url: '/pages/index/Share/Share?id=' + obj.currentTarget.dataset.hongbaoid,
    })
  },
  /**
   * 提现交互
   */
  getMoney:function(){
    my.navigateTo({
      url: 'draw/draw',
    })
  },
  showHelp:function(){
    my.navigateTo({
      url: 'help/help',
    })
  }
})