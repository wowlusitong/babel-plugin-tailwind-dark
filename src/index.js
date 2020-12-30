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
          if (attribute.name.name === 'className') {
            const classNames = attribute.value.value.trim().split(' ');
            const intersection = classNames.filter(v => rawClassNames.includes(v.replace(/.+:/, '')));
            
            if (intersection.length) {
              const darkClassNames = intersection.map(toDarkClassName).join(' ');
              attribute.value.value += ` ${darkClassNames}`;
            }
          }
        })
      }
    }
  }
}