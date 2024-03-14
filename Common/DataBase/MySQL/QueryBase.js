const MySQLClient = require("./MySqlClient").MySQLClient();
require('../../Base/Util')

var TIMEOUT = 60000;//60秒钟查询无反应则认为服务器超时
//数据库查询基类
class QueryBase
{
    constructor()
    {
        this.SQLString = null;
        this.Params=[];
        this.RunTime = null;
        this.TimeOut = false;
    }

    //立即执行，回调函数的第一个参数表示错误信息，后面才是结果
    Execute(func)
    {
        this.RunTime = 0;
        if(Verify(this.SQLString))
        {
            MySQLClient.Execute(this, func);
        }
    }

    Update(ms)
    {
        this.RunTime += ms;
        if(this.RunTime >= TIMEOUT)
        {
            this.TimeOut = true;
            MySQLClient.Close();
            MySQLClient.DoConnect();
        }
    }
}

exports.QueryBase = QueryBase;