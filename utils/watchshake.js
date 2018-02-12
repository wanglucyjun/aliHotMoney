var data= {
    isShake:false,
    lasttime:0,
    lengthss:2,
    defalutss:[[500,2],[1500,1],[2000,-1],[3000,-2],[1000000,0]],//[毫秒数，和数值]
    lengtharr:[1,2,3,4,5,6,7,8,9,10],
    func: function () { }

};
var watchShake= function() {
    if(data.isShake){
        if(data.lasttime<10){
            data.lasttime=new Date().getTime()
            console.log("the lasttime is "+data.lasttime)
        }
        my.watchShake({
        success: function() {
            watchShake();
            var thistime=new Date().getTime();
            var difftime=thistime-data.lasttime;
            data.lasttime=thistime;
            console.log("defalutss is "+data.defalutss.length)
            for(var i=0;i<data.defalutss.length;i++){
                var tempdata=data.defalutss[i]
                if(difftime<tempdata[0]){
                    data.lengthss+=tempdata[1];
                    break;
                }
            }

            // var num=0;
            // var t1=difftime/1000;
            // if(t1<=1){
            //     num=(1-t1)*5;
            // }else{
            //     num=(1-t1)*2;
            // }
            //data.lengthss+=num;

            if (data.lengthss < 0) {
                data.lengthss = 0;
            } else {
                data.lengtharr.shift();
                data.lengtharr.push();
            }


            
            if(data.lengthss<0){
            data.lengthss=0
            }
            console.log("data length"+data.lengthss)
            console.log(difftime)

            var cb = data.func
            cb && typeof cb == "function" && cb(data.lengthss)

            
        }
        });
    }
};


var startMove=function(func) {
    data.isShake=true;
    data.func=func;
    data.lasttime=0;
    data.lengthss=2;
    data.lengtharr=[1,2,3,4,5,6,7,8,9,10];
    watchShake();
    console.log(JSON.stringify(data));
};
var stopMove=function() {
console.log('stopMove')
   data.isShake=false
   data.func=function() {};
};
var init=function() {
   if(!data.isShake){
       watchShake();
       data.isShake=true;
   }
};
var setdefalutss=function(defalutss){
    if(defalutss){
      data.defalutss=defalutss;
    }
}

module.exports = {
  stopMove: stopMove,
  startMove: startMove,
  init: init,
  setdefalutss:setdefalutss
};
