## node中间层
- node server/login/login.js
- art-template模版引擎，设置html后缀为模版文件
    - 登录首页 http://localhost:3000/login
- form表单post请求到/api/login
- 设置代理
    - http://localhost:3000/student 会转为 www.baidu.com 请求
    - http-proxy-middleware
    - express-http-proxy
- 设置hosts
    - sudo vim /etc/hosts
    - 127.0.0.1 http://dev.chen.com/
- 登录
    - 获取token
    - 根据token获取验证码
    - 账号+密码+验证码+token获取cookie（后端记录cookie）
    - 前端注入cookie

    