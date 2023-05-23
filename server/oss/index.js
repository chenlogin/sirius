/**
 * oss 上传
 * 权限
 * https://help.aliyun.com/document_detail/32077.html?spm=a2c4g.609898.0.0.5c9b1ae5dBlBut
 *
 * 文件上传，put，multipartUpload
 * https://help.aliyun.com/document_detail/32072.html?spm=a2c4g.111265.0.0.5cf43faeamrSpK
 *
 * 列举文件，list
 * https://help.aliyun.com/document_detail/111389.html
 *
 * 图片处理
 * https://help.aliyun.com/document_detail/50039.html?spm=a2c4g.111389.0.0.575c27ed8nqbxh
 */
let OSS = require("ali-oss");

let client = new OSS({
  // 填写Bucket所在地域
  region: "oss-cn-beijing",
  // Bucket名称
  bucket: "17zy-pcclient",
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。
  // 强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）
  accessKeyId: "yourAccessKeyId",
  accessKeySecret: "yourAccessKeySecret",
  // 从STS服务获取的安全令牌（SecurityToken）。
  // stsToken: "",
  // refreshSTSToken: "",
  // 刷新临时访问凭证的时间间隔，单位为毫秒。
  // refreshSTSTokenInterval: 600000,
});

/**
 * list返回结果
 * [{
    name: 'mars/',
    url: 'http://17zy-pcclient.oss-cn-beijing.aliyuncs.com/mars/',
    lastModified: '2021-12-15T07:10:00.000Z',
    etag: '"xxxx"',
    type: 'Normal',
    size: 0,
    storageClass: 'Standard',
    owner: { id: 'xxx', displayName: 'xxx' }
  },{}]
 * 
 */
async function list() {
  // 不带任何参数，默认最多返回100个文件。
  let result = await client.list({
    "max-keys": 10,
    prefix: "mars/",
  });
  console.log(result.objects);
}

list();
