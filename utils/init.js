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
    return my.getStorageSync({key:InitData_KEY}).data || null;
  },

  set: function (data) {
    my.setStorageSync({key:InitData_KEY, data:data});
  },

  clear: function () {
    my.removeStorageSync({key:InitData_KEY});
  },
};
var init = function (options) {
  console.log('init1')
  console.log(JSON.stringify(config.initUrl))
  options = utils.extend({}, defaultOptions, options);

  my.httpRequest({
    url: config.initUrl,
    success: function (res) {
      console.log('success')
      console.log(JSON.stringify(res.data))
      if (res.data.data) {
        InitData.set(res.data.data);
        options.success(res.data.data);
      }
    },
    fail: function (res) {
      console.log('fail')
      console.log( JSON.stringify(res))
    },
  })
};

var checkInitData = function (options) {
  console.log('checkInitData')
  options = utils.extend({}, defaultOptions, options);
  var data = InitData.get();
  console.log(data)
 
  if (data) {
     console.log('checkInitData1')
     options.success(data);
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