/**
 * 启动后端服务，端口3000，node server/interceptor/app.js 
 * 启动前端服务，端口3001，npm run server
 * 启动electron，请求拦截
 * 1、express.static 中间件提供图像、CSS 和 JavaScript 之类的静态文件访问
 * 2、路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成，结构如下： 
 * app.METHOD(path, [callback…], callback)， 
 * app 是 express 对象的一个实例， 
 * METHOD 是一个 HTTP 请求方法， 
 * path 是服务器上的路径， 
 * callback 是当路由匹配时要执行的函数。
 * 3、request
req.app：当callback为外部文件时，用req.app访问express的实例
req.baseUrl：获取路由当前安装的URL路径
req.body / req.cookies：获得「请求主体」/ Cookies
req.fresh / req.stale：判断请求是否还「新鲜」
req.hostname / req.ip：获取主机名和IP地址
req.originalUrl：获取原始请求URL
req.params：获取路由的parameters
req.path：获取请求路径
req.protocol：获取协议类型
req.query：获取URL的查询参数串
req.route：获取当前匹配的路由
req.subdomains：获取子域名
req.accepts()：检查可接受的请求的文档类型
req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages：返回指定字符集的第一个可接受字符编码
req.get()：获取指定的HTTP请求头
req.is()：判断请求头Content-Type的MIME类型
 * 4、response
res.app：同req.app一样
res.append()：追加指定HTTP头
res.set()在res.append()后将重置之前设置的头
res.cookie(name，value [，option])：设置Cookie
opition: domain / expires / httpOnly / maxAge / path / secure / signed
res.clearCookie()：清除Cookie
res.download()：传送指定路径的文件
res.get()：返回指定的HTTP头
res.json()：传送JSON响应
res.jsonp()：传送JSONP响应
res.location()：只设置响应的Location HTTP头，不设置状态码或者close response
res.redirect()：设置响应的Location HTTP头，并且设置状态码302
res.render(view,[locals],callback)：渲染一个view，同时向callback传递渲染后的字符串，如果在渲染过程中有错误发生next(err)将会被自动调用。callback将会被传入一个可能发生的错误以及渲染后的页面，这样就不会自动输出了。
res.send()：传送HTTP响应
res.sendFile(path [，options] [，fn])：传送指定路径的文件 -会自动根据文件extension设定Content-Type
res.set()：设置HTTP头，传入object可以一次设置多个头
res.status()：设置HTTP状态码
res.type()：设置Content-Type的MIME类型
 * 5、中间件（Middleware） 是一个函数，它可以访问
 * 请求对象（request object (req)）, 
 * 响应对象（response object (res)）, 
 * 和 web 应用中处于请求-响应循环流程中的中间件，
 * 一般被命名为 next 的变量。
 * Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。
 * 6、参数获取
 * Get用作数据获取和查询，服务器根据查询请求的参数从数据库或其他地方查询数据，将数据返回给调用者；而查询的参数是在URL上进行的
 * 通过req.query可以获得用户发送的get请求，之后通过查询数据库将相应数据返回给调用者。
 * Post请求则会将数据放入http请求包的请求体中，express 无法直接获取Post请求的参数，需要设置body解析中间件
 * body-parser 模块使用后，将可以用 req.body 得到参数
 * body-parser incoming request bodies in a middleware before your handlers, available under the req.body property.
 * 6、设置，获取 cookie
 * cookie-parser，可以用req.cookies得到参数
*/

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser') 

const app = express()
const port = 3000
const assets = path.join(__dirname + '/assets');
 
//应用级中间件绑定到app对象，提供静态资源访问
app.use('/static', express.static(assets))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))    

// parse application/json  
app.use(bodyParser.json())

app.use(cookieParser())

//设置允许跨域访问该服务
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Credentials",1)
  next(); 
});

//根目录
//http://localhost:3000/?a=12
app.get('/', (request, response, next) => {
  //request 和 response 对象来处理请求和响应的数据
  //request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性
  var header = request.headers;
  console.log("request",{
    Host: header.host,
    cookies: header.cookie,
    cookieParser:request.cookies,//中间件直接获取到对象格式
    ip: request.ip,
    params: request.query,
  });

  //同域，设置cookie
  response.cookie("uid",'1111111');

  //将控制权交给下一个中间件
  next();
  response.end();
})

//接口：http://localhost:3000/home?a=1&b=2
app.get('/home', (req, res, next) => {
  var header = req.headers;
  console.log("IO Request",{
    Host: header.host,
    cookies: header.cookie,
    ip: req.ip,
    params: req.query,
  });
  var params = req.query;
  res.send('Request parameters : ' + JSON.stringify(params));
});

app.post('/about', (req, res) => {
  res.json({message:"post请求传值为" + JSON.stringify(req.body)});
});

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它
app.use('/home/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

//错误处理中间件
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

