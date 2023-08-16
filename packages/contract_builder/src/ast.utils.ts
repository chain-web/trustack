import type {
  BlockStatement,
  CallExpression,
  ClassProperty,
  ExportDeclaration,
  Expression,
  ExpressionStatement,
  Program,
  Span,
} from '@swc/core';

export const BUILDER_NAMES = {
  MAIN_PACKAGE: 'skchain',
  CONSTRUCTOR_METHOD: '__constructor__',
  CONTRACT_CLASS_NAME: '__contract_class_name__',
};

export const walkTop = (ast: Program): Program => {
  // 处理import
  ast.body.forEach((topNode, i) => {
    if (topNode.type === 'ImportDeclaration') {
      if (topNode.source.value === BUILDER_NAMES.MAIN_PACKAGE) {
        // remove import
        ast.body[i] = {
          type: 'EmptyStatement',
          span: topNode.span,
        };
      }
    }
  });

  // remove export
  // ast.body = ast.body.map((topNode, i) => {
  //   if (
  //     ['ExportDeclaration', 'ExportDefaultDeclaration'].includes(topNode.type)
  //   ) {
  //     // remove export
  //     return (topNode as ExportDeclaration).declaration;
  //   }
  //   return topNode;
  // });

  // 除super之外的constructor逻辑
  const constructorExpressionStatements: ExpressionStatement[] = [];
  ast.body = ast.body.map((topNode, i) => {
    if (topNode.type === 'ClassDeclaration') {
      topNode.identifier.value = BUILDER_NAMES.CONTRACT_CLASS_NAME;
      topNode.body = topNode.body.map((classNode) => {
        if (classNode.type === 'Constructor') {
          // chnage constructor to __constructor
          // 将super()与其他逻辑分离
          while (
            classNode.body?.stmts.length &&
            classNode.body?.stmts.length > 1
          ) {
            if (
              classNode.body.stmts[classNode.body.stmts.length - 1].type ===
              'ExpressionStatement'
            ) {
              if (!isSuperBlock(classNode.body)) {
                const exp = classNode.body.stmts.pop();
                if (exp) {
                  // must use unshift,保证代码顺序
                  constructorExpressionStatements.unshift(
                    exp as ExpressionStatement,
                  );
                }
              }
            }
          }
        }
        return classNode;
      });
      const replacedConstructor: ClassProperty = {
        type: 'ClassProperty',
        key: {
          type: 'Identifier',
          span: emptySpan(),
          value: BUILDER_NAMES.CONSTRUCTOR_METHOD,
          optional: false,
        },
        value: {
          type: 'ArrowFunctionExpression',
          span: emptySpan(),
          params: [],
          body: {
            type: 'BlockStatement',
            span: emptySpan(),
            stmts: constructorExpressionStatements,
          },
          async: false,
          generator: false,
        },
        span: emptySpan(),
        isStatic: false,
        decorators: [],
        accessibility: 'public',
        isAbstract: false,
        isOptional: false,
        isOverride: false,
        readonly: false,
        declare: false,
        definite: false,
      };
      topNode.body.push(replacedConstructor);
    }
    return topNode;
  });
  return ast;
};

export const isSuperBlock = (body: BlockStatement): boolean => {
  const exp = body.stmts[body.stmts.length - 1];
  if (
    (exp as ExpressionStatement).expression.type === 'CallExpression' &&
    ((exp as ExpressionStatement).expression as Expression).type ===
      'CallExpression' &&
    ((exp as ExpressionStatement).expression as Expression as CallExpression)
      .callee.type === 'Super'
  ) {
    return true;
  }
  return false;
};

export const emptySpan = (): Span => {
  return { start: 0, end: 0, ctxt: 0 };
};
