# JS to Python compiler using ANTLR4

## Setup

1. Install java, for mac run: `brew cask install java`
2. Install antlr4 referring to the [tutorial](https:*tomassetti.me/antlr-mega-tutorial/#setup-antlr)
3. After installing **antlr4** run: `antlr4 -Dlanguage=JavaScript -lib grammars -o lib -visitor -Xexact-output-dir grammars/ECMAScript.g40`
4. your grammar is in _**grammars**_ folder and inside your **_lib_** you can find:

- ECMAScriptLexer.js splits a source code character stream into a token stream according to the rules specified in the grammar.
- ECMAScriptParser.js generates an abstract connected tree structure (i.e. parse tree) from the token stream.
- ECMAScriptVisitor.js is responsible for traversing the generated tree. Technically, we could manually process the tree by depth-first recursive traversal of children. However, if we have a large number of node types and complex processing logic, it is preferable to visit each node type using its special predefined method, as visitor does.

---
