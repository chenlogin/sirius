## node 中间层

- node server/login/login.js
- art-template 模版引擎，设置 html 后缀为模版文件
  - 登录首页 http://localhost:3000/login
- form 表单 post 请求到/api/login
- 设置代理
  - http://localhost:3000/student 会转为 www.baidu.com 请求
  - http-proxy-middleware
  - express-http-proxy
- 设置 hosts
  - sudo vim /etc/hosts
  - 127.0.0.1 http://dev.chen.com/
- 登录
  - 获取 token
  - 根据 token 获取验证码
  - 账号+密码+验证码+token 获取 cookie（后端记录 cookie）
  - 前端注入 cookie
