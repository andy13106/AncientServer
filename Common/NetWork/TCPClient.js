const net = require('net');
const { CallBack } = require('../Base/CallBack');
const EventCenter = require('../Base/EventCenter').EventCenter();
const { Serialize, DeSerialize } = require('./NetPacket');

//TCP客户端类
class TCPClient
{
    constructor()
    {
        this.TcpClient = null;
        this.LogService = null;
        this.ID = null;
        this.bConnected = false;
        this.bListener = false;
        //接收缓冲区4K
        this.Buffer = Buffer.alloc(1024 * 4, 0);
        this.BufferOffest = 0;
        this.IP = null;
        this.Port = null;

    }

    SetIsListener(b)
    {
        this.bListener = b;
    }

    Connected()
    {
        return this.bConnected;
    }

    OnConnect()
    {
        this.bConnected = true;
        var EventName = this.bListener ? "ListenerConnect" : "TcpClientConnect";
        EventCenter.RaiseEvent(EventName, this);
    }

    GetID()
    {
        return this.ID;
    }

    SetID(id)
    {
        this.ID = id;
    }

    //处理收到的封包，断包粘包处理
    OnReceiveData(data)
    {
        if(!Buffer.isBuffer(data))
            return;
        
        //超出缓冲区大小时扩充缓冲区
        if(data.length + this.BufferOffest > this.Buffer.length)
        {
            const newBuff = Buffer.alloc(data.length + this.BufferOffest);
            this.Buffer.copy(newBuff, 0, 0, this.BufferOffest);
            this.Buffer = newBuff;
        }
        
        data.copy(this.Buffer, this.BufferOffest, 0, data.length);
        this.BufferOffest += data.length;

        //当前指针位置大于最小封包长度才能说明可能最少收到了一个封包
        while(this.BufferOffest > 8)
        {
            //包头四个字节大小
            const head = Buffer.alloc(4,0);
            this.Buffer.copy(head, 0, 0, 4);
            //获取封包实际长度
            const len = head.readInt32LE();
            if(this.BufferOffest < len + 8)
            {
                //封包未接收完
                //delete head;
                break;
            }
            this.Buffer.copy(head, 0, 4, 8);
            const PKGID = head.readInt32LE();

            const Body = Buffer.alloc(len, 0);
            this.Buffer.copy(Body, 0, 8, len + 8);
            this.Buffer.copy(this.Buffer, 0, len + 8, this.BufferOffest);
            this.BufferOffest -= len + 8;

            var pkg = DeSerialize(PKGID, Body);
            if(Verify(pkg))
            {
                if(Verify(this.LogService))
                    this.LogService.Log("Receive Data From "+this.ID, pkg);

                EventCenter.RaiseEvent(PKGID, pkg, this);

                var EventName = this.bListener?"ReceiveDateFromTCPListener":"ReceiveDateFromTCP";
                EventCenter.RaiseEvent(EventName, pkg, this, PKGID);
            }

            //delete Body;
            //delete head;
            //delete pkg;
        }
    }

    OnClose()
    {
        this.bConnected = false;
        if(Verify(this.LogService))
        {
            this.LogService.Log("DisConnection: "+this.ID);
        }

        var EventName = this.bListener ? "ListenerClientDisConnect" : "TcpClientDisConnect";
	    EventCenter.RaiseEvent(EventName, this);

        this.Release();
    }

    Release()
    {
        this.TcpClient.end();
    }

    //发送数据包
    Send(tp, pkg)
    {
        if(Verify(pkg) && Verify(this.TcpClient))
        {
            var buf = Serialize(pkg);
            const head = Buffer.alloc(8, 0);
            head.writeInt32LE(buf.length, 0);
            head.writeInt32LE(tp, 4);
            this.TcpClient.write(head);
            this.TcpClient.write(buf);
            if(Verify(this.LogService))
            {
                this.LogService.Log("Send Data to "+this.ID, pkg);
            }
            //delete head;
            //delete buf;
            //delete pkg;
        }
    }

    SetClient(sock)
    {
        if(Verify(sock))
        {
            this.TcpClient = sock;
        }
    }

    //连接到服务器
    Connect(ip, port)
    {
        this.TcpClient = new net.Socket();
        
        var OnConnect = new CallBack(this, "OnConnect");
        var OnReceiveData = new CallBack(this, "OnReceiveData");
        var OnClose = new CallBack(this, "OnClose");

        this.IP = ip;
        this.Port = port;

        this.TcpClient.connect(port, ip, ()=>{
            OnConnect.Execute();
        });

        this.TcpClient.on('data', (data)=>{
            OnReceiveData.Execute(data);
        });

        this.TcpClient.on('close', ()=>{
            OnClose.Execute();
        });

        if(Verify(this.LogService))
        {
            this.LogService.Log("Connect To " + this.ID);
        }
    }

    SetLogSystem(log)
    {
        delete this.LogService;
        if(Verify(log))
            this.LogService = log;
    }
}

exports.TCPClient = TCPClient;