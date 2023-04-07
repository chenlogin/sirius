- 1、CommonJs加载ESM
  - CommonJS模块加载js文件的过程是运行时加载的，并且是同步的
ES Module加载js文件的过程是编译(解析)时加载的，并且是异步的
  - 可以使用import函数
  - node server/esm-commonjs/commonjs-load-esm/test1.js
  ```
  import('./test.mjs').then(res => {
    console.log(res.default)
  })
  ```
- 2、ESM 加载CommonJs ：
  - 可以直接引用
  - node server/esm-commonjs/esm-load-commonjs/test.mjs 

https://rambo-panda.notion.site/package-json-9949fff87d054bb9a838f3690c1496d4#9dabfa65ca19480dacdbf7e8b77db368