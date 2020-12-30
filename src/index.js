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

        path.node.openingElement.attributes.forEach(attribute => {
          if (t.isJSXAttribute(attribute) && attribute.name.name === 'className') {
            const classNames = attribute.value.value.trim().split(' ');
            const userDarkClassNamePrefix = classNames.filter(v => v.includes('dark:')).map(v => v.replace(/-.+|dark:/g, ''))

            const filterClassNames = classNames.filter(v => {
              if (v.includes('dark:') || userDarkClassNamePrefix.includes(v.replace(/-.+/, ''))) {
                return false;
              }
              return rawClassNames.includes(v.replace(/.+:/, ''));
            });

            if (filterClassNames.length) {
              const darkClassNames = filterClassNames.map(toDarkClassName).join(' ');
              attribute.value.value += ` ${darkClassNames}`;
            }
          }
        })
      }
    }
  }
}