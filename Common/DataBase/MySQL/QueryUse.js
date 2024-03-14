const { QueryBase } = require("./QueryBase");
require('../../Base/Util')
//加载数据库
class QueryUse extends QueryBase
{
    constructor(db)
    {
        super();
        this.SQLString = null;
        this.SetDateBaseName(db);
    }

    SetDateBaseName(db)
    {
        if(Verify(db))
        {
            this.SQLString = "Use " + db;
        }
    }
}

exports.QueryUse = QueryUse;