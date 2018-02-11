const config = require('../config')
var utils = require('./util');
var init = require('./init');
/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(message) {
    Error.call(this, message);
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();
/**
 * 微信登录，获取 code 和 encryptData
 */
var getMyLoginResult = function getLoginCode(callback) {
  console.log('getMyLoginResult')
  my.getAuthCode({
    scopes: 'auth_user',
    success: function (loginResult) {
      
      console.log('loginsuccess')
      my.getAuthUserInfo({
        success: function (userInfo) {

          var ui={};
          ui.avatarUrl=userInfo.avatar;
          ui.account=userInfo.nickName;

          callback(null, {
            code: loginResult.authCode,
            userInfo: ui,
          });
        },

        fail: function (userError) {
          var error = new LoginError('获取支付宝用户信息失败，请检查网络状态');
          console.log(JSON.stringify(userError))
          error.detail = userError;
          callback(error, null);
          
        },
      });
    },

    fail: function (loginError) {
      var error = new LoginError('支付宝登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    },
  });
};
var noop = function noop() { };
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop
};


/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "POST"
 * @param {Function} options.success(uinfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
  console.log('login')
  options = utils.extend({}, defaultOptions, options);

  var doLogin = () => getMyLoginResult(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }
    console.log(JSON.stringify(wxLoginResult.userInfo))

    var userInfo = wxLoginResult.userInfo;
    var code = wxLoginResult.code;
    var signature = wxLoginResult.signature;
    var rawData = wxLoginResult.rawData;
    console.log('loginServer')
    // 请求服务器登录地址，获得会话信息
    my.httpRequest({
      url: config.loginUrl,
      method: options.method,
      data: {
        code: code,
        appid:'2018020202130257'
        //raw_data: rawData,
        //signature: signature,
      },

      success: function (result) {
        console.log(result)
        var data = result.data;

        // 成功地响应会话信息
        if (data) {
          if (data.code == '0') {
            //上传
            if (data.data.needInfo == 1) {
              userInfo.token = data.data.token
              my.httpRequest({
                url: config.updateUrl,
                data: userInfo,
                success: function (res) {
                },
                fail: function (res) {
                  //var errorMessage = '登录失败:' + data.msg || '未知错误';
                  //保存失败
                }
              })
            }
            //设置session
            var session = {
              session: data.data,//token,needinfo
              userInfo: userInfo
            };
            Session.set(session);
            options.success(userInfo);
          } else {
            var errorMessage = '登录失败:' + data.msg || '未知错误';
            var noSessionError = new LoginError(errorMessage);
            options.fail(noSessionError);
          }

          // 没有正确响应会话信息
        } else {
          var errorMessage = '登录请求没有包含会话响应，请确保服务器处理 `' + config.loginUrl + '` 的时候输出登录结果';
          var noSessionError = new LoginError(errorMessage);
          options.fail(noSessionError);
        }
      },

      // 响应错误
      fail: function (loginResponseError) {
        var error = new LoginError('登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      },
    });
  });

 

  doLogin();
};
var SESSION_KEY = 'weapp_session_' + '2018020202130257';    //WX_SESSION_MAGIC_ID

var Session = {
  get: function () {
    return my.getStorageSync({key:SESSION_KEY}).data || null;
  },

  set: function (data) {
    my.setStorageSync({key:SESSION_KEY, data:data});
  },

  clear: function () {
    my.removeStorageSync({key:SESSION_KEY});
  },
};
var checkSession = function (options){
  console.log('checkSession')
  options = utils.extend({}, defaultOptions, options);
  
  init.checkInitData({
    success: function (data) {
      var session = Session.get();
//
     // session={}
      //session.session={token:"189-79ddf445d1b2a88b5d07918ee1f8f00e-abb2e81deacbdfadf6d485a66a105d1a"}
     // session.userInfo={avatar:"https://tfs.alipayobjects.com/images/partner/T1k5tdXhVqXXXXXXXX",nickName:"viwofer@qq.com"}
      //Session.set(session);
//


      if (session) {
        options.success(session);
      } else {
        login(options);
      }
    }
  });
};
module.exports = {
  LoginError: LoginError,
  login: login,
  checkSession: checkSession,
  getSession: Session.get,
  getInitData: init.getInitData
};
