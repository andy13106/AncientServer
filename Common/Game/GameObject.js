require('../Base/Util');
const { ComponentFactory } = require("./ComponentFactory");
const { GameObjectType } = require('./GameObjectType');
//游戏对象基类
class GameObject
{
    constructor()
    {
        this.ObjID = 0;
        this.ObjType = GameObjectType.GOT_NONE;
        this.ComponentList = {};
    }

    GetObjType()
    {
        return this.ObjType;
    }

    //事件处理函数，使用时重载此函数
    OnSocEvent(){};

    //触发事件
    RegisterEvent()
    {
        for(var id in this.ComponentList)
        {
            var cmp = this.ComponentList[id];
            if(Verify(cmp))
            {
                var fnc = cmp.OnSocEvent();
                if(Verify(fnc))
                {
                    fnc.apply(cmp, arguments);
                }
            }
        }
    }

    //心跳函数,使用时重载
    OnUpdate(ms){};

    //心跳函数
    Update(ms)
    {
        for(var id in this.ComponentList)
        {
            this.ComponentList[id].OnUpdate(ms);
        }
        this.OnUpdate(ms);
    }

    //添加组件时执行的代码，使用时重载
    OnAddComponent(comp){};

    //移除组件时执行的代码，使用时重载
    OnRemoveComponent(comp){};

    //获取指定功能类型的组件
    GetComponent(tp)
    {
        return this.ComponentList[tp];
    }

    //移除指定类型的组件
    RemoveComponentByType(tp)
    {
        var comp = this.GetComponent(tp);
        if(Verify(comp))
        {
            comp.SetOwner(null);
            comp.Release();
            delete this.ComponentList[tp];
        }
    }

    //删除组件
    RemoveComponent(comp)
    {
        if(Verify(comp))
        {
            let tp = comp.GetType();
            if(this.GetComponent(tp) == comp)
            {
                comp.SetOwner(null);
                comp.Release();
                delete this.ComponentList[tp];
            }
        }
    }

    //添加组件
    AddComponent(comp)
    {
        if(Verify(comp))
        {
            //先移除同功能类型的组件
            this.RemoveComponentByType(comp.GetType());
            comp.SetOwner(this);
            this.ComponentList[comp.GetType()] = comp;
            this.OnAddComponent(comp);
        }
    }

    //创建组件
    CreateComponent(tp)
    {
        var comp = this.GetComponent(tp >> 8);
        if(Verify(comp) && comp.ComponentTypeID != tp)
        {
            this.RemoveComponent(comp);
            comp = null;
        }
        if(!Verify(comp))
        {
            comp = ComponentFactory.Create(tp);
            this.AddComponent(comp);
        }

        return comp;
    }

    //清理组件
    ClearComponent()
    {
        for(var i in this.ComponentList)
        {
            this.RemoveComponent(this.ComponentList[i]);
        }

        this.ComponentList={};
    }
}

exports.GameObject = GameObject