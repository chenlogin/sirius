/**
 * commonjs 加载 esm 模块
 */

const Koa = require("koa");
const app = new Koa();
const PORT = 3000;

app.use((ctx) => {
  ctx.body = "Hello Koa";
});

import("./test1_esm.mjs").then((res) => {
  console.log(res.default);
  console.log(res.b);
  app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
  });
});
