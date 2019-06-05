const antlr4 = require("antlr4");
const ECMAScriptLexer = require("./lib/ECMAScriptLexer.js");
const ECMAScriptParser = require("./lib/ECMAScriptParser.js");
const PythonGenerator = require("./codegeneration/PythonGenerator.1");

const input = `
for (i = 0; i < 10; i++) { 
  text += 1
}
`;

/**
 * 
 * 
    for x in fruits:
      print(x)

    for x in range(6):
      print(x)
 */

const chars = new antlr4.InputStream(input);
const lexer = new ECMAScriptLexer.ECMAScriptLexer(chars);

lexer.strictMode = false; // do not use js strictMode

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ECMAScriptParser.ECMAScriptParser(tokens);
const tree = parser.program();
// const tree = parser.expressionSequence();

// console.log(tree.toStringTree(parser.ruleNames));
console.log("JavaScript input:");
console.log(input);
console.log("\n");
const output = new PythonGenerator().start(tree);
console.log("\nPython output:");
console.log("", output);
