export default function({types: t}) {
  return {
    visitor: {
      JSXElement(path, source) {
        const dark = source.opts.dark || {};
        const rawClassNames = Object.keys(dark);

        function toDarkClassName(value) {
          if (value.includes(':')) {
            const [variants, className] = value.split(/:(?=[^:]+$)/);
            return `${variants}:dark:${dark[className]}`;
          }
          return `dark:${dark[value]}`
        }

        function transformClassNames(value) {
          const classNames = value.split(' ');
          const userDarkClassNamePrefix = classNames.filter(v => v.includes('dark:')).map(v => v.replace(/-.+|dark:/g, ''))
          const filterClassNames = classNames.filter(v => {
            if (v.includes('dark:') || userDarkClassNamePrefix.includes(v.replace(/-.+/, ''))) {
              return false;
            }
            return rawClassNames.includes(v.replace(/.+:/, ''));
          });
          if (filterClassNames.length) {
            const darkClassNames = filterClassNames.map(toDarkClassName).join(' ');
            return darkClassNames;
          }
          return '';
        }

        function transform(node) {
          switch (node.type) {
            case 'JSXExpressionContainer':
              transform(node.expression)
              break;
            case 'StringLiteral':
              node.value += ` ${transformClassNames(node.value)}`;
              break;
            case 'BinaryExpression':
              const { left, right } = node;
              transform(left);
              transform(right);
              break;
            case 'TemplateLiteral':
              node.quasis.forEach(v => transform(v))
              break;
            case 'TemplateElement':
              node.value.cooked = ` ${transformClassNames(node.value.cooked)} ${node.value.cooked}`
              break;
          }
        }

        path.node.openingElement.attributes.forEach(attribute => {
          if (t.isJSXAttribute(attribute) && attribute.name.name === 'className') {
            transform(attribute.value)
          }
        });
      }
    }
  }
}