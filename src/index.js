const { parse, walk } = require('svelte/compiler');

function intersection(arrA, arrB) {
  let _intersection = [];
  for (let elem of arrB) {
      if (arrA.includes(elem)) {
          _intersection.push(elem);
      }
  }
  return _intersection;
}

// https://github.com/sveltejs/svelte/blob/master/src/compiler/compile/utils/hash.ts
function hash(str) {
	str = str.replace(/\r/g, '');
	let hash = 5381;
	let i = str.length;

	while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
	return (hash >>> 0).toString(36);
}

function toCSSVariables(vars) {
  let out = '';
  for (let name of vars.variables) {
    out += `--${name}-${vars.hash}: inherit;\n`;
  }
  return out;
}

function createVariableUpdaters(vars) {
  let out = '';
  for (let name of vars.variables) {
    out += `$: if (document) {
  const r = document.querySelector(':root');
  r.style.setProperty('--${name}-${vars.hash}', ${name});
}\n`;
  }
  return out;
}

module.exports = function cssUpdatePreprocessor() {
  const files = {};

  return {
    markup: ({ content, filename }) => {
      const ast = parse(content);

      const scriptVars = [];
      const styleVars = [];

      const nodeTypes = ['Script', 'Program', 'ExportNamedDeclaration', 'LabeledStatement', 'VariableDeclaration', 'VariableDeclarator'];

      walk(ast.instance, {
        enter(node) {
          if (!nodeTypes.includes(node.type)) {
            this.skip();
          }

          if (node.type === 'VariableDeclarator') {
            scriptVars.push(node.id.name);
          }

          // handle `$: myvar = 'something'` syntax
          if (node.type === 'ExpressionStatement') {
            walk(node.expression, {
              enter(node) {
                if (['AssignmentExpression'].includes(node.type)) {
                  if (node.left.type === 'Identifier') {
                    scriptVars.push(node.left.name);
                  }

                  this.skip();
                }
              }
            });
          }
        }
      });

      walk(ast.css, {
        enter(node) {
          if (node.type === 'Function' && node.name === 'var') {
            // substr to remove leading '--'
            styleVars.push(node.children[0].name.substr(2));
          }
        }
      });

      // Find variables that are referenced in the css vars and set them in the files object.
      const variables = intersection(scriptVars, styleVars);
      if (variables.length) {
        files[filename] = {
          variables,
          hash: hash(filename)
        }
      }
    },
    script: ({ content, filename }) => {
      if (!files[filename]) {
        return;
      }

      // insert style updaters
      const code = content + createVariableUpdaters(files[filename]);
      return {
        code
      };
    },
    style: ({ content, filename }) => {
      if (!files[filename]) {
        return;
      }

      const file = files[filename];

      // add hash to variables
      let code = content;
    
      for (let name of file.variables) {
        const re = new RegExp(`var\\(\\s*--${name}\\s*\\)`, 'g');
        code = code.replace(re, `var(--${name}-${file.hash})`);
      }

      // insert style variables
      let varsDeclaration = `:root {\n${toCSSVariables(files[filename])}}\n`;

      code = varsDeclaration + code;
      return {
        code
      };
    }
  }
}