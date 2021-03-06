const uploadUrl = require('../config').uploadUrl
const hongbaoCreateUrl = require('../config').hongbaoCreateUrl
const userinfoUrl = require('../config').userinfoUrl
var login = require('./login');
var utils = require('./util');
const config = require('../config')
const app = getApp()


//获取返回红包类型的模版
function getModel(type) {
  var that = this
  var temdata = login.getInitData().hbType[type]
   return temdata
 
}
//费用相关,得到生成红包时返回的服务费
function getSendFee(type,money) {
  var that = this
  var tempparam = login.getInitData().sendFee[getModel(type).sendParam]

  if (tempparam.isFee == "0") {
    var fuwufee=0.0
    return fuwufee
  }
  else {
    var rate=tempparam.rate
    var fuwufee=money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    if(fuwufee < tempparam.minVal){
      fuwufee=tempparam.minVal
    }
    return fuwufee;
  }
}
//费用相关,得到充值是需要的服务费
function getChargeFee(type,money) {
  var that = this
  var tempparam = login.getInitData().chargeFee[getModel(type).chargeParam]

  if (tempparam.isFee == "0") {
    var fuwufee = 0.0
    return fuwufee
  }
  else {
    var rate = tempparam.rate
    var fuwufee = money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    return fuwufee;
  }
}
//费用相关,领取红包需要的服务费
function getReceiveFee(type, money) {
  var that = this
  var tempparam = login.getInitData().receiveFee[getModel(type).receiveParam]

  if (tempparam.isFee == "0") {
    var fuwufee = 0.0
    return fuwufee
  }
  else {
    var rate = tempparam.rate
    var fuwufee = that.data.Money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    return fuwufee;
  }
}

//费用相关,体现需要的服务费
function getWithdrawFee(type, money) {
  var that = this
  var tempparam = login.getInitData().withdrawFee[getModel(type).withdrawParam]

  if (tempparam.isFee == "0") {
    var fuwufee = 0.0
    return fuwufee
  }
  else {
    var rate = tempparam.rate
    var fuwufee = money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    return fuwufee;
  }
}
function getShareWords(type){
    var shareWords=getModel(type).title;
    console.log("share id"+shareWords)
    return shareWords
}

// 返回是否使用余额支付，初始化接口返回,0为不使用余额支付，1为使用余额支付
function get_Use_Balance(type){
    var isBalance=getModel(type).use_balance;
    return isBalance
}
//得到用户基本账号余额信息
// function getAccountInfo(){
//   wx.request({
//     url: userinfoUrl,
//     data:{
//       'token': login.getSession().session.token,
//   },
//   success:function(res){
//     console.log(res.data.data);
//     var accountMoney=res.data.data.money;
//   }
//   })
// }
//上传文件方法
function uploadFile(obj) {
  var that = this
  var serverFilePath;
  my.uploadFile({
    url: uploadUrl,
    filePath: obj.filePath,
    name: 'recordfile',
    formData: {
      'token': login.getSession().session.token
    },
    success: function (res) {
      var data = res.data
      data = JSON.parse(data);
      serverFilePath=data.data
      //console.log("upload return is " + serverFilePath)
      // wx.setStorageSync({
      //   key: "voiceTempFile",
      //   data: serverFilePath
      // })
      obj.success(serverFilePath)
      console.log("upload return is " + serverFilePath)
    }
  })
}
//下载服务器上的文件
function downloadFile(num,netUrl){
  var that = this
  //var url = that.data.NetUrl
  console.log("download url is " + netUrl)
  my.downloadFile({
    url: netUrl, 
    success: function (res) {
     // console.log("download return " + res.statusCode)
    //  console.log("download return " + res.tempFilePath)
      if (res.statusCode === 200) {
        console.log("download return " + res.tempFilePath)
        my.saveFile({
          tempFilePath: res.tempFilePath,
        success:function(res){
            var filepath=res.savedFilePath
            my.setStorageSync(num, filepath)
            console.log("download return key")
        }
        
        })
      }
     
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

    }
  })
}

//保存文件到本地
function saveFileToLocal() {
  var that = this
  my.saveFile({
    tempFilePath: that.data.tempFilePath,
    success: function (res) {
      var filePath = res.savedFilePath
      that.setData({
        filePath: filePath
      })
      console.log(filePath)
    }
  })
my.getSavedFileList({
    success: function (res) {
      console.log(res.fileList)
    }
  })

}
//声音请求
 function getSound(key) {
  const innerAudioContext = my.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = my.getStorageSync(key)
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}
//生成随机数
function getRandom(){
  var num=Math.random().toString(26).substr(2);
  console.log(num)
  return num+''
}
function makeSign(){

}
//接口返回code码处理
function receiveCode(res){
  console.log(JSON.stringify("code"+res.data.code))
  var code=res.data.code;
  if(code<100){
    return true;
  }else{
    if(code==103){
      login.login();
      return false;
    }
    my.showToast({
      content: res.data.message, // 文字内容
      success: (res) => {
        
      },
    });
    return false;
  }
}

//服务器返回500错误提示
function serverError(res){
    my.showToast({
            content: '系统繁忙，请稍后重试', // 文字内容
            success: (res) => {
              
            },
    });
}
//创建红包接口请求
function hongbaoCreate(type,question,power,Money,num,fee,filePath,voiceLength,moneyType,ispublic,title){
  console.log('create')
  var that = this
my.httpRequest({

  url: hongbaoCreateUrl,
  data: {
    token: login.getSession().session.token,
    type:type,
    question:question,
    power:power,
    money: Money,
    num: num,
    fee:fee,
    is_public: ispublic,
    filePath:filePath,
    voiceLength: voiceLength,
    usebalance:get_Use_Balance(type),
    award_type: moneyType,
    title:title
   },

success:function(res) {
    console.log(res.data)
    if (res.data.code == '101') {
        my.showToast({
            content: res.data.message,
        })
    }
    if (res.data.code == '0') {
        var hotid = res.data.data.hotid;
        var orderid=res.data.data.orderid;
        if (res.data.data.needpay == '0'){
          //不需要调取支付，直接跳转
          my.navigateTo({
            url: '/pages/index/Share/Share?id=' + res.data.data.hotid,
          })
        }
        else{
          var data = res.data.data;
          //调起微信支付
        
        my.tradePay({
            orderStr: data.package,  // 即上述服务端已经加签的orderSr参数
               success: (res) => {
                console.log(JSON.stringify(res.resultCode))
                if(res.resultCode==9000){
                my.navigateTo({url: '/pages/index/Share/Share?id=' + data.hotid,});
              }
              else{

              }
            },
            'fail': function (res) {
               console.log(res);
            },
            'complete':function(res){
               console.log(res);
            }
          });
        }
       
    }
}
})
}
    var noop = function noop() { };
    var defaultOptions = {
      method: 'GET',
      success: noop,
      fail: noop
    };
  //获取提现初始值
 var getBalance=function (options) {

    options = utils.extend({}, defaultOptions, options);
    my.httpRequest({
      url: config.hongbaoGetBalanceUrl,
      data: {
        token: login.getSession().session.token
      },
      success: function (res) {
        //console.log(res.data)
          if(receiveCode(res)){
              var redata = res.data.data;
              redata.needQCode=1;
              redata.needAccount=1;
              if (redata.qCode!=""){
                redata.needQCode = 0;
              }
              if (redata.account != "") {
                redata.needAccount = 0;
              }
              app.globalData.balanceInfo = redata;
              options.success(redata);
          }
    },
      fail: function (res) {
        console.log(res.data)
        options.fail(res);

      },
    })
  };

 module.exports={
  getModel:getModel,
  getChargeFee: getChargeFee,
  getSendFee: getSendFee,
  getReceiveFee: getReceiveFee,
  getWithdrawFee: getWithdrawFee,
  uploadFile:uploadFile,
  downloadFile: downloadFile,
  hongbaoCreate: hongbaoCreate,
  //getAccountInfo: getAccountInfo,
  getSound: getSound,
  getRandom: getRandom,
  getShareWords: getShareWords,
  receiveCode:receiveCode,
  serverError:serverError,
  getBalance:getBalance
}

