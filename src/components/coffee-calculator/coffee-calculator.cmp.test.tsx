import { render, h, describe, it, expect } from '@stencil/vitest';

describe('coffee-calculator', () => {
  it('renders', async () => {
    const { root } = await render(<coffee-calculator></coffee-calculator>);
    await expect(root).toEqualHtml(`
      <coffee-calculator class="hydrated">
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </coffee-calculator>
    `);
  });

  it('renders with values', async () => {
    const { root } = await render(
      <coffee-calculator first="Stencil" middle="'Don't call me a framework'" last="JS"></coffee-calculator>,
    );
    await expect(root).toEqualHtml(`
      <coffee-calculator class="hydrated">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </coffee-calculator>
    `);
  });
});
