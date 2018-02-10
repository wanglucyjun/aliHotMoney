var data= {
    isShake:false,
    lasttime:0,
    lengthss:2,
    defalutss:[[100,10],[200,5],[300,-1],[500,-10],[1000,-20],[1000000,0]],//[毫秒数，和数值]
    lengtharr:[1,2,3,4,5,6,7,8,9,10],
    func: function () { }

};
var watchShake= function() {
    if(data.lasttime<10){
        data.lasttime=new Date().getTime()
    }
    my.watchShake({
      success: function() {
        
        var thistime=new Date().getTime();
        var difftime=thistime-data.lasttime;
        data.lasttime=thistime;
        for(var i=0;i<data.defalutss.length;i++){
              tempdata=data.defalutss[i]
              if(difftime<tempdata[0]){
                  data.lengthss+=tempdata[1];
                  break;
              }
          }
          if (data.lengthss < 0) {
              data.lengthss = 0;
          } else {
              data.lengtharr.shift();
              data.lengtharr.push();
          }
        console.log(data.lengthss)
        console.log(difftime)

        var cb = data.func
        cb && typeof cb == "function" && cb(data.lengthss)

        watchShake();
      }
    });
};


var startMove=function(func) {
    console.log("hh")
    console.log(data);

    data.func=func;
    data.lasttime=0;
    data.lengthss=2;
    data.lengtharr=[1,2,3,4,5,6,7,8,9,10];

    console.log(data);
};
var stopMove=function() {
   data.func=function() {};
};
var init=function() {
   if(!data.isShake){
       watchShake();
       data.isShake=true;
   }
};


module.exports = {
  stopMove: stopMove,
  startMove: startMove,
  init: init,
};
