//依赖模块
var fs = require('fs');
var request = require("request");
//为服务器特别定制的，快速、灵活、实施的jQuery核心实现
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var path = require('path');

//目标网址
var url = 'https://www.baidu.com/';
var headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39'};

//本地存储目录
var dir = path.join(__dirname + '/images');

//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

//发送请求
request(url,headers, function(error, response, body) {
    var $ = cheerio.load(body);
    $('img').each(function() {
        var src = $(this).attr('src');
        if(src && src.indexOf('bd_logo.png') > -1) {
            
            src=src.substr(0,4).toLowerCase()=="https"?src:"https:"+src;
            download(src, dir, "bd_logo.png");     
        }
    });
});

//下载方法
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};