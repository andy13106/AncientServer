const LogService = require('../Common/Base/LogService').LogService();
const { Solution } = require('../Common/Base/Solution');
const ini = require('ini');
var fs = require('fs');
const { TCPListener } = require('../Common/NetWork/TCPListener');
const { ModuleMain } = require('./Modules/ModuleMain');
const Config = ini.parse(fs.readFileSync('../Config/Config.ini', 'utf-8'));
require('../CommonLogic/GolbalDefine');


class ServerTemplate extends Solution
{
    constructor()
    {
        super("ServerName");
        this.TP = null;
    }

    OnCreate()
    {
        LogService.SetLogPath(Config.LogService.LogPath);
        LogService.SetLogFix(Config.LogService.LogFix);
        LogService.SetPrint(Config.LogService.PrintLog);
        LogService.SetWriteLog(Config.ServerTemplate.WriteLog);//是否写日志
        this.SetLogService(LogService);

        this.InstallModule(ModuleMain);

        this.TP = new TCPListener();
        this.TP.SetLogSystem(LogService);
        this.TP.StartListen(Config.ServerTemplate.IP, Config.ServerTemplate.PORT);//开启监听
    }

    OnUpdate(ms)
    {
        this.TP.Update(ms);
    }

    OnRelease(){}
}

var GS = new ServerTemplate();
GS.Create();

function Update()
{
    if(!GS.bRelease)
        GS.Update();
}

var si = setInterval(Update, SERVER_INTERVAL_TIME);

process.stdin.resume();
process.stdin.on('data', (chunk)=>{
    var str = chunk.toString().trim();
    if(str == 'quit'||str == 'exit')
    {
		clearInterval(si);
        GS.Release();
        process.exit(0);
    }
})