require('./Util');

//回调函数
class CallBack
{
    constructor(obj, funcname)
    {
        this.obj = obj;
        this.funcname = funcname;
    }

    //验证当前回调是否合法
    IsValid = () => Verify(this.obj) && Verify(this.funcname);

    //执行回调
    Execute = (...args) => {
        const func = this.obj[this.funcname];
        if(Verify(func))
        {
            return func.apply(this.obj, args);
        }
    }
}

exports.CallBack = CallBack
