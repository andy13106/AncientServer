require('./Util');
const FS = require('fs');

//日志的分割方式
(function(){
    LOG_NO_FIX = 0;			//不分割日志
	LOG_ONE_DAY_FIX = 1;	//每天分割一次
	LOG_ONE_HOUR_FIX = 2;	//每小时分割一次
})();


//文件日志实现
class LogSystem
{
    constructor(sign = "LogSystem")
    {
        this.Sign = sign;
        this.Print = true;
        this.LogFile = null;
        this.LogFix = LOG_NO_FIX;
        this.LogPath = ".";
        this.LastTime = 0;
        this.bWriteLog = true;
    }

    SetSign(sign)
    {
        this.Sign = sign;
        this.ResetFileName();
    }

    SetPrint(bPrint)
    {
        this.Print = bPrint==1 || bPrint=='1' || bPrint == true;
    }

    SetLogFix(fix)
    {
        this.LogFix = fix * 1;
    }

    SetLogPath(path)
    {
        this.LogPath = path;
    }

    SetWriteLog(bw)
    {
        this.bWriteLog = bw;
    }

    ResetFileName()
    {
        var strFileName = ".log";
        var TimeNow = new Date();
        switch(this.LogFix)
        {
            case LOG_NO_FIX:
                strFileName = "LOG";
                break;
            case LOG_ONE_HOUR_FIX:
                this.LastTime = TimeNow.getHours();
                strFileName = GetDateStringByDate(TimeNow, "_") + "_" +TimeNow.getHours() + strFileName;
                break;
            case LOG_ONE_DAY_FIX:
                this.LastTime = TimeNow.getDate();
                strFileName = GetDateStringByDate(TimeNow, "_") + strFileName;
                break;
        }

        this.LogFile = this.Sign + "_" + strFileName;
    }

    Update(ms)
    {
        var TimeNow = new Date();
        switch(this.LogFix)
        {
            case LOG_ONE_HOUR_FIX:		
                if(TimeNow.getHours() != this.LastTime)
                {
                    this.ResetFileName();
                }
                break;
            case LOG_ONE_DAY_FIX:
                if(TimeNow.getDate() != this.LastTime)
                {
                    this.ResetFileName();
                }
                break;
        }
    }

    CreateStringByArray(array)
    {
        var Content = "";
        var l = array.length;
        for(var i = 0; i < l; ++i)
        {
            if(this.Print)
            {
                console.log(array[i]);
            }

            if(i > 0)
            {
                Content += "\t";
            }

            if(IsString(array[i]))
            {
                Content += array[i];
            }
            else
            {
                Content += JSON.stringify(array[i]);
            }
        }
        return Content;
    }

    Log()
    {
        var Content = this.CreateStringByArray(arguments);
        
        if(!this.bWriteLog)
        {
            return;
        }
        
        if(!Verify(this.LogFile))
        {
            this.ResetFileName();
        }
        
        var TimeNow = new Date();
        
        if (!FS.existsSync(this.LogPath))
        {
            FS.mkdirSync(this.LogPath);
        }
            
        var FileName = this.LogPath + '/' + this.LogFile;
        
        Content = GetTimeStringByDate(TimeNow, "-") + ": " + Content + "\n";
        
        if(LOG_NO_FIX == this.LogFix)
        {
            Content = GetDateStringByDate(TimeNow, "-") + "-" + Content;
        }
                
        FS.appendFile(FileName, Content, (err)=>{
            if(err)
                console.log(err);
        });
    }
}

exports.LogSystem = LogSystem;