const config = require('../config')
var utils = require('./util');

var InitData_KEY = 'weapp_init_' + '2018020202130257';    //WX_SESSION_MAGIC_ID
var noop = function noop() { };
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop
};
var InitData = {
  get: function () {
    return wx.getStorageSync(InitData_KEY) || null;
  },

  set: function (data) {
    wx.setStorageSync(InitData_KEY, data);
  },

  clear: function () {
    wx.removeStorageSync(InitData_KEY);
  },
};
var init = function (options) {
  console.log('init')
  options = utils.extend({}, defaultOptions, options);
  my.httpRequest({
    url: config.initUrl,
    success: function (res) {
      console.log(res.data)
      if (res.data.data) {
        InitData.set(res.data.data);
        options.success(res.data.data);
      }
    },
    fail: function (res) {
      console.log(res.data)
    },
  })
};

var checkInitData = function (options) {
  console.log('checkInitData')
  options = utils.extend({}, defaultOptions, options);
  var data = InitData.get();
  console.log(data)
  if (data) {
    wx.checkSession({
      success: function () {
        options.success(data);
      },
      fail: function () {
        //Session.clear();
        init(options);
      },
    });
  } else {
    //login(options);
    init(options);
  }
};
module.exports = {
  checkInitData: checkInitData,
  setInitData: InitData.set,
  getInitData: InitData.get,
};