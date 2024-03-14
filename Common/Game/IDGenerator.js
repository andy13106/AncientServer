const fs=require('fs');
require('../Base/Util');

const BEGIN_ID = 10000;

//ID生成器
class IDGenerator
{
    constructor()
    {
        this.CurID = BEGIN_ID;
    }

    GetNewID()
    {
        var CurID = this.CurID++;
        this.SaveIDSeek();
        return CurID;
    }

    SaveIDSeek()
    {
        fs.writeFileSync("IDSeek.dat", this.CurID.toString(), 'utf-8');
    }

    LoadIDSeek()
    {
        fs.readFile("IDSeek.dat", 'utf-8', (err, data)=>{
            if(!err)
            {
                this.CurID = parseInt(data);
                if(!this.CurID)
                    this.CurID = BEGIN_ID;
                    
                console.log("Loaded IDSeek: " + data + ", "+this.CurID);
            }
            else
                this.CurID = BEGIN_ID;
        });
    }
}

//使用单例模式
var ThisInstance = null
exports.IDGenerator = function()
{
    if(!Verify(ThisInstance))
        ThisInstance = new IDGenerator();

    return ThisInstance;
}