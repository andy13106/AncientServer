const { ComponentType } = require('./ComponentType');
const { GameObject, GameObjectType } = require('./GameObject');

require('../Base/Util');

//组件类基类
class Component extends GameObject
{
    constructor()
    {
        super();
        this.ObjType = GameObjectType.GOT_COMPONENT;
        //拥有该组件的对象
        this.Owner = null;
        this.ComponentTypeID = ComponentType.ECT_NONE;
    }

    //获取类型
    GetType()
    {
        return this.ComponentTypeID >> 8;
    }

    //添加到游戏对象时执行的代码，使用时重载此函数
    OnAttach(){};
    //从游戏对象中删除时执行的代码，使用时重载此函数
    OnDetach(){};
    //心跳函数,使用时重载
    OnUpdate(ms){};

    GetOwner()
    {
        return this.Owner;
    }

    SetOwner(obj)
    {
        if(Verify(this.Owner))
        {
            this.OnDetach();
        }

        this.Owner = obj;

        if(Verify(this.Owner))
        {
            this.OnAttach();
        }
    }
}

exports.Component = Component;