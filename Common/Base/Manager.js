require('./Util');

//管理器类基类
class Manager
{
    constructor()
    {
        this.ManagerMap= new Map();
    }

    //添加对象时需要处理的事情，子类重写这个方法
    OnAdd(id, obj){};

    //真正的添加对象的方法
    Add(id, obj)
    {
        if(!this.ManagerMap.has(id))
        {
            this.ManagerMap.set(id, obj);
            this.OnAdd(id, obj);
        }
    }

    //删除对象时需要处理的事情写在这个方法里，由子类重写
    OnRemove(id, obj){};

    //删除一个对象
    Remove(id)
    {
        var obj = this.ManagerMap.get(id);
        if(Verify(obj))
        {
            this.OnRemove(id, obj);
            //如果对象有释放的方法则调用该方法
            if(Verify(obj.Release))
            {
                obj.Release();
            }
            this.ManagerMap.delete(id);
        }
    }

    //查找一个对象
    Find(id)
    {
        return this.ManagerMap.get(id);
    }

    //心跳函数
    Update(ms)
    {
        for(var id of this.ManagerMap.keys())
        {
            var obj = this.ManagerMap.get(id);
            if(Verify(obj) && Verify(obj.Update))
            {
                obj.Update(ms);
            }
        }
    }


    //获取整个map
    GetMap()
    {
        return this.ManagerMap;
    }

    //清理
    Clear()
    {
        for(var id of this.ManagerMap.keys())
        {
            this.Remove(id);
        }

        this.ManagerMap.clear;
    }

    Count()
    {
        return this.ManagerMap.size;
    }
}

exports.Manager = Manager;