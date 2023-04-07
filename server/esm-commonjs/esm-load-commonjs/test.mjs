/**
 * esm 加载 commonjs 模块
 */

import Koa from "koa";
import router from "./router.js";
const PORT = 3000;
const app = new Koa();

app.use(router.routes(), router.allowedMethods());
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
