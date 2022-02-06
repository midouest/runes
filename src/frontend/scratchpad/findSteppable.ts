import * as luaparse from "luaparse";

export type Steppable = luaparse.NumericLiteral | luaparse.UnaryExpression;

export function findSteppable(
  ast: luaparse.Chunk,
  line: number,
  column: number
): Steppable | null {
  const visitor = new FindVisitor(line, column);
  return visitor.find(ast);
}

class FindVisitor {
  constructor(private _line: number, private _column: number) {}

  find(node: luaparse.Node): Steppable | null {
    if (!this._containsNode(node)) {
      return null;
    }

    if (node.type === "NumericLiteral") {
      return node;
    }

    if (
      node.type === "UnaryExpression" &&
      node.operator === "-" &&
      node.argument.type === "NumericLiteral"
    ) {
      return node;
    }

    switch (node.type) {
      case "ReturnStatement":
        return this.findMany(node.arguments);

      case "IfStatement":
        return this.findMany(node.clauses);

      case "IfClause":
      case "ElseifClause":
      case "WhileStatement":
      case "RepeatStatement":
        return this.find(node.condition) ?? this.findMany(node.body);

      case "ElseClause":
      case "DoStatement":
      case "FunctionDeclaration":
      case "Chunk":
        return this.findMany(node.body);

      case "LocalStatement":
      case "AssignmentStatement":
        return this.findMany(node.init);

      case "CallStatement":
        return this.find(node.expression);

      case "ForNumericStatement":
        return (
          this.find(node.start) ??
          this.find(node.end) ??
          (node.step ? this.find(node.step) : null) ??
          this.findMany(node.body)
        );

      case "ForGenericStatement":
        return this.findMany(node.iterators) ?? this.findMany(node.body);

      case "TableKey":
        return this.find(node.key) ?? this.find(node.value);

      case "TableKeyString":
      case "TableValue":
        return this.find(node.value);

      case "TableConstructorExpression":
        return this.findMany(node.fields);

      case "UnaryExpression":
        return this.find(node.argument);

      case "BinaryExpression":
      case "LogicalExpression":
        return this.find(node.left) ?? this.find(node.right);

      case "MemberExpression":
        return this.find(node.base);

      case "IndexExpression":
        return this.find(node.base) ?? this.find(node.index);

      case "CallExpression":
        return this.find(node.base) ?? this.findMany(node.arguments);

      case "TableCallExpression":
        return this.find(node.base) ?? this.find(node.arguments);

      case "StringCallExpression":
        return this.find(node.base) ?? this.find(node.argument);

      default:
        return null;
    }
  }

  findMany(nodes: luaparse.Node[]): Steppable | null {
    for (const node of nodes) {
      const found = this.find(node);
      if (found !== null) {
        return found;
      }
    }
    return null;
  }

  private _containsNode(node: luaparse.Node): boolean {
    if (!node.loc) {
      return false;
    }

    if (
      node.loc.start.line === this._line &&
      node.loc.end.line === this._line
    ) {
      return (
        node.loc.start.column <= this._column - 1 &&
        node.loc.end.column >= this._column - 1
      );
    }

    return node.loc.start.line <= this._line && node.loc.end.line >= this._line;
  }
}
