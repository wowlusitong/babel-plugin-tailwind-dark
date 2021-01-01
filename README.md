# babel-plugin-tailwind-dark

A Babel plugin to add custom dark class when compiling your code using Babel.

### Usage

Install the plugin first:
```sh
npm install babel-plugin-tailwind-dark --save-dev
```
Add plugin in your .babelrc with the custom dark option:

```json
{
  "plugins": [
    ["tailwind-dark", {
      "dark": {
        "bg-white": "bg-gray-800",
        "text-gray-900": "text-white"
      }
    }]
  ]
}
```

[Enable dark mode in tailwind](https://tailwindcss.com/docs/dark-mode)


### Example

[Example repo](https://github.com/wowlusitong/babel-plugin-tailwind-dark-example)

Transforms
```js
<div className="bg-white">
  <h1 className="text-gray-900">Dark mode is here!</h1>
</div>
```
to
```js
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">Dark mode is here!</h1>
</div>
```

### Production

If purge is enabled, you need add dark classnames to the [safelist](https://purgecss.com/safelisting.html#specific-selectors)

```js
// tailwind.config.js
module.exports = {
  purge: {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: ['dark:bg-gray-800', 'dark:text-white'],
    }
  },
}
```

### Requirements

- [tailwind 2](https://tailwindcss.com/docs/dark-mode)
- [React](https://reactjs.org/)

