/**
 * router.js
 * 路由回调函数单独抽出,不在router中操作业务逻辑，方便维护
 */
const Router = require("koa-router");
const router = new Router();

router.get("/user", (ctx, next) => {
  ctx.body = {
    code: 200,
    message: "接口访问成功",
  };
  next();
});

module.exports = router;
