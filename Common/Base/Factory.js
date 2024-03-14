//工厂基类
require('./Util');

class Factory
{
    constructor()
    {
        this._map={};
    }

    //注册函数
    Register(tp, cls)
    {
        this._map[tp] = cls;
    }

    //创建对象
    Create(tp)
    {
        if(typeof tp !== 'string') {
            throw new Error('tp must be a string');
        }
        var obj = this._map[tp];
        if(Verify(obj))
        {
            var instance = new obj();
            if(instance instanceof Object) {
                return instance;
            }
            else {
                throw new Error('Create function must return an object');
            }
        }

        return null;
    }
}

exports.Factory = Factory
