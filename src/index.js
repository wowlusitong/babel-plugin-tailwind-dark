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

        path.node.openingElement.attributes.forEach(attribute => {
          if (t.isJSXAttribute(attribute) && attribute.name.name === 'className') {
            switch (attribute.value.type) {
              case 'JSXExpressionContainer': 
                attribute.value.expression.quasis.forEach(node => {
                  node.value.cooked = `${transformClassNames(node.value.cooked)} ${node.value.cooked}`
                })
              break;
              case 'StringLiteral': 
                attribute.value.value += ` ${transformClassNames(attribute.value.value)}`;
              break;
            }
          }
        })
      }
    }
  }
}