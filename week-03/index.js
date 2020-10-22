import { parseString } from "./ll.js";
import { Multiplicative } from "./token_mul.js";
import { Additive } from "./token_add.js";
import { tokenTypeList } from "./basic_tokens.js";

function makeLiNodeContainsAst(ast) {
  const li = document.createElement("li");
  li.appendChild(makeAstNode(ast));
  return li;
}

function makeDivNodeContainsString(string) {
  const div = document.createElement("div");
  div.innerText = string;
  return div;
}

// return node:
//   <name>
//   - <wrapped>
// or:
//   <name>
//   - <lhs>
//   - <operator>
//   - <rhs>
function makeAstNodeOfOperator(ast, name) {
  const div = document.createElement("div");
  div.appendChild(makeDivNodeContainsString(name));

  const ul = document.createElement("ul");
  div.appendChild(ul);

  if (ast.operator === null) {
    ul.appendChild(makeLiNodeContainsAst(ast.children[0]));
  } else {
    ul.appendChild(makeLiNodeContainsAst(ast.children[0]));
    ul.appendChild(makeLiNodeContainsAst(ast.operator));
    ul.appendChild(makeLiNodeContainsAst(ast.children[1]));
  }

  return div;
}

function makeAstNode(ast) {
  if (ast instanceof Multiplicative) {
    return makeAstNodeOfOperator(ast, Multiplicative.name);
  }

  if (ast instanceof Additive) {
    return makeAstNodeOfOperator(ast, Additive.name);
  }

  for (const BasicTokenType of tokenTypeList) {
    if (ast instanceof BasicTokenType) {
      const div = document.createElement("div");
      return makeDivNodeContainsString(
        BasicTokenType.name + ": " + ast.value.toString()
      );
    }
  }

  console.log(ast);

  return null;
}
function main() {
  const container = document.getElementById("container");

  const string = "12 / 8 * 23 + 9 * 7";
  const [ast, rest] = parseString(string);

  container.appendChild(makeDivNodeContainsString(string));
  container.appendChild(document.createElement("hr"));
  container.appendChild(makeAstNode(ast));
}

main();
