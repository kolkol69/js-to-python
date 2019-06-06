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
for(var i = 0; i < 4; i++){
  a = i
  a = i
  a = i
  c = a
  if(lol){
    to=lol
  }
  if(a){
    b=a
    b=a
    b=a
    while(true){
      c = 'lol'
      c = 'chyba'
      c = 'dziala'
    }
  }
  
}
`;

`
  ===== python =====
  if a: 
    b = a
    z = 'lol'
    if b:
      c = d
  ===== js =====
  if(a){
    b = a
    z = 'lol'
    if(b){
      c = d
    }
  }

  ===== python =====
  if a: 
    b = a
    z = 'lol'
  if b:
    c = d
  ===== js =====
  if(a){
    b = a
    z = 'lol'
  }
  if(b){
    c = d
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
