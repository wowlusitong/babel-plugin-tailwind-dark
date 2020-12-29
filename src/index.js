export default function({types: t}) {
  return {
    visitor: {
      JSXElement(path, source) {
        const dark = source.opts.dark || {};
        path.node.openingElement.attributes.forEach(attribute => {
          if (attribute.name.name === 'className') {
            const classNames = attribute.value.value.trim().split(' ');
            const darkClassNames = Object.keys(dark).filter(v => classNames.includes(v)).map(v => `dark:${dark[v]}`).join(' ');
            attribute.value.value += ` ${darkClassNames}`;
          }
        })
      }
    }
  }
}