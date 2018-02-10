
var noop = function noop() { };
var defaultOptions = {
  method: 'POST',
  success: noop,
  fail: noop,
  loginUrl: null,
};
var accelerometer = { func: function () { },
  rate: 2
 };
//开始摇手机
var yyydata= {
  lastTime: 0,
    lastIndex: 0,
      currentIndex: 0,
        liliang: [],
          saying: [],
};
var addLiliang= function (liliang) {
  var currentIndex = yyydata.lastIndex % 100;
  yyydata.liliang[currentIndex] = 0 + liliang;
  var newTime = (new Date()).getTime();
  var sum = 0;
  var count = 5
  if (yyydata.lastIndex > 5 && (newTime - yyydata.lastTime) > 2000) {
    yyydata.lastTime = newTime;
    for (var i = 0; i < count; i++) {
      sum += yyydata.liliang[(yyydata.lastIndex - i) % 100];
    }
    sum=sum/count
    console.log('sum:' + sum + ';lasttime:' + yyydata.lastTime)
    yyydata.saying = []
    sum = sum * accelerometer.rate + '';
    var p = /[0-9]/;
    for (var i = 0; i < sum.length; i++) {
      if (p.test(sum[i])) {
        yyydata.saying[i] = 'num' + sum[i];
      } else {
        break;
      }
    }
  }
  yyydata.lastIndex++
  return sum;
};
var sayWord=function () {
  var fileIndex = yyydata.saying.shift();
  if (fileIndex != undefined) {
    var fileP = wx.getStorageSync(fileIndex)
    console.log(fileIndex + fileP);
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = fileP
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
};

var startMove=function (func) {
  yyydata.lastTime = (new Date()).getTime();
  yyydata.lastIndex = 5;
  yyydata.currentIndex = 0;
  yyydata.liliang = [10, 23, Math.random() * 20,34,Math.random()*50];
  accelerometer.func = func
  wx.startAccelerometer({
    success: function (res) {
      console.log("the wuli " + res)
    }
  })
};
var stopMove=function() {
  wx.stopAccelerometer({})
};
var initAccelerometer=function() {

  for (var i = 0; i < 10; i++) {
    downloadFile('num' + i, 'https://www.chemchemchem.com/audio/num/num' + i + '.mp3')
  }
  downloadFile('kai0', 'https://www.chemchemchem.com/audio/num/kai0.mp3')
  downloadFile('kai1', 'https://www.chemchemchem.com/audio/num/kai1.mp3')
  my.onAccelerometerChange(function (res) {
    var wuli = 0 + res.x * res.x + res.y * res.y + res.z * res.z
    if (wuli > 2) {
      var sum = addLiliang(wuli) * 1;
      console.log(sum)
      if (sum > 10) {
        var interv = 400
        setTimeout(function () { getSound("kai0"); }, 0);
        setTimeout(function () { sayWord(); }, interv);
        setTimeout(function () { sayWord(); }, interv * 2);
        setTimeout(function () { sayWord(); }, interv * 3);

        var cb = accelerometer.func
        cb && typeof cb == "function" && cb(sum)
      }
    }
  })
};
var getSound=function(key) {
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = wx.getStorageSync(key)
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
};
//下载服务器上的文件
function downloadFile(num, netUrl) {
  var that = this
  //var url = that.data.NetUrl
  console.log("download url is " + netUrl)
  wx.downloadFile({
    url: netUrl,
    success: function (res) {
      // console.log("download return " + res.statusCode)
      //  console.log("download return " + res.tempFilePath)
      if (res.statusCode === 200) {
        console.log("download return " + res.tempFilePath)
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            var filepath = res.savedFilePath
            wx.setStorageSync(num, filepath)
            console.log("download return key")
          }

        })
      }

      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

    }
  })
}
module.exports = {
  getSound: getSound,
  stopMove: stopMove,
  startMove: startMove,
  init: initAccelerometer,
};
