const dgram = require('dgram');
const { CallBack } = require('../Base/CallBack');
const { DeSerialize, Serialize } = require('./NetPacket');
const UDPSessionMgr = require('./UDPSessionMgr').UDPSessionMgr();
const EventCenter = require('../Base/EventCenter').EventCenter();


//UDP客户端
class UDPClient
{
    constructor()
    {
        this.UDPSocket = null;
        this.ID = null;
        this.bListener = false;
        this.LogService = null;
        this.IP = null;
        this.Port = null;
        //无网络封包计时
        this.FreeTime = 0;

        //增加UDP传送可靠性
        this.SendID = 0;        //当前已经发送过的封包计数
        this.ReceiveID = 0;     //已经收到客户端的封包计数
        this.SendPKGList=[];    //未确认客户端已收到的封包列表
    }

    SetIsListener(b)
    {
        this.bListener = b;
    }

    GetID()
    {
        return this.ID;
    }

    SetID(id)
    {
        this.ID = id;
    }

    OnReceiveData(data, info)
    {
        if(Verify(info) && !Verify(this.ID))
        {
            this.IP = info.address;
            this.Port = info.port;

            this.ID = this.IP+":"+this.Port;
        }


        this.FreeTime = 0;
        //收包解码
        if(!Buffer.isBuffer(data))
            return;

        const len = data.length;

        if(len >= 12)
        {
            //包头12个字节大小
            const head = Buffer.alloc(12,0);
            data.copy(head, 0, 0, 12);
            //获取客户端发送封包计数
            const csendid = head.readUint32LE();
            //获取客户端当前已确认收到的封包计数
            const creceiveid = head.readUint32LE(4);

            if(this.ProcessPKGID(csendid, creceiveid))
            {
                //获取封包实际类型
                const PKGID = head.readInt32LE(8);

                const Body = Buffer.alloc(len - 12, 0);
                data.copy(Body, 0, 12, len);

                var pkg = DeSerialize(PKGID, Body);
                if(Verify(pkg))
                {
                    if(Verify(this.LogService))
                        this.LogService.Log("Receive Data From "+this.ID, pkg);

                    EventCenter.RaiseEvent(PKGID, pkg, this);

                    var EventName = this.bListener?"ReceiveDateFromUDPListener":"ReceiveDateFromUDP";

                    EventCenter.RaiseEvent(EventName, pkg, this, PKGID);
                }
            }
        }
        //delete Body;
        //delete head;
        //delete pkg;
    }

    //底层处理UDP丢包和乱序问题
    ProcessPKGID(csendid, creceiveid)
    {
        if(csendid == 0 && creceiveid < this.SendID)//csendid为0时表示客户端申请重发包
        {
            let n = this.SendID - creceiveid;
            
            if(this.SendPKGList.length != n)
            {
                console.log(">>>>>>>>>>>>>>>>>>>出错了！");
                return false;
            }

            for(let i=0; i <n; ++i)
            {
                var data = this.SendPKGList[i];
                this.UDPSocket.send(data, this.Port, this.IP);
            }
            return false;
        }

        if(csendid <= this.ReceiveID)//已经收到过的包直接丢弃
            return false;

        if(csendid > this.ReceiveID + 1)//中间有丢包需要让客户端重新发包
        {
            const data = Buffer.alloc(12, 0);
            data.writeUInt32LE(0, 0);//第一个整数为0表示要求重发包
            data.writeUint32LE(this.ReceiveID, 4);
            data.writeInt32LE(0,8);//封包凑足12字节
            this.UDPSocket.send(data, this.Port, this.IP);

            return false;
        }

        let n = this.SendID - creceiveid;
        if(n > 0 && this.SendPKGList.length != n)
        {
            console.log("》》》》》》》》》》》》》》》》出错了！");
            return false;
        }
        this.SendPKGList.shift();
        
        this.ReceiveID = csendid;

        return true;
    }

    Close()
    {
        this.bConnected = false;
        if(Verify(this.LogService))
        {
            this.LogService.Log("DisConnection: "+this.ID);
        }

        var EventName = this.bListener ? "ListenerClientDisConnect" : "UdpClientDisConnect";
	    EventCenter.RaiseEvent(EventName, this);
        UDPSessionMgr.Remove(this.ID);
    }

    //发送数据包
    Send(tp, pkg)
    {
        if(Verify(pkg))
        {
            this.FreeTime = 0;

            var buf = Serialize(pkg);
            const data = Buffer.alloc(buf.length+12, 0);
            data.writeUint32LE(++this.SendID, 0);
            data.writeUint32LE(this.ReceiveID, 4);
            data.writeInt32LE(tp, 8);
            data.fill(buf, 12);

            this.UDPSocket.send(data, this.Port, this.IP);
            if(Verify(this.LogService))
            {
                this.LogService.Log("Send Data to "+this.ID, pkg);
            }
            
            this.SendPKGList.push(data);
        }
    }

    SetUDPSocket(sock)
    {
        if(Verify(sock))
        {
            this.UDPSocket = sock;
        }
    }

    SetUDPInfo(ip, port, sock=null)
    {
        this.IP = ip;
        this.Port = port;
        this.ID = this.IP+":"+this.Port;

        if(!Verify(sock))
        {
            this.UDPSocket = dgram.createSocket('udp4');
            
            var OnReceiveData = new CallBack(this, 'OnReceiveData');
            this.UDPSocket.on('message', (data, info)=>{
                OnReceiveData.Execute(this, "OnReceiveData");
            });
        }
        else
        {
            this.SetUDPSocket(sock);
        }
    }

    SetLogSystem(log)
    {
        delete this.LogService;
        if(Verify(log))
            this.LogService = log;
    }

    //心跳函数，超过一定时间没有工作则认为断线
    Update(ms)
    {
        this.FreeTime += ms;
        if(this.FreeTime > 5*60*1000)//5分钟没有交互认为断线
        {
            UDPSessionMgr.Remove(this.ID);
        }
    }
}

exports.UDPClient = UDPClient;