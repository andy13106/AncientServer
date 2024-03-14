const { Factory } = require("../Base/Factory");
require('../Base/Util');

//组件工厂
var ThisMgr = null;

exports.ComponentFactory = function()
{
    if(!Verify(ThisMgr))
    {
        ThisMgr = new Factory();
    }

    return ThisMgr;
}