const express = require("express");
const path = require("path");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser"); //接收 post请求参数
const template = require("art-template");
const proxy = require("express-http-proxy");

const app = express();
const port = 3000;
var captchaToken = "";

app.engine("html", require("express-art-template"));
app.set("views", path.join(__dirname));
app.set("view engine", "html");

// 解析提交的from表单参数
let urlencodedParser = bodyParser.urlencoded({ extended: false });

//http://localhost:3000/student 会转为 www.baidu.com 请求
app.use("/student", proxy("www.baidu.com"));

//创建路由
//http://localhost:3000/login
app.get("/login", (req, res, next) => {
  //获取token
  request(
    "https://www.xxx.net/user/normal/captcha_token.vpage",
    (err, response, data) => {
      /* response 响应信息的集合 */
      if (!err && response.statusCode == 200) {
        captchaToken = JSON.parse(data).captchaToken;
        //模版渲染
        res.render("login", {
          t: moment(new Date()).valueOf(),
          token: captchaToken,
        });
      }
    }
  );
});

//登录接口
app.post("/api/login", urlencodedParser, (req, res, next) => {
  let { j_username, j_password, code } = req.body;

  var turnToParam = function (obj) {
    let str = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key) === true) {
        str.push(`${key}=${obj[key]}`);
      }
    }
    return str.join("&");
  };

  request(
    {
      url: "https://www.xxx.net/user/normal/login.vpage",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: turnToParam({
        userToken: j_username,
        smsCode: "",
        password: j_password,
        userType: "3",
        captchaToken: captchaToken,
        captchaCode: code,
      }),
    },
    function (error, response, data) {
      var tpl = `<html><head><meta charset="utf-8"></head><body>
                  <h2>{{msg}}:</h2>
                  <p>{{headers[0]}}</p>
                  <p>{{headers[1]}}</p>
                  <p>{{headers[2]}}</p>
                  </body></html>`;
      if (!error && response.statusCode == 200) {
        //res.redirect("/home?msg=登录成功")
        res.end(
          template.render(tpl, {
            msg: "登录成功",
            headers: response.headers["set-cookie"] || [0, 1, 2],
          })
        );
      } else {
        res.send(JSON.stringify(data));
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
