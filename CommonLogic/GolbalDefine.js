const EventCenter = require("../Common/Base/EventCenter").EventCenter();

//定义一些全局变量
(function(){
    BIND_PKG_HANDLER = function(id, obj, funcName){
        EventCenter.RegisterEvent(id, obj, funcName);
    };

    SERVER_INTERVAL_TIME        =   66;         //服务端大约66毫秒一帧,平均15帧每秒

    SERVER_NOTIFY_STATE_TIME    =   3000000 * 1000;  //服务器每30秒钟同步一次状态信息,  开发期暂时先调为一个极大值

    GAME_VERSION                =   1000;       //游戏版本号

})();