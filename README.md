# Custom Element Lifecycle Element

This `<custom-element-lifecycle>` element is purely to demonstrate when different points in a custom element’s lifecycle occur. [View the demo](https://knowler.github.io/custom-element-lifecycle-element/demo), open the console, and watch the log.

## Defining

You can define it the standard way or use the static `define()` method:

```javascript
import { CustomElementLifecycleElement } from "https://esm.sh/gh/knowler/custom-element-lifecycle-element/custom-element-lifecycle-element.js?raw";

CustomElementLifecycleElement.define();
```

## Usage
Just add the element to the page. It visually doesn’t do anything. It’s mainly valuable to watch in the console. Try adding attributes to it, moving it into a form, etc.

```html
<custom-element-lifecycle></custom-element-lifecycle>
```
