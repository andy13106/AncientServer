const MYSQL = require('mysql');
const { CallBack } = require('../../Base/CallBack');
const EventCenter = require('../../Base/EventCenter').EventCenter();
const { LogSystem } = require('../../Base/LogSystem');
require('../../Base/Util')

//MySQL数据库访问
class MySQLClient
{
    constructor()
    {
        this.Config = {
            connectionLimit: 10,    //连接池暂时用10个
            host: 'localhost',
            user: 'root',
            port: 3306,
            password: 'password',
            database: 'database_name'
        };
        this.MySQLPool = null;
        this.BLog = false;
        this.LogService = null;
        this.RunningCount = 0;//正在执行的查询数量
        //未能立即执行的查询队列
        this.QueryList = [];
    }

    SetLog(logfile, blog, logpath, logfix, bprint)
    {
        this.BLog = blog;
        if(this.BLog)
        {
            this.LogService = new LogSystem(logfile);
            this.LogService.SetPrint(bprint);
            this.LogService.SetLogPath(logpath);
            this.LogService.SetLogFix(logfix);
        }
        else
        {
            delete this.LogService;
            this.LogService = null;
        }
    }

    //记录日志
    Log()
    {
        if(this.BLog && Verify(this.LogService))
        {
            var Content = "";
            var l = arguments.length;
            for(let i=0; i < l; ++i)
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

    //连接数据库
    Connect(host, port, name, pwd, db)
    {
        this.Config.host = host;
        this.Config.port = port;
        this.Config.user = name;
        this.Config.password = pwd;
        this.Config.database = db;

        return this.DoConnect();
    }

    //连接数据库
    DoConnect()
    {
        this.MySQLPool = MYSQL.createPool(this.Config);

        var LogString = "Connect MySQL:"+this.Config.host+" Port:"+this.Config.port;
        if(!Verify(this.MySQLPool))
        {
            this.Log(LogString + " Failed!!!");
            return false;
        }
        this.Log(LogString + " Succeed!!!");

        return true;
    }

    //执行查询
    Execute(QueryObj, callback)
    {
        if(Verify(QueryObj))
        {
            var funcLog = new CallBack(this, "Log");
            this.MySQLPool.getConnection((err, connection) => {
                if (err) {
                    funcLog.Execute('MySQL connection error: ' + JSON.stringify(err));
                    //出错了，可能是连接池已满，把查询放到未执行队列中等待重试
                    this.QueryList.push({query:QueryObj, call:callback});
                    return;
                }
                this.RunningCount++;
                funcLog.Execute("Excute SQL Query: ", QueryObj.SQLString, QueryObj.Params);
                connection.query(QueryObj.SQLString, QueryObj.Params, (err, result) => {
                    if (err) {
                        funcLog.Execute('MySQL connection error: ' + JSON.stringify(err));
                        //这里是执行查询时出错了，可能是语法或数据格式有错误，直接传回错误
                        callback && callback(err, null);
                        return;
                    }
                    funcLog.Execute("ExecuteSQL Succeed:" + JSON.stringify(result))
                    //正确执行时错误代码传回null
                    callback && callback(null, result);
                    connection.release();
                    this.RunningCount--;
                });
            });
        }
    }

    //心跳函数
    Update(ms)
    {
        if(Verify(this.MySQLPool))
        {
            if(this.QueryList.length > 0)
            {
                var q = this.QueryList.shift();
                if(Verify(q) && Verify(q.query) && Verify(q.call))
                {
                    q.Update(ms);
                    this.Execute(q.query, q.call);
                }
            }
        }
    }

    //是否可关闭
    CanClose()
    {
        return this.QueryList.length == 0 && this.RunningCount == 0;
    }

    //关闭
    Close()
    {
        this.MySQLPool.end((err) => {
            if (err)
            {
                this.Log('Pool end error: ', err);
                return;
            }
        
            
            this.Log("MySQL is Disconnected!!!");
        });
    }
}

//使用单例模式
var ThisInstance = null;

exports.MySQLClient = function()
{
    if(!Verify(ThisInstance))
    {
        ThisInstance = new MySQLClient();
    }

    return ThisInstance;
}


