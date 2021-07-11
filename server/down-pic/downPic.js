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

/**
 * 流 是一种抽象的概念，文件的传输就像水流一样，通过 管道 一点一点的传向目的地。
 * 流的背后，是一个又一个的 缓冲区，提前为数据做好了准备。
 * 
 * fs模块，用它读取过文件。它的做法是把数据一次性读取到内存中，
 * 如果写入是一次性把内存中的数据写入到磁盘。如果我们读取的文件非常小，那这样做是没有问题，
 * 但是如果是大容量的文件 10G，甚至更大，那么这种模型就很有问题了。
 * 而 Stream 的理念是 边读边取，用这种 IO 方式就破解了上面的难题，节省空间和时间。
 * 
 * 管道是 Unix 的核心思想之一，读取 a.txt 的内容，写入到 b.txt
 * var fs = require('fs')
 * var rs = fs.createReadStream('a.txt') // 输出流
 * var ws = fs.createWriteStream('b.txt') // 输入流
 * rs.pipe(ws) // 输出通过管道流向输入
 * 
 * 标准Http协议支持六种请求方法，即：GET、POST、PUT、Delete、HEAD、Options
 * 1，GET：它本质就是发送一个请求来取得服务器上的某一资源。资源通过一组HTTP头和呈现据（如HTML文本，或者图片或者视频等）返回给客户端。GET请求中，永远不会包含呈现数据。
 * 2，HEAD：HEAD和GET本质是一样的，区别在于HEAD不含有呈现数据，而仅仅是HTTP头信息。有的人可能觉得这个方法没什么用，其实不是这样的。想象一个业务情景：欲判断某个资源是否存在，我们通常使用GET，但这里用HEAD则意义更加明确。
 * 3，PUT：这个方法比较少见。HTML表单也不支持这个。本质上来讲， PUT和POST极为相似，都是向服务器发送数据，但它们之间有一个重要区别，PUT通常指定了资源的存放位置，而POST则没有，POST的数据存放位置由服务器自己决定。
 * 4，DELETE：删除某一个资源。基本上这个也很少见。
 * 5，POST：向服务器提交数据。这个方法用途广泛，几乎目前所有的提交操作都是靠这个完成。
 * 6，OPTIONS：它用于获取当前URL所支持的方法。若请求成功，则它会在HTTP头中包含一个名为“Allow”的头，值是所支持的方法，如“GET, POST”。
*/
// 主要方法，用于下载文件
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};

urlArr.map(function(val, index) {
    //匹配文件名
    var name = val.match(/\/([^/]*)$/)[1];
    download(val, dir, name);
});

//图片打包
jszip.toZip(["axios.min","bd_logo"]);