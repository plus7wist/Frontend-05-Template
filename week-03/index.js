import { parseString } from "./ll";
import { Multiplicative } from "./token_mul";
import { Additive } from "./token_add";
import { tokenTypeList } from "./basic_tokens";
import { noReactCreateElement, render } from "./noreact";

function makeAstNodeOfOperator(ast, name) {
  let children = [];

  if (ast.operator === null) {
    children = [makeAstNode(ast.children[0])];
  } else {
    children = [ast.children[0], ast.operator, ast.children[1]].map(
      makeAstNode
    );
  }
  children = children.map((child) => <li>{child}</li>);

  return (
    <div>
      {name}
      <ul> {children} </ul>
    </div>
  );
}

function makeAstNode(ast) {
  if (ast.isInstanceOf(Multiplicative)) {
    return makeAstNodeOfOperator(ast, Multiplicative.name);
  }

  if (ast.isInstanceOf(Additive)) {
    return makeAstNodeOfOperator(ast, Additive.name);
  }

  for (const BasicTokenType of tokenTypeList) {
    if (ast.isInstanceOf(BasicTokenType)) {
      return ast.name + ": " + ast.value;
    }
  }

  console.error('unexpected token', ast);
  return "ParseError";
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
