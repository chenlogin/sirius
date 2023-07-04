const { SourceMapConsumer } = require("source-map");
const fs = require("fs");

const rawSourceMap = fs.readFileSync(
  "./dist/AboutPage.83e03bdc.js.map",
  "utf-8"
);

// 填入错误信息
originalPositionFor("AboutPage.83e03bdc.js:1:11871");

function originalPositionFor(errInfo) {
  const [budleName, line, column] = errInfo.split(":");

  SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
    const originalPosition = consumer.originalPositionFor({
      source: budleName,
      line: parseInt(line),
      column: parseInt(column),
    });

    console.log("bundle name = ", budleName);
    console.log("original position = ", originalPosition);
  });
}
