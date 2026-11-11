# Coffee ratio calculator

A Stencil web component for calculating the ideal coffee - water ratio for several brewing methods.


## Development

```bash
npm install
npm start
```

Run `npm run build` for a production build and `npm test -- --project browser`
for the component tests. The full `npm test` currently also includes an empty
starter unit-test suite, which Vitest reports as a failure.


## Usage

After building or installing the package, import the standalone component:

```js
import 'coffee-ratio-calculator/coffee-calculator';
```

Then add it to your page:

```html
<coffee-calculator></coffee-calculator>
```


## ToDo

Use the @methods to actually feed data to the component. I tried to make this work in this small environment, but couldn't get it to work for now.
Due to limited time, I decided to use the mockdata instead.

Add more props to control filters and allow for more customization.


## AI usage

I used CoPilot to assist me while setting this component up. I used it for:
writing the tests (with all the changing numbers, this gets tedious and time consuming). This sped developing the tests up a lot

Doing some checks: 
 - Do I meet best practices for Stencil.js?
 - Are there any unused imports, unused code or unused styling?
 - Check if the HTML makes sense, semantically and in terms of accessibility.
 