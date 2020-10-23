import { parseString } from "./ll";
import { Multiplicative } from "./token_mul";
import { Additive } from "./token_add";
import { tokenTypeList, Error as TokenError } from "./basic_tokens";
import { noReactCreateElement, render } from "./noreact";

function makeAstNodeOfOperator(ast, name) {
  if (ast.operator === null) {
    return makeAstNode(ast.children[0]);
  }

  const children = ast.children.map((child) => <li>{makeAstNode(child)}</li>);

  return (
    <div>
      {name}: {makeAstNode(ast.operator)}
      <ul>{children}</ul>
    </div>
  );
}

function makeAstNode(ast) {
  if (ast.typeIs(Multiplicative)) {
    return makeAstNodeOfOperator(ast, Multiplicative.name);
  }

  if (ast.typeIs(Additive)) {
    return makeAstNodeOfOperator(ast, Additive.name);
  }

  for (const BasicTokenType of tokenTypeList) {
    if (ast.typeIs(BasicTokenType)) {
      return ast.tokenName + ": " + ast.value;
    }
  }

  if (ast.typeIs(TokenError)) {
    return ast.tokenName + ": " + ast.value;
  }

  console.error("unexpected token", ast);
  return JSON.stringify(ast);
}

function main() {
  const string = "12 / 8 * 23 + 9 * 7";
  const [ast, rest] = parseString(string);

  render(
    <div>
      <p>{string}</p>
      <hr />
      {makeAstNode(ast)}
    </div>,
    document.getElementById("container")
  );
}

main();
