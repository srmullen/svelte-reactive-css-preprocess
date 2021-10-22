svelte-reactive-css-preprocess
==============================

[![npm package](https://img.shields.io/npm/v/svelte-reactive-css-preprocess)](https://www.npmjs.com/package/svelte-reactive-css-preprocess)

Have you ever wished you could use your svelte variables in your component's styles. Now you can!

### Installation

`npm install --save-dev svelte-reactive-css-preprocess`

### Usage

In your svelte config

```javascript
import reactiveCSSPreprocessor from 'svelte-reactive-css-preprocess';

svelte({
  preprocess: [
    reactiveCSSPreprocessor()
  ]
})
```

If you're using [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) you need to run `svelte-reactive-css-preprocess` after all tasks for `svelte-preproccess complete. To do that use ['svelte-sequential-preprocessor'](https://github.com/pchynoweth/svelte-sequential-preprocessor).

`npm install --save-dev svelte-sequential-preprocessor.`

```javascript
import reactiveCSSPreprocessor from 'svelte-reactive-css-preprocess';
import sveltePreprocess from 'svelte-preprocess';
import seqPreprocess from 'svelte-sequential-preprocessor';

svelte({
  preprocess: seqPreprocess([
		sveltePreprocess({
			defaults: {
				style: "postcss",
			},
			postcss: true
		}),
		reactiveCSSPreprocess()
	])
})
```

Now in your component's style you can reference the reactive variables using css variable syntax.

```html
<script>
  // Create some variables that hold information about the component's style.
  export let size = 200;
  export let color = '#f00';

  $: sizepx = `${size}px`;
</script>

<div class="square"></div>

<style>
  .square {
    /* Reference the Svelte variables using the var(--varname) syntax */
    width: var(--sizepx);
    height: var(--sizepx);
    background-color: var(--color);
  }
</style>
```

Now your styles update when your variables do!

### How it works

The preprocessor reads through the variables in each component's script and style tags. If a variable name appears in both the script and styles then a css variables that is scoped to the component is created and added to the `:root` pseudo-selector. In the component the css variables are replaced with the scoped variables. Variable scoping works similarly to how Svelte handles css scoping. The style tag for the above example would end up looking something like this...

```html
<style>
  :root {
    --sizepx-1l2ucck: inherit;
    --color-1l2ucck: inherit;
  }

  .square {
      width: var(--sizepx-1l2ucck);
      height: var(--sizepx-1l2ucck);
      background-color: var(--color-1l2ucck);
  }
</style>
```

In the script tag code is injected that handles updating the scoped css variables using Svelte's reactivity.

Issues
------

* Typescript doesn't work because of the order in which preprocessors are run. All 'markup' preprocessors run before 'script' and 'style', but was relying on 'markup' to be javascript.