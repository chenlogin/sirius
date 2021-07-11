//依赖模块
var fs = require('fs');
var request = require("request");
var mkdirp = require('mkdirp');
var path = require('path');
var jszip = require('./jszip');

//本地存储目录
var dir = path.join(__dirname + '/images');

//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

// 图片下载地址,这个地址如果没有，可以换成spiderPic.js操作
var urlArr = [
    'https://dimg11.c-ctrip.com/images/020691200082co240B8EA_R_300_120.jpg',
    'https://dimg11.c-ctrip.com/images/200b0u000000jf06k79E1_R_300_120.jpg',
    'https://unpkg.com/axios@0.21.1/dist/axios.min.js'
];

// 主要方法，用于下载文件
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};

urlArr.map(function(val, index) {
    var name = val.match(/\/([^/]*)$/)[1];
    download(val, dir, name);
});

//图片打包
jszip.toZip(["axios.min","bd_logo"]);