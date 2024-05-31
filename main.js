const esprima = require("esprima");

const fs = require("fs");

const file = fs.readFileSync("./lib/server.js", "utf8");

const isExecutableNode = (node) => {
  return [
    "VariableDeclaration",
    "ExpressionStatement",
    "ReturnStatement",
    "IfStatement",
    "WhileStatement",
    "DoWhileStatement",
    "FunctionDeclaration",
    "SwitchStatement",
    "ThrowStatement",
    "TryStatement",
    "CatchClause",
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
    "BreakStatement",
    "ContinueStatement",
  ].includes(node.type);
};

const isIterationStatement = (node) => {
  return [
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
    "WhileStatement",
    "DoWhileStatement",
  ].includes(node.type);
};

const ast = esprima.parseModule(file, { comment: true, tolerant: true });

let lloc = 0;
const traverseAst = (node) => {
  if (isExecutableNode(node)) {
    lloc++;
  }

  if (isIterationStatement(node)) {
    traverseAst(node.body);
  } else {
    for (let key in node) {
      if (node[key] && typeof node[key] === "object") {
        traverseAst(node[key]);
      }
    }
  }
};

traverseAst(ast);

console.log({
  comments: ast.comments.length,
  lloc,
  ploc: file.split("\n").length,
});
