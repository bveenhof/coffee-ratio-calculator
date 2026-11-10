# Coffee ratio calculator

A Stencil web component for calculating starting recipes for filter coffee,
AeroPress, espresso and moka pot. The interface is in Dutch.

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

Alternatively, register the lazy-loaded components with the package loader:

```js
import { defineCustomElements } from 'coffee-ratio-calculator/loader';

defineCustomElements();
```

The demo application's global styles are in [global.css](./global.css), configured
through `globalStyle` in [stencil.config.ts](./stencil.config.ts). Its page
background is dark brown with white text for contrast. Applications embedding
the component should set their own page-level styles.

## Recipes

Choose a brewing method and 1–10 cups. Results are starting points, not
prescriptive recipes; adjust to taste and equipment. Coffee is calculated
from the unrounded total and displayed to at most one decimal place.
All method definitions use the same ratio, for example
`ratio: { coffee: 1, amount: 15 }` for filter coffee. The amount is
water for filter, AeroPress and moka pot, but espresso yield for espresso.
`amountPerCup` specifies the corresponding amount per serving. To calculate
coffee, multiply the total amount by the coffee part of the ratio and divide
by the amount part. For example, 450 ml of filter water corresponds to 30 g
of coffee at 1:15.
Choose mild, normal or strong to use 10% less coffee, the recipe amount, or
10% more coffee, respectively. This changes only the coffee amount; water or
espresso yield stays the same. The displayed ratio reflects the selected
strength, while the table below lists the normal recipe ratios.

| Method | Per cup | Ratio by weight | Grind | Water temperature |
| --- | --- | --- | --- | --- |
| Filter | 230 ml water | 1 g coffee : 15 g water | Medium | 94 °C when brewing |
| AeroPress | 200 ml water | 1 g coffee : 14 g water | Medium-fine | 90 °C when brewing |
| Espresso | 18 g coffee, 36 g espresso yield (a double shot) | 1 g coffee : 2 g espresso yield | Fine | 93 °C machine brew temperature |
| Moka pot | 50 ml water | 1 g coffee : 10 g water | Medium-fine to fine | 90 °C when filling |

Water volumes are approximated as 1 ml per gram. Espresso yield is the
weight in the cup, **not** the water supplied to the machine; machine water
consumption varies. Larger AeroPress recipes may require multiple batches.
Moka pot capacity determines the amount to brew: fill the basket and keep
water below the safety valve rather than treating the calculated amounts as
an instruction to overfill or partially fill a pot.
The moka pot temperature is for the water added to the reservoir, not a
controlled brewing temperature. Use a cloth or oven mitt when handling the
hot reservoir. All temperatures are starting points and can be adjusted to
the coffee and equipment.

The component uses native, labelled radio buttons and a range input, and
announces updated results. When adding styles, retain visible keyboard focus
and sufficient contrast; do not hide the controls from assistive technology.
