require('../Base/Util');
const{ Manager } = require('../Base/Manager');
//TCP会话管理器，单例模式
var ThisInstance = null;
exports.TCPSessionManager = function()
{
    if(!Verify(ThisInstance))
    {
        ThisInstance = new Manager();
    }

    return ThisInstance;
}