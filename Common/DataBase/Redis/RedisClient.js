const redis = require("redis");
const { CallBack } = require("../../Base/CallBack");
const {LogSystem} = require('../../Base/LogSystem');
require('../../Base/Util')
//读写Redis
class RedisClient
{
    constructor(host, port, logfile, blog, logpath, logfix, print)
    {
        this.BLog = blog;

        if(this.BLog)
        {
            this.LogService = new LogSystem(logfile);
            this.LogService.SetPrint(print);
            this.LogService.SetLogPath(logpath);
            this.LogService.SetLogFix(logfix);
        }
        else
        {
            delete this.LogService;
            this.LogService = null;
        }

        //使用回调记录日志
        var funcLog = new CallBack(this, "WriteLog");

        this.RedisCli = redis.createClient({
            url: `redis://${host}:${port}`,
            legacyMode:true
        });

        // 配置redis的监听事件
        this.RedisCli.on('ready', function() {
            funcLog.Execute('Redis Client: ready')
        })

        // 连接到redis-server回调事件
        this.RedisCli.on('connect', function () {
            funcLog.Execute('redis is now connected!');
        });

        this.RedisCli.on('reconnecting', function () {
            funcLog.Execute('redis reconnecting', arguments);
        });

        this.RedisCli.on('end', function () {
            funcLog.Execute('Redis Closed!');
        });
        
        this.RedisCli.on('warning', function () {
            funcLog.Execute('Redis client: warning', arguments);
        });
 
        this.RedisCli.on('error', err => {
            funcLog.Execute('Redis Error ' + err);
        });
        
        // 判断redis是否连接
        if (this.RedisCli.isOpen) 
        {
            funcLog.Execute('Redis is now connected!')
        } 
        else 
        {
            this.RedisCli.connect().catch(error => console.log(error));
        }
    }

    WriteLog()
    {
        if(this.BLog && Verify(this.LogService))
        {
            var Content = "";
            var l = arguments.length;
            for(let i = 0; i < l; ++i)
            {
                if(i > 0)
                {
                    Content += "\t";
                }
                if(IsString(arguments[i]))
                {
                    Content += arguments[i];
                }
                else
                {
                    Content += JSON.stringify(arguments[i]);
                }
            }
            this.LogService.Log(Content);
        }
    }

    async contect() 
    {
        await this.RedisCli.connect().catch(error => console.log(error));
    }

    quit() 
    {
        this.RedisCli.quit();
    }

    async exists(key)
    {
        var funcLog = new CallBackFunc(this, "Log")
        return new Promise((resolve, reject) => {
            this.RedisCli.exists(key, (err, result) => {
                if (err) 
                {
                    funcLog.Execute(err);
                    reject(false);
                }
                resolve(result);
            })
        })
    }

    async set(key, value, exprires) 
    {
        if (typeof value === 'object') 
        {
            value = JSON.stringify(value)
        }
        return new Promise((resolve, reject)  => {
            this.RedisCli.set(key, value, (err, result) => {
                if (err) 
                {
                    reject(false);
                }
                if (!isNaN(exprires)) 
                {
                    this.RedisCli.expire(key, exprires);
                }
                resolve(result);
            })
        })
    }

    async get(key) 
    {
        return new Promise((resolve, reject) => {
            this.RedisCli.get(key, (err, result) => {
                if (err) 
                {
                    reject(false);
                }
                if (result) 
                {
                    try {
                        result = JSON.parse(result);
                    } catch (error) {
                        // do nothing
                    }
                }
                resolve(result);
            })
        })
    }

    async remove(key) 
    {
        return new Promise((resolve, reject) => {
            this.RedisCli.del(key, (err, result) => {
                if (err) 
                {
                    reject(false);
                }
                resolve(result);
            })
        });
    }

    // push 将给定值推入列表的右端 返回值 当前列表长度
    async rPush(key, list, exprires) 
    {
        return new Promise((resolve, reject) => {
            this.RedisCli.rPush(key, list, (err, length) => {
                if (err) 
                {
                    reject(false);
                }
                if (!isNaN(exprires)) 
                {
                    this.RedisCli.exports(key, exprires);
                }
                resolve(length);
            })
        })
    }

    // 查询list的值
    async lrange(key, startIndex = 0, stopIndex = -1) 
    {
        return new Promise((resolve, reject) => {
            this.RedisCli.lRange(key, startIndex, stopIndex, (err, result) => {
                if (err) 
                {
                    reject(false);
                }
                resolve(result)
            })
        })
    }

    // 清除list中n个值为value的项
    async lrem(key, n = 1, value) 
    {
        return new Promise((resolve, reject) => {
            this.RedisCli.lrem(key, n, value, (err, result) => {
                if (err) 
                {
                    return false
                }
                resolve(result);
            })
        });
    }

}

exports.RedisClient = RedisClient;
