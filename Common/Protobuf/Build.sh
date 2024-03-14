#Protobuf代码生成脚本
#先生成对应的JS脚本
protoc  MessageID.proto --js_out=import_style=commonjs:.
protoc  ServerPKG.proto --js_out=import_style=commonjs:.
protoc  LobbyMessage.proto --js_out=import_style=commonjs:.



#再生成对应的C#脚本供客户端使用
protoc MessageID.proto --csharp_out=.
protoc LobbyMessage.proto --csharp_out=.