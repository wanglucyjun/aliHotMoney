var data= {
    isShake:false,
    lasttime:0,
    lengthss:2,
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
        if(difftime<100){
          data.lengthss+=10;
        }else if(difftime<200){
          data.lengthss+=5;
        }else if(difftime<300){
          data.lengthss-=1;
        }else if(difftime<400){
          data.lengthss-=10;
        }else{
          data.lengthss-=20;
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
