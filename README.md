# proto+
Proto+ (aka protoplus) is a module that expands JavaScript's prototype definitions, global helper functions and others.

# How to use
## In Web JS or HTML:
Append this code to the end of your HTML file:

```html
<script
  src="https://raw.githubusercontent.com/ccjit/protoplus/refs/heads/main/protoplus.js"
  type="module"
></script>
```

or alternatively,

append this code to the top of your JavaScript file:

```js
(()=>{
  // proto+ load script
  const script = document.createElement('script');
  script.src = "https://raw.githubusercontent.com/ccjit/protoplus/refs/heads/main/protoplus.js";
  script.type = "module";
  document.body.appendChild(script);
})();
```

## In NodeJS
Run one of these in your terminal:

`npm install git+https://github.com/ccjit/protoplus.git`

`yarn add ccjit/protoplus`

then add this code to the top of your script file:
```js
import { protoplus } from 'protoplus';
```
