const antlr4 = require("antlr4");
const ECMAScriptLexer = require("./lib/ECMAScriptLexer.js");
const ECMAScriptParser = require("./lib/ECMAScriptParser.js");
const PythonGenerator = require("./codegeneration/PythonGenerator.1");

// const input = `
//   let a,b,c = d
//   var f = 9
//   var g = d
// }
// `;
const input = `
  for(i = 0; i < 2; i++){
    a = i
  }
`;

const chars = new antlr4.InputStream(input);
const lexer = new ECMAScriptLexer.ECMAScriptLexer(chars);

lexer.strictMode = false; // do not use js strictMode

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ECMAScriptParser.ECMAScriptParser(tokens);
const tree = parser.program();
// const tree = parser.expressionSequence();

// console.log(tree.toStringTree(parser.ruleNames));
console.log("\n");
const output = new PythonGenerator().start(tree);
console.log("JavaScript input:");
console.log(input);
console.log("\nPython output:");
console.log("", output);
