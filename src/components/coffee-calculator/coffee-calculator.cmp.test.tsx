import { render, h, describe, it, expect } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { methods } from './mock-data';

describe('coffee-calculator', () => {
  it('The coffee calculator component loads and renders correctly', async () => {
    const { root } = await render(<coffee-calculator />);

    expect(root.tagName.toLowerCase()).toBe('coffee-calculator');
    expect(root.shadowRoot?.querySelector('h2')?.textContent).toContain('Koffie-waterverhouding');
  });

  it('shows cup button focus for keyboard but not mouse interaction', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const increase = shadow.querySelector<HTMLButtonElement>('#cups-increase')!;

    await userEvent.keyboard('{Tab}{Tab}');
    expect(shadow.activeElement).toBe(increase);
    expect(increase.matches(':focus-visible')).toBe(true);
    expect(getComputedStyle(increase).outlineWidth).toBe('3px');

    await userEvent.click(shadow.querySelector('h2')!);
    await userEvent.click(increase);
    await waitForChanges();
    expect(shadow.activeElement).toBe(increase);
    expect(increase.matches(':focus-visible')).toBe(false);
    expect(getComputedStyle(increase).outlineStyle).toBe('none');
  });

  it('renders the default filter recipe with controls', async () => {
    const { root } = await render(<coffee-calculator methods={methods} />);
    const shadow = root.shadowRoot!;
    const value = shadow.querySelector('#coffee-calculator__cups-value')!;

    expect(shadow.querySelector('fieldset legend')?.textContent).toContain('bereidingswijze');
    expect(shadow.querySelectorAll('input[name="brew-method"]')).toHaveLength(4);
    expect(shadow.querySelectorAll('input[name="coffee-strength"]')).toHaveLength(3);
    expect(shadow.querySelector<HTMLInputElement>('input[value="filter"]')?.checked).toBe(true);
    expect(shadow.querySelector<HTMLInputElement>('input[name="coffee-strength"][value="normal"]')?.checked).toBe(true);
    expect(shadow.querySelector('#cups-label')?.textContent).toContain('Aantal kopjes');
    expect(value.textContent).toBe('1 kopje');
  });

  it('supports keyboard selection and quantity adjustment', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator methods={methods} />);
    const shadow = root.shadowRoot!;
    const filter = shadow.querySelector<HTMLInputElement>('input[value="filter"]')!;
    const aeropress = shadow.querySelector<HTMLInputElement>('input[value="aeropress"]')!;
    const value = shadow.querySelector('#coffee-calculator__cups-value')!;
    const inc = shadow.querySelector<HTMLButtonElement>('#cups-increase')!;

    filter.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    expect(aeropress.checked).toBe(true);
    expect(shadow.querySelector('.coffee-calculator__results')?.textContent).toContain('230 ml');

    inc.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(value.textContent).toBe('2 kopjes');
    expect(shadow.querySelector('.coffee-calculator__results')?.textContent).toContain('460 ml');
  });
});
