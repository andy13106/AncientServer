//常用工具函数
(function(){
    //校验数据是否为空或未定义
    Verify = function(value)
    {
        if(null == value || typeof(value) == 'undefined')
        {
            return false;
        }
        return true;
    }

    //校验邮箱地址是否合法
    VerifyEmail = function(str)
    {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		return reg.test(str)
    }

    //校验密码是否符合规范
    VerifyPassword = function(str)
	{
		var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
		return reg.test(str);
	}

    // 判断一个对象是否为空
	IsEmptyObject = function(obj)
	{
		for ( var i in obj) 
		{
			return false;
		}
		return true;
	};
	
	//判断一个对象是否为字符串
	IsString = function(obj)
	{
		return typeof obj === 'string' && Object.prototype.toString.call(obj) === '[object String]';
	};
	
	//判断一个对象是否为数字
	IsNumber = function(obj)
	{
		return typeof obj === 'number' && Object.prototype.toString.call(obj) === '[object Number]';
	};
	
	//判断一个对象是否为布尔值
	IsBoolean = function(obj)
	{
		return typeof obj === 'boolean' && Object.prototype.toString.call(obj) === '[object Boolean]';
	};

	// 判断给定的时间是否属于今天,beginTime,为一天的开始时间,默认为0点
    TimeIsToday = function(time, beginTime = 0)
    {
        var now = new Date;
        var hour = now.getHours();
        if(hour < beginTime)
        {
            hour += 24 - beginTime;
        }
        else
        {
            hour -= beginTime;
        }
        var minute = now.getMinutes();
		var second = now.getSeconds();
		var ms = now.getMilliseconds();
		var value = ms + second * 1000 + minute * 60 * 1000 + hour * 60 * 60 * 1000;
		return (now.getTime() - time) < value;
    }

    //获取范围内的随机数
    GetRandom = function(start, end)
    {
        return start + Math.random() * (end - start);
    }

    //获取范围内的随机整数
    GetRandomInt = function(start, end)
    {
        return Math.floor(GetRandom(start, end))
    }

    //休眠函数
    Sleep = function(ms)
	{
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
	}

    //判断两个浮点数是否相等
    DoublesEqual = function(d1, d2)
	{
		var preciseness = 1e-13;
		return Math.abs(d1-d2) < preciseness;
	}

    //判断两个时间是否为同一周, 周一为每周第一天
	IsSameWeek = function(old, now)
	{
		var oneDay = 1000 * 60 * 60 * 24;
		var oldday = parseInt(old.getTime() / oneDay);
		var nowday = parseInt(now.getTime() / oneDay);
		return parseInt((oldday + 4) / 7) == parseInt((nowday + 4) / 7);
	}

    //用指定间隔符号隔开的时间的字符串
	GetTimeStringByDate = function(date, sign)
	{
		var str = "";
		str = date.getSeconds() + str;
		str = date.getMinutes() + sign + str;
		str = date.getHours() + sign + str;
		return str;
	}
	
    //用指定间隔符号隔开的日期字符串
	GetDateStringByDate = function(date, sign)
	{
		var str = "";
		str = date.getDate() + str;
		str = (date.getMonth() + 1) + sign + str;
		str = date.getFullYear() + sign + str;
		return str;
	}
})();