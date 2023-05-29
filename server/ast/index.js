const esprima = require("esprima"); //JS语法树模块
const estraverse = require("estraverse"); //JS语法树遍历各节点
const escodegen = require("escodegen"); //JS语法树反编译模块

let jsCode = `var answer = 6 * 7; if(answer == 42){console.log(answer); parseInt(answer)}`;
const AST = esprima.parseScript(jsCode);

// 遍历语法树
function walkIn() {
  estraverse.traverse(AST, {
    enter: (node, parent) => {
      toEqual(node); // 把 == 改为全等 ===
      setParseint(node); // 把parsetInt改为标准用法 parseInt(a)-> parseInt(a,10)
      removeConsoleCall(node, parent, this); // 移除console.log
    },
  });
}

function toEqual(node) {
  if (node.operator === "==") {
    node.operator = "===";
  }
}

function setParseint(node) {
  if (
    node.type === "CallExpression" &&
    node.callee.name === "parseInt" &&
    node.arguments.length === 1
  ) {
    //增加参数其实就是数组操作
    node.arguments.push({
      type: "Literal",
      value: 10,
      raw: "10",
    });
  }
}

function removeConsoleCall(node, parent, that) {
  if (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.name === "console" &&
    node.callee.property.name === "log"
  ) {
    //that.remove();
  }
}

console.log(AST);
walkIn();
const code = escodegen.generate(AST);
console.log(code);
