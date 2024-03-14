require('./Util.js');

//功能模块基类
class Module
{
    constructor(solution)
    {
        this.Name = null;
        this.ModuleID = 0;
        this.Solution = solution;
    }

    SetName(name)
    {
        this.Name = name;
    }

    GetName()
    {
        return this.Name;
    }

    SetModuleID(id)
    {
        this.ModuleID = id;
    }

    GetModuleID()
    {
        return this.ModuleID;
    }

    //初始化需要执行的代码写在这个函数里，子类重写
    OnInitialize(){};

    //初始化
    Initialize()
    {
        this.OnInitialize();
    }

    //释放里需要执行的代码写在这个函数里
    OnRelease(){};

    //释放
    Release()
    {
        this.OnRelease();
    }

    //子类重写此函数实现心跳函数
    OnUpdate(ms){};

    //心跳函数
    Update(ms)
    {
        this.OnUpdate(ms);
    }

}

exports.Module = Module;