require('../Protobuf/MessageID_pb')
require('../Protobuf/ServerPKG_pb')
require('../Protobuf/LobbyMessage_pb')

//网络封包列表
var PKGMap = {};

//注册封包类型
PKGMap[proto.PKGTypeID.PKG_SERVER_STATE] = proto.ServerPKG.ServerState;

PKGMap[proto.PKGTypeID.PKG_SERVER_GAME_ROOM_INFO] = proto.ServerPKG.GameRoomInfo;
PKGMap[proto.PKGTypeID.PKG_SERVER_NOTIFY_USER_JOIN_GAME] = proto.ServerPKG.NotifyUserJoinGame;


PKGMap[proto.PKGTypeID.PKG_GAME_VERSION] = proto.ClientPKG.GameVersion;
PKGMap[proto.PKGTypeID.PKG_GAME_ERROR] = proto.ClientPKG.GameError;
PKGMap[proto.PKGTypeID.PKG_GATE_SERVER_LIST] = proto.ClientPKG.GateServerList;
PKGMap[proto.PKGTypeID.PKG_GAME_LOGIN] = proto.ClientPKG.LoginGame;
PKGMap[proto.PKGTypeID.PKG_GAME_ACCOUNT_INFO] = proto.ClientPKG.AccountInfo;


//编码函数，修改封包格式时可在这里修改
exports.Serialize = function(pkg)
{
    //直接使用Protobuf编码
    return pkg.serializeBinary();
}

//解码函数，修改封包格式时可在这里修改
exports.DeSerialize = function(type, buf)
{
    //直接使用Protobuf编码
    if(Verify(PKGMap[type]))
        return PKGMap[type].deserializeBinary(buf);

    return null;
}