//index.js
//获取应用实例
const app = getApp();
import methods from '../../utils/methods.js';
import watchshake from '../../utils/watchshake.js';
import login from '../../utils/login.js';
Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming: '小伙伴们摇摇超过武力值领健身券',
    powerset:'60',
    ispublic: 0,
    Money: '',
    zhifu: '',
    balance: '0.0',
    Number: '',
    fuwufee: '0.0',
    moving: false,
    power:0,
    rate:2,
    //balanceInfo: {},
    accountBalance:'',
    advancedSetting: false,
    shareWords:'新年快乐大吉大利',
    items: [
      { name: '1', value: '均分' },
      { name: '2', value: '随机', checked: 'true' },
      { name: '3', value: '后到多得' },
    ],
    moneyType:'1'
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    console.log("onShow");
    var that=this;
    that.setData({
      moving:true
    });
    that.startMove();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      moving: false
    });
    watchshake.stopMove();
    
  },
  //事件处理函数
  onLoad: function () {
    var that=this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('发送摇摇券界面');
        watchshake.setdefalutss(login.getInitData().defalutss);
        methods.getBalance(
        { 
          success:function(balanceInfo){
          that.refresh();}
        });
      },
      fail:function(){
        my.navigateBack({
          delta: 1
        });
      }
    });
  },
  refresh:function(){
    console.log("刷新")
    console.log(app.globalData);
    var that = this;
    var tipArray = methods.getModel(0).tips;
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
     that.setData({
      tips: tipArray[num],
      userInfo: login.getSession().userInfo,
      balanceInfo: app.globalData.balanceInfo,
    })
  },
  startMove: function () {
    var that=this;
    console.log("startMove")
    watchshake.startMove(function(sum){
        console.log("sum");
        console.log(sum);
        that.setData({
          power: sum.toFixed(2),
          powerset:sum.toFixed(2)
      });
    });
  },
  // 获取页面填入的值
  powerInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      powerset: e.detail.value,
    })
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
    })
    console.log(app.globalData.balanceInfo)
    console.log("acountbalance is " + app.globalData.balanceInfo.allMoney)
    console.log("now money is "+that.data.Money)
    var sendfee = methods.getSendFee(0, that.data.Money)
    console.log(sendfee)
    var chargefee = methods.getChargeFee(0, (that.data.Money - app.globalData.balanceInfo.allMoney))
    if(chargefee<0){
      chargefee=0
    }
    console.log("chargefee is "+chargefee)
    var fee = (sendfee + chargefee).toFixed(2);
    var balance = (that.data.Money * 1 + fee * 1).toFixed(2);
    if (balance > app.globalData.balanceInfo.allMoney) {
      balance = app.globalData.balanceInfo.allMoney
    }
    that.setData({
      fuwufee: fee,
      balance: balance,
      zhifu: that.data.Money + fee - balance
    })
    console.log("now fuwufee is"+that.data.fuwufee)
  },
  NumberInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Number: e.detail.value,
    })
  },

  toShare:function(e) {
    var that = this;
    //console.log(e.detail.value)
    if(this.data.Money==''){

      my.alert({
        title: '提示',
        content: '请先输入购买的券值',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

    else if(this.data.Number==''){
      my.alert({
        title: '提示',
        content: '请输入可领的次数',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else if(this.data.Number>this.data.Money*100){
      my.alert({
        title: '提示',
        content: '每人领取的券值不能小于0.01',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
     //停止监听武力值
     // my.stopAccelerometer({})
      watchshake.stopMove();
      var tipArray = methods.getModel(0).tips;
      var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
      var title = tipArray[num]
      methods.hongbaoCreate(1, '', that.data.powerset, that.data.Money, that.data.Number, that.data.fuwufee, '', '', that.data.moneyType, that.data.ispublic,title)
      console.log(e.detail.value);
    }
  },
  clicksetting: function (e) {
    var that = this
    console.log("switch is " + e.detail.value)
    if (e.detail.value == true) {
      that.setData({
        advancedSetting: true
      })
    }
    else {
      that.setData({
        advancedSetting: false
      })
    }

  },
  clickpublic: function (e) {
    var that = this
    console.log("switch is " + e.detail.value)
    that.data.ispublic = e.detail.value?1:0;
  },
  shareInput:function(e){
    //var that = this;
    // that.setData({
    //   shareWords: e.detail.value,
    // })
    app.globalData.shareWords=e.detail.value

  },
  radioChange:function(e){
    var that=this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.setData({
      moneyType: e.detail.value
    })
  },
  clickexample:function(){
    my.navigateTo({
      url: '/pages/index/Share/Share?id=344',
    })
  },
  clickhelp:function(){
    my.navigateTo({
      url: '../mine/help/help',
    })
  }

})
