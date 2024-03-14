const net = require('net');
const { CallBack } = require('../Base/CallBack');
const EventCenter = require('../Base/EventCenter').EventCenter();
const TCPSessionManager = require('./TCPSessionManager').TCPSessionManager();
const { TCPClient } = require('./TCPClient');


//TCP监听（服务端）
class TCPListener
{
    constructor()
    {
        this.TcpServer = null;
        this.LogSystem = null;
    }

    //开始监听
    StartListen(ip, port)
    {
        this.TcpServer = net.createServer();
        this.TcpServer.listen(port, ip);

        if(Verify(this.LogSystem))
        {
            this.LogSystem.Log("Server Listening on " + ip + ":" + port);
        }

        var OnConnection = new CallBack(this, "OnConnection");
        var OnReceiveData = new CallBack(this, "OnReceiveData");
        var OnDisConnect = new CallBack(this, "OnDisConnect");

        this.TcpServer.on('connection', (sock)=>{
            OnConnection.Execute(sock);

            sock.on('data', (data)=>{
                OnReceiveData.Execute(sock, data);
            });

            sock.on('close', (data)=>{
                OnDisConnect.Execute(sock, data);
            });
        });
    }

    OnConnection(sock)
    {
        var tc = new TCPClient();
        tc.SetClient(sock);
        tc.SetIsListener(true);
        tc.IP = sock.remoteAddress;
        tc.Port = sock.remotePort;
        tc.SetID(sock.remoteAddress+":"+sock.remotePort);
        TCPSessionManager.Add(tc.GetID(), tc);
        tc.OnConnect();
        if(Verify(this.LogSystem))
        {
            tc.SetLogSystem(this.LogSystem);
            this.LogSystem.Log("NewConnection: " + tc.GetID());
        }
        EventCenter.RaiseEvent("NewTCPConnection", tc);
    }

    OnReceiveData(sock, data)
    {
        var tc = TCPSessionManager.Find(sock._peername.address+":"+sock._peername.port);
        if(Verify(tc))
        {
            tc.OnReceiveData(data);
        }
    }

    OnDisConnect(sock, data)
    {
        var tc = TCPSessionManager.Find(sock._peername.address+":"+sock._peername.port);
        if(Verify(tc))
        {
            tc.OnClose(data);
            EventCenter.RaiseEvent("DisTCPConnection", tc);
            TCPSessionManager.Remove(tc.GetID());
        }
    }

    Close()
    {
        TCPSessionManager.Clear();
        this.TcpServer.close();
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
        TCPSessionManager.Update(ms);
    }
}

exports.TCPListener = TCPListener;