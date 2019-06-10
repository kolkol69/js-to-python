const antlr4 = require("antlr4");
const ECMAScriptLexer = require("./lib/ECMAScriptLexer.js");
const ECMAScriptParser = require("./lib/ECMAScriptParser.js");
const PythonGenerator = require("./codegeneration/PythonGenerator");

const input = `


// function showCaseFunction(params){
//   for(var i = 0; i < 4; i++){
//     b = i
//     c += i
//     let gg = 0;
//     if(gg > 10){
//       to=gg + 1
//     }
//     if(gg > 100){
//       b = gg + a
//       c = a * 10 / gg
//       while(gg != 10){
//         gg--
//         var g = gg - b;
//         c = 'dziala'
//       }
//     }
//   }
// }
//
try {
    nonExistingFunction()
} catch(error) {
    var a = 5
} finally {
    return false
}
`;

const chars = new antlr4.InputStream(input);
const lexer = new ECMAScriptLexer.ECMAScriptLexer(chars);

lexer.strictMode = false; // do not use js strictMode

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ECMAScriptParser.ECMAScriptParser(tokens);
const tree = parser.program();

const output = new PythonGenerator().start(tree);
console.log("\n\n\n\n\n\n\n\n\n\JavaScript input:");
console.log(input);
console.log("\nPython output:");
console.log("", output);
