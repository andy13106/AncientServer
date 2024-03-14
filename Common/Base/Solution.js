require('./Util');
const EventCenter = require('./EventCenter').EventCenter();

//异常处理
process.on('uncaughtException', (error)=>{
    EventCenter.RaiseEvent('DumpError', error);
    console.log(error);
})

//解决方案基类
class Solution
{
    constructor(name)
    {
        this.Name = name;
        this.ModuleList = {};
        //心跳计时
        this.LastTime = 0;
        //日志服务
        this.LogService = null;
        this.bRelease = false;

        this.IP = null;
        this.PORT = 0;
    }

    SetName(name)
    {
        this.Name = name;
        if(Verify(this.LogService))
            this.LogService.SetSign(name);
    }

    GetName()
    {
        return this.Name;
    }

    SetLogService(log)
    {
        this.LogService = log;
        if(Verify(this.LogService))
            this.LogService.SetSign(this.Name);
    }

    //安装Module时执行的代码， 使用时可重载此函数
    OnInstallModule(module){};

    //安装Module类
    InstallModule(moduleclass)
    {
        var module = new moduleclass(this);
        if(Verify(module))
        {
            module.Initialize();
            this.ModuleList[module.GetName()] = module;
            this.OnInstallModule(module);
        }
    }

    //御载Module时执行的代码， 使用时可重载此函数
    OnUnInstallModule(module){};
    //御载Module
    UnInstallModule(name)
    {
        var module = this.ModuleList[name];
        if(Verify(module))
        {
            this.OnUnInstallModule(module);
            module.Release();
            delete this.ModuleList[name];
        }
    }

    //清除Module
    ClearModule()
    {
        for(var name in this.ModuleList)
        {
            this.UnInstallModule(name);
        }
        this.ModuleList = {};
    }

    //异常处理
    DumpError(err)
    {
        if(Verify(err))
        {
            if (typeof err === 'object')
            {
                if (err.message)
                {
                    if(Verify(this.LogService))
                    {
                        this.LogService.Log("ErrorMessage: " + err.message);
                    }
                    else
                    {
                        console.log("ErrorMessage: " + err.message);
                    }
                }
                if (err.stack)
                {
                    if(Verify(this.LogService))
                    {
                        this.LogService.Log("====>Stacktrace: " + err.stack);
                    }
                    else
                    {
                        console.log("====>Stacktrace: " + err.stack);
                    }
                }
            }
            else 
            {
                if(Verify(this.LogService))
                {
                    this.LogService.Log("dumpError :: " + err);
                }
                else
                {
                    console.log("dumpError :: " + err);
                }
            }
        }
    }

    //创建实例时运行的代码， 使用时可重载此函数
    OnCreate(){};

    //创建实例
    Create()
    {
        EventCenter.RegisterEvent('DumpError', this, 'OnDumpError');
        this.OnCreate();
        this.LastTime = Date.now();

        if(Verify(this.LogService))
        {
            this.LogService.Log(this.Name+" Start OK!!!");
        }

        this.bRelease = false;
    }

    //释放时执行的代码，使用时可重载此函数
    OnRelease(){};

    //释放
    Release()
    {
        this.bRelease = true;
        this.ClearModule();
        this.OnRelease();
        if(Verify(this.LogService))
            this.LogService.Log(this.Name + " ShutDown!!!");
    }

    //心跳函数，使用时可重载
    OnUpdate(ms){};

    //心跳函数
    Update()
    {
        let TimeNow = Date.now();
        let ms = TimeNow - this.LastTime;

        if(Verify(this.LogService))
            this.LogService.Update(ms);

        for(var i in this.ModuleList)
        {
            var m = this.ModuleList[i];
            if(Verify(m))
                m.Update(ms);
        }

        this.OnUpdate(ms);

        this.LastTime = TimeNow;
    }
}

exports.Solution = Solution;