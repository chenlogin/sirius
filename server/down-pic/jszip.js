var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');

var config = {
    // 文件根目录
    dir: path.join(__dirname + '/images')
}

/**
 * 把文件打包成zip压缩包
 * @param  [] fileNames 不带文件后缀的文件名
 * @param  {} {delSource = false } = {} 是否删除源文件
 */
function toZip (fileNames, { delSource = false } = {}) {
    var zip = new JSZip();
    var extArr = ['.jpg', '.png','.js'];

    extArr.forEach(ext => {
        fileNames.forEach(fileName =>{
            let file = fileName + ext;
            console.log(file)
            if(isExist(file)){
                let content = getFileContent(file);
                zip.file(file, content);
            } 
        })
    });
    // 压缩
    zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        let zip = 'images.zip';
        // 写入磁盘
        fs.writeFile(getFullFileName(zip), content, function (err) {
            if (!err) {
                // 是否删除源文件
                if (delSource) {
                    extArr.forEach(ext => {
                        fileNames.forEach(fileName =>{
                            delFile(fileName + ext);
                        })
                        
                    })
                }
            } else {
                console.log(zip + '压缩失败');
            }
        });
    });
}

/**
 * 判断文件是否存在
 * @param {*} fileName 
 * @returns 
 */

function isExist(fileName){
    
    return fs.existsSync(getFullFileName(fileName));
}

/**
 * 获取文件内容
 * @param  {string} fileName 文件名 file.mtl
 */
function getFileContent (fileName) {
　　 // 指定encoding会返回一个string，否则返回一个Buffer
    //let content = fs.readFileSync(getFullFileName(fileName),{ encoding: "binary"});    
    let content = fs.readFileSync(getFullFileName(fileName));
    console.log(content)

    return content;
}

/**
 * 获取完整文件路径
 * @param  {string} fileName 文件名 file.mtl
 */
function getFullFileName (fileName) {
    return path.join(config.dir, fileName);
}

/**
 * 删除文件
 * @param  {string} fileName 文件名 file.mtl
 */
function delFile (fileName) {
    fs.unlink(getFullFileName(fileName), function (err) {
        if (!!err) {
            console.log('删除文件失败：' + file);
        }
    });
}

exports.toZip = toZip;