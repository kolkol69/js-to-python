const path = require("path");
const ECMAScriptVisitor = require("../lib/ECMAScriptVisitor").ECMAScriptVisitor;

const { SemanticArgumentCountMismatchError } = require(path.resolve(
  "error",
  "helper"
));

/**
 * This Visitor walks the tree generated by parsers and produces Python code
 *
 * @returns {object}
 */
class Visitor extends ECMAScriptVisitor {
  /**
   * Entry point of tree visiting
   *
   * @param {object} ctx
   * @returns {string}
   */
  start(ctx) {
    return this.visitExpressionSequence(ctx);
  }

  /**
   * Visits children of current node
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitChildren(ctx) {
    let code = "";

    for (let i = 0; i < ctx.getChildCount(); i++) {
      // console.log(">>>code", this.visit(ctx.getChild(i)));
      code += this.visit(ctx.getChild(i));
    }

    return code.trim();
  }

  /**
   * Visits a leaf node and returns a string
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitTerminal(ctx) {
    // console.log("visitTerminal");
    return ctx.getText();
  }

  /**
   * Removes quotes from string
   *
   * @param {String} str
   * @returns {String}
   */
  removeQuotes(str) {
    let newStr = str;

    if (
      (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') ||
      (str.charAt(0) === "'" && str.charAt(str.length - 1) === "'")
    ) {
      newStr = str.substr(1, str.length - 2);
    }

    return newStr;
  }

  getMethods(obj) {
    var result = [];
    for (var id in obj) {
      try {
        if (typeof obj[id] == "function") {
          result.push(id);
          // result.push(id + ": " + obj[id].toString());
        }
      } catch (err) {
        result.push(id + ": inaccessible");
      }
    }
    return result;
  }

  /**
   * Visits Property Expression Assignment
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitPropertyExpressionAssignment(ctx) {
    console.log("visitPropertyExpressionAssignment");
    // console.log(ctx.getText()); // Return the text of all tokens in the stream
    // console.log(ctx.getChildCount()); // How many children are there? If there is none, then this node represents a leaf node
    // console.log(ctx.getChild(0).getText()); // console.log(ctx.propertyName().getText()) Property 'x'
    // console.log(ctx.getChild(1).getText()); // ':'
    // console.log(ctx.getChild(2).getText()); // console.log(ctx.f().getText()) Value '1'
    // {x : new Number(1)}
    const key = this.visit(ctx.propertyName()); // ctx.getChild(0)
    const value = this.visit(ctx.singleExpression()); // ctx.getChild(2)
    return `'${key}': ${value}`; // { x : 1}
  }

  /**
   * Visits Function Declaration
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitFunctionExpression(ctx) {
    console.log("visitFunctionExpression");
    // console.log(ctx.children[0], "this.visitChildren(ctx)");
    // console.log(Object.values(ctx), "this.visitChildren(ctx)");
    // console.log(this.visitChildren(ctx), "this.visitChildren(ctx)");

    const functionName = ctx.getChild(1).getText();
    const params = this.visit(ctx.formalParameterList());
    const body = this.visit(ctx.functionBody());

    return `def ${functionName}(${params}):\n\t${body}`;
  }
  /**
   * Visits Formal Parameter List
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitFormalParameterList(ctx) {
    console.log("visitFormalParameterList", ctx.getChild(0).getText());
    return this.visitChildren(ctx);
  }

  /**
   * Visits Function Body
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitFunctionBody(ctx) {
    console.log("visitFunctionBody");
    return this.visitChildren(ctx);
  }

  /**
   * Because Python doesn't need `New`, we can skip the first child
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitNewExpression(ctx) {
    console.log("visitNewExpression");

    return this.visit(ctx.singleExpression());
  }

  /**
   * Visits `Number` Keyword
   *
   * @param {object} ctx
   * @returns {string}
   */
  visitNumberExpression(ctx) {
    // console.log("visitNumberExpression", getMethods(ctx));
    const argumentList = ctx.arguments().argumentList();

    if (argumentList === null || argumentList.getChildCount() !== 1) {
      throw new SemanticArgumentCountMismatchError();
    }

    const arg = argumentList.singleExpression()[0];
    const number = this.removeQuotes(this.visit(arg));

    return `int(${number})`;
  }

  // Visit a parse tree produced by ECMAScriptParser#program.
  visitProgram(ctx) {
    console.log("visitProgram");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#sourceElements.
  visitSourceElements(ctx) {
    console.log("visitSourceElements");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#sourceElement.
  visitSourceElement(ctx) {
    console.log("visitSourceElement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#statement.
  visitStatement(ctx) {
    console.log("visitStatement");
    return `\n\t${this.visitChildren(ctx)}`;
  }

  // Visit a parse tree produced by ECMAScriptParser#block.
  visitBlock(ctx) {
    console.log("visitBlock");
    return `${this.visitStatement(ctx.statementList())}`;
  }

  // Visit a parse tree produced by ECMAScriptParser#statementList.
  visitStatementList(ctx) {
    console.log("visitStatementList");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#variableStatement.
  visitVariableStatement(ctx) {
    console.log("visitVariableStatement");
    return this.visit(ctx.variableDeclarationList());
  }

  // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
  visitVariableDeclarationList(ctx) {
    console.log("visitVariableDeclarationList");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
  visitVariableDeclaration(ctx) {
    console.log("visitVariableDeclaration");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#initialiser.
  visitInitialiser(ctx) {
    console.log("visitInitialiser");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
  visitEmptyStatement(ctx) {
    console.log("visitEmptyStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
  visitExpressionStatement(ctx) {
    console.log("visitExpressionStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ifStatement.
  visitIfStatement(ctx) {
    console.log("visitIfStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx) {
    console.log("visitDoStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx) {
    console.log("visitWhileStatement");
    console.log(ctx.getChild(0).getText());
    console.log(ctx.expressionSequence().getText());
    // console.log(ctx.getChild(1).getText() )
    // console.log(ctx.getChild(3).getText() )
    return `while ${ctx.expressionSequence().getText()}:${this.visit(
      ctx.statement()
    )}
    
    `;
    // return this.visitChildren(ctx);
  }

  parseIfStatement(ctx) {
    let arrResult = [];
    for (let i = 2; i < 7; i += 2) {
      arrResult.push(ctx.getChild(i).getText());
    }
    return arrResult;
  }

  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx) {
    console.log("visitForStatement");
    console.log(this.parseIfStatement(ctx));
    // console.log(ctx.statement().getText());
    // console.log(this.visitFormalParameterList(ctx.getChild()));
    // console.log(ctx.expressionSequence().getText());
    // console.log(this.getMethods(ctx));
    return `${this.visitChildren(ctx.statement())}`;
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
  visitForVarStatement(ctx) {
    console.log("visitForVarStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
  visitForInStatement(ctx) {
    console.log("visitForInStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
  visitForVarInStatement(ctx) {
    console.log("visitForVarInStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#continueStatement.
  visitContinueStatement(ctx) {
    console.log("visitContinueStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#breakStatement.
  visitBreakStatement(ctx) {
    console.log("visitBreakStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#returnStatement.
  visitReturnStatement(ctx) {
    console.log("visitReturnStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#withStatement.
  visitWithStatement(ctx) {
    console.log("visitWithStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#switchStatement.
  visitSwitchStatement(ctx) {
    console.log("visitSwitchStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseBlock.
  visitCaseBlock(ctx) {
    console.log("visitCaseBlock");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClauses.
  visitCaseClauses(ctx) {
    console.log("visitCaseClauses");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClause.
  visitCaseClause(ctx) {
    console.log("visitCaseClause");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#defaultClause.
  visitDefaultClause(ctx) {
    console.log("visitDefaultClause");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
  visitLabelledStatement(ctx) {
    console.log("visitLabelledStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#throwStatement.
  visitThrowStatement(ctx) {
    console.log("visitThrowStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#tryStatement.
  visitTryStatement(ctx) {
    console.log("visitTryStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#catchProduction.
  visitCatchProduction(ctx) {
    console.log("visitCatchProduction");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
  visitFinallyProduction(ctx) {
    console.log("visitFinallyProduction");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
  visitDebuggerStatement(ctx) {
    console.log("visitDebuggerStatement");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
  visitArrayLiteral(ctx) {
    console.log("visitArrayLiteral");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elementList.
  visitElementList(ctx) {
    console.log("visitElementList");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elision.
  visitElision(ctx) {
    console.log("visitElision");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
  visitObjectLiteral(ctx) {
    console.log("visitObjectLiteral");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
  visitPropertyNameAndValueList(ctx) {
    console.log("visitPropertyNameAndValueList");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
  visitPropertyGetter(ctx) {
    console.log("visitPropertyGetter");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
  visitPropertySetter(ctx) {
    console.log("visitPropertySetter");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyName.
  visitPropertyName(ctx) {
    console.log("visitPropertyName");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
  visitPropertySetParameterList(ctx) {
    console.log("visitPropertySetParameterList");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#arguments.
  visitArguments(ctx) {
    console.log("visitArguments");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#argumentList.
  visitArgumentList(ctx) {
    console.log("visitArgumentList");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
  visitExpressionSequence(ctx) {
    console.log("visitExpressionSequence");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
  visitTernaryExpression(ctx) {
    console.log("visitTernaryExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
  visitLogicalAndExpression(ctx) {
    console.log("visitLogicalAndExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
  visitPreIncrementExpression(ctx) {
    console.log("visitPreIncrementExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
  visitObjectLiteralExpression(ctx) {
    console.log("visitObjectLiteralExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#InExpression.
  visitInExpression(ctx) {
    console.log("visitInExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
  visitLogicalOrExpression(ctx) {
    console.log("visitLogicalOrExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#NotExpression.
  visitNotExpression(ctx) {
    console.log("visitNotExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
  visitPreDecreaseExpression(ctx) {
    console.log("visitPreDecreaseExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
  visitArgumentsExpression(ctx) {
    console.log("visitArgumentsExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
  visitThisExpression(ctx) {
    console.log("visitThisExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
  visitUnaryMinusExpression(ctx) {
    console.log("visitUnaryMinusExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
  visitPostDecreaseExpression(ctx) {
    console.log("visitPostDecreaseExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
  visitAssignmentExpression(ctx) {
    console.log("visitAssignmentExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
  visitTypeofExpression(ctx) {
    console.log("visitTypeofExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
  visitInstanceofExpression(ctx) {
    console.log("visitInstanceofExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
  visitUnaryPlusExpression(ctx) {
    console.log("visitUnaryPlusExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
  visitDeleteExpression(ctx) {
    console.log("visitDeleteExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
  visitEqualityExpression(ctx) {
    console.log("visitEqualityExpression");
    // console.log(ctx.getChild(1).getText())
    // return '=='
    // console.log(ctx.getChild(0).getText());
    // console.log(ctx.getChild(1).getText());
    // console.log(ctx.getChild(2).getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
  visitBitXOrExpression(ctx) {
    console.log("visitBitXOrExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
  visitMultiplicativeExpression(ctx) {
    console.log("visitMultiplicativeExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
  visitBitShiftExpression(ctx) {
    console.log("visitBitShiftExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
  visitParenthesizedExpression(ctx) {
    console.log("visitParenthesizedExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
  visitAdditiveExpression(ctx) {
    console.log("visitAdditiveExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
  visitRelationalExpression(ctx) {
    console.log("visitRelationalExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
  visitPostIncrementExpression(ctx) {
    console.log("visitPostIncrementExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
  visitBitNotExpression(ctx) {
    console.log("visitBitNotExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
  visitLiteralExpression(ctx) {
    console.log("visitLiteralExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
  visitArrayLiteralExpression(ctx) {
    console.log("visitArrayLiteralExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
  visitMemberDotExpression(ctx) {
    console.log("visitMemberDotExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx) {
    console.log("visitMemberIndexExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx) {
    console.log("visitIdentifierExpression");
    console.log();
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
  visitBitAndExpression(ctx) {
    console.log("visitBitAndExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
  visitBitOrExpression(ctx) {
    console.log("visitBitOrExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
  visitAssignmentOperatorExpression(ctx) {
    console.log("visitAssignmentOperatorExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
  visitVoidExpression(ctx) {
    console.log("visitVoidExpression");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
  visitAssignmentOperator(ctx) {
    console.log("visitAssignmentOperator");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#literal.
  visitLiteral(ctx) {
    console.log("visitLiteral");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
  visitNumericLiteral(ctx) {
    console.log("visitNumericLiteral");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#identifierName.
  visitIdentifierName(ctx) {
    console.log("visitIdentifierName");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx) {
    console.log("visitReservedWord");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx) {
    console.log("visitKeyword");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
  visitFutureReservedWord(ctx) {
    console.log("visitFutureReservedWord");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#getter.
  visitGetter(ctx) {
    console.log("visitGetter");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#setter.
  visitSetter(ctx) {
    console.log("visitSetter");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eos.
  visitEos(ctx) {
    console.log("visitEos");
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eof.
  visitEof(ctx) {
    console.log("visitEof");
    return this.visitChildren(ctx);
  }
}

module.exports = Visitor;
