const { LogSystem } = require('./LogSystem');
require('./Util');

//文件日志服务
var ThisInstance = null;

exports.LogService = function()
{
    if(!Verify(ThisInstance))
    {
        ThisInstance = new LogSystem();
    }

    return ThisInstance;
}