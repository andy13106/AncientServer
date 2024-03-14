const dgram = require('dgram');
const { CallBack } = require('../Base/CallBack');
const EventCenter = require('../Base/EventCenter').EventCenter();
const { UDPClient } = require('./UDPClient');
const UDPSessionMgr = require('./UDPSessionMgr').UDPSessionMgr();

//UDP监听
class UDPListener
{
    constructor()
    {
        this.UDPServer = null;
        this.LogSystem = null;
    }

    StartListen(ip, port)
    { 
        this.UDPServer = dgram.createSocket('udp4');

        var OnReceiveData = new CallBack(this, 'OnReceiveData');
        var OnListening = new CallBack(this, "OnListening");
        var OnError = new CallBack(this, "OnError");

        this.UDPServer.on('error', (err)=>{
            OnError.Execute(err);
        });

        this.UDPServer.on('message', (msg, info)=>{
            OnReceiveData.Execute(msg, info);
        });

        this.UDPServer.on('listening', ()=>{
            OnListening.Execute(port);
        });

        this.UDPServer.bind(port);
    }

    OnListening(port)
    {
        if(Verify(this.LogSystem))
        {
            const address = this.UDPServer.address();

            this.LogSystem.Log("Server Listening UDP on "+address.address+":"+port);
        }
    }

    OnReceiveData(msg, info)
    {
        var tc = UDPSessionMgr.Find(info.address+":"+info.port);
        if(!Verify(tc))
        {
            tc = new UDPClient();
            tc.SetUDPInfo(info.address, info.port, this.UDPServer);
            tc.SetIsListener(true);
            tc.SetLogSystem(this.LogSystem);
            UDPSessionMgr.Add(tc.GetID(), tc);
        }
        tc.OnReceiveData(msg, info);
    }

    Send(msg, port, ip)
    {
        var tc = UDPSessionMgr.Find(ip+":"+port);
        if(!Verify(tc))
        {
            tc = new UDPClient();
            tc.SetUDPInfo(info.address, info.port, this.UDPServer);
            tc.SetIsListener(true);
            tc.SetLogSystem(this.LogSystem);
            UDPSessionMgr.Add(tc.GetID(), tc);
        }
        tc.Send(msg);
    }

    OnError(err)
    {
        if(Verify(this.LogSystem))
        {
            this.LogSystem.Log("UDP Service Error: "+JSON.stringify(err));
        }
    }

    SetLogSystem(log)
    {
        delete this.LogSystem;
        
        if(Verify(log))
        {
            this.LogSystem = log;
        }
    }

    Update(ms)
    {
        UDPSessionMgr.Update(ms);
    }
}

exports.UDPListener = UDPListener;