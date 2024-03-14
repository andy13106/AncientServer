const { RedisClient } = require("./RedisClient");

//Redis连接管理
class RedisMgr
{
    constructor()
    {
        this.IP = '127.0.0.1';
        this.Port = 6379;
        this.logFile = null;
        this.Log = false;
        this.logFix = null;
        this.LogPath = '';
        this.PrintLog = false;
        this.RedisClient = null;
    }

    SetLog(LogFile, bool, LogPath, LogFix, Print)
    {
        this.logFile = LogFile;
        this.log = bool;
        this.LogPath = LogPath;
        this.logFix = LogFix;
        this.PrintLog = Print;
    }

    Connect(IP, Port)
    {
        this.RedisClient = new RedisClient(IP, Port, this.logFile, this.log, this.LogPath, this.logFix, this.PrintLog);
    }
    
    //写Redis，如果需要编码或修改格式在set前实现
    async Write(key, value)
    {
        this.RedisClient.Log("Write Key:"+key+"\n Value:"+value);
        //如果需要编码或格式变化在这里实现
        await this.RedisClient.set(key, value);
    }

    //读Redis，如果有解码或格式变化在get后实现
    async Read(key, type)
    {
        var value = await this.RedisClient.get(key);
        if(Verify(value))
        {
            //如果解码或格式变化在这里实现
        }

        this.RedisClient.log("Read Key:"+key+"\n Value:"+value);

        return value;
    }

    Close()
    {
        this.RedisClient.quit();
    }
}

//使用单例模式
var ThisInstance = null;
exports.RedisMgr = function()
{
    if(!Verify(ThisInstance))
        ThisInstance = new RedisMgr();

    return ThisInstance;
}