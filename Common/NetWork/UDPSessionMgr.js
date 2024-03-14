const { Manager } = require("../Base/Manager");
require('../Base/Util');

//UDP会话管理，单例模式
var ThisInstance = null;
exports.UDPSessionMgr = function()
{
    if(!Verify(ThisInstance))
        ThisInstance = new Manager();

    return ThisInstance;
}