const { CallBack } = require('./CallBack');

require('./Util');

//全局事件处理
class EventCenter
{
    constructor()
    {
        this.EventHandlerMap={};
        this.EventList = [];
    }

    //查询一个事件是否被注册过
    FindEventHandler(id)
    {
        return this.EventHandlerMap[id];
    }

    //注册事件和对应的处理函数，同一事件可以有多个响应函数
    RegisterEvent(id, obj, funcname)
    {
        if(Verify(id) && Verify(obj) && Verify(funcname))
        {
            var handler = this.FindEventHandler(id);
            var proc = new CallBack(obj, funcname);
            if(Verify(handler))
            {
                handler.push(proc);
            }
            else
            {
                handler = new Array();
                handler.push(proc);
                this.EventHandlerMap[id] = handler;
            }
        }
    }

    //取消事件注册，所有相关回调全部清除
    UnRegisterEvent(id)
    {
        let handler = this.FindEventHandler(id);
        if(Verify(handler))
        {
            let len = handler.length;
            while(len--)
            {
                delete handler[len];
            }
        }
        
        delete this.EventHandlerMap[id];
    }

    //清除所有事件绑定
    ClearAllHandler()
    {
        for(let id in this.EventHandlerMap)
        {
            this.UnRegisterEvent(id);
        }

        this.EventHandlerMap = {};

        let len = this.EventList.length;
        while(len--)
        {
            delete this.EventList[len];
        }
        this.EventList = [];
    }

    //同步处理事件
    RaiseEvent()
    {
        var handler = this.FindEventHandler(arguments[0]);
        if(Verify(handler))
        {
            var len = handler.length;
            while(len--)
            {
                if(handler[len].IsValid())
                {
                    switch(arguments.length)
                    {
                        case 1:
                            handler[len].Execute.call(handler[len]);
                            break;
                        case 2:
                            handler[len].Execute.call(handler[len], arguments[1]);
                            break;
                        case 3:
                            handler[len].Execute.call(handler[len], arguments[1], arguments[2]);
                            break;
                        case 4:
                            handler[len].Execute.call(handler[len], arguments[1], arguments[2], arguments[3]);
                            break;
                        default:
                            var args = arguments.slice(1);
                            handler[len].Execute.apply(handler[len], args);
                            break;
                    }
                }
            }
            return true;
        }

        return false;
    }

    //异步处理事件
    PostEvent()
    {
        if(arguments.length > 0)
        {
            this.EventList.push(arguments);
        }
    }

    //心跳函数
    Update(ms)
    {
        var len = this.EventList.length;
        for(let i=0; i < len; ++i)
        {
            var args = this.EventList[i];
            this.RaiseEvent.apply(this, args);
        }
    
        this.EventList.splice(0, len);
    }
}

var ThisInstance = null;
//单例模式
exports.EventCenter = function()
{
    if(!Verify(ThisInstance))
        ThisInstance = new EventCenter();

    return ThisInstance;
}