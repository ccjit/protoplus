# proto+
Proto+ (aka protoplus) is an ESM module that expands JavaScript's prototype definitions, global helper functions and others.

**Note: This module is currently ESM-only. Using `require` or similar won't work. A CommonJS version is coming soon.**

# How to use
## In browsers via HTML or JS:

### Via HTML
```html
<script
  src="https://cdn.jsdelivr.net/gh/ccjit/protoplus@main/protoplus.js"
  type="module"
></script>
```

### Via JS
```js
(()=>{
  // import proto+

  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/gh/ccjit/protoplus@main/protoplus.js";
  script.type = "module";
  document.head.appendChild(script);
})();
```

## In Node.js, Bun, or front-end frameworks like React/Next.js:
Install proto+ (if you haven't already):

```shell
npm install git+https://github.com/ccjit/protoplus.git
```

or alternatively, use `yarn`:
```shell
yarn add ccjit/protoplus
```

then add this code to the top of your script file:
```js
import { protoplus } from 'protoplus';
```

## In Deno
Add this code to the top of your script file:
```js
import { protoplus } from 'https://cdn.jsdelivr.net/gh/ccjit/protoplus@main/protoplus.js';
```


# How to use proto+
After importing the script to your project, you can use `protoplus.expand()` to expand prototypes and others, and `protoplus.contract()` to restore them to their default/previous value.
It's recommended to run `protoplus.expand()` after the import statement (if you're using proto+ in a browser and imported it via HTML, run `protoplus.expand()` at the top of your script file).

You can also use `protoplus.expand({ skipClasses: true })` to only expand prototypes and global helpers.
