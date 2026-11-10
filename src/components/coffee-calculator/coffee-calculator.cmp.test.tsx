import { render, h, describe, it, expect } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

describe('coffee-calculator', () => {
  it('renders the default filter recipe with accessible controls', async () => {
    const { root } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const value = shadow.querySelector('#cups-value')!;

    expect(shadow.querySelector('fieldset legend')?.textContent).toContain('bereidingswijze');
    expect(shadow.querySelectorAll('input[name="brew-method"]')).toHaveLength(4);
    expect(shadow.querySelectorAll('input[name="coffee-strength"]')).toHaveLength(3);
    expect(shadow.querySelector<HTMLInputElement>('input[value="filter"]')?.checked).toBe(true);
    expect(shadow.querySelector<HTMLInputElement>('input[name="coffee-strength"][value="normal"]')?.checked).toBe(true);
    expect(shadow.querySelector('#cups-label')?.textContent).toContain('Aantal kopjes');
    expect(value.textContent).toBe('2 kopjes');
    expect(shadow.querySelector('.results')?.textContent).toContain('460 ml');
    expect(shadow.querySelector('.results')?.textContent).toContain('30,7 g');
    expect(shadow.querySelector('.results')?.textContent).toContain('1 : 15');
    expect(shadow.querySelector('.results')?.getAttribute('aria-live')).toBe('polite');
  });

  it('updates all method recipes and quantities', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const value = shadow.querySelector('#cups-value')!;
    const inc = shadow.querySelector<HTMLButtonElement>('#cups-increase')!;
    const dec = shadow.querySelector<HTMLButtonElement>('#cups-decrease')!;

    dec.click();
    await waitForChanges();
    expect(value.textContent).toBe('1 kopje');
    expect(shadow.querySelector('.results')?.textContent).toContain('230 ml');
    expect(shadow.querySelector('.results')?.textContent).toContain('15,3 g');

    const cases = [
      { id: 'aeropress', expected: ['200 ml', '14,3 g', '1 : 14', 'Middelfijn', 'meerdere batches'] },
      { id: 'espresso', expected: ['18 g', '36 g', '1 : 2', 'Fijn', 'water die de machine gebruikt verschilt'] },
      { id: 'moka-pot', expected: ['50 ml', '5 g', '1 : 10', 'veiligheidsventiel'] },
    ];

    for (const recipe of cases) {
      shadow.querySelector<HTMLInputElement>(`input[value="${recipe.id}"]`)!.click();
      await waitForChanges();
      const results = shadow.querySelector('.results')!.textContent!;
      for (const text of recipe.expected) expect(results).toContain(text);
      if (recipe.id === 'espresso') {
        expect(results).not.toContain(' ml');
        expect(results).toContain('Espresso-opbrengst');
        expect(results).toContain('Verhouding koffie : espresso-opbrengst1 : 2');
        expect(results).not.toContain('Verhouding koffie : water');
      } else {
        expect(results).toContain('Verhouding koffie : water');
      }
    }

    for (let i = 0; i < 8; i++) inc.click();
    await waitForChanges();
    expect(value.textContent).toBe('10 kopjes');
    expect(shadow.querySelector('.results')?.textContent).toContain('500 ml');
    expect(shadow.querySelector('.results')?.textContent).toContain('50 g');
  });

  it('adjusts coffee by strength while keeping water or yield unchanged', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const cases = [
      { id: 'filter', amountLabel: 'Water', amount: '230 ml', coffee: ['13,8 g', '15,3 g', '16,9 g'], ratios: ['1 : 16,7', '1 : 15', '1 : 13,6'] },
      { id: 'aeropress', amountLabel: 'Water', amount: '200 ml', coffee: ['12,9 g', '14,3 g', '15,7 g'], ratios: ['1 : 15,6', '1 : 14', '1 : 12,7'] },
      { id: 'espresso', amountLabel: 'Espresso-opbrengst', amount: '36 g', coffee: ['16,2 g', '18 g', '19,8 g'], ratios: ['1 : 2,2', '1 : 2', '1 : 1,8'] },
      { id: 'moka-pot', amountLabel: 'Water', amount: '50 ml', coffee: ['4,5 g', '5 g', '5,5 g'], ratios: ['1 : 11,1', '1 : 10', '1 : 9,1'] },
    ];
    const strengths = ['mild', 'normal', 'strong'];

    for (const recipe of cases) {
      shadow.querySelector<HTMLInputElement>(`input[name="brew-method"][value="${recipe.id}"]`)!.click();
      await waitForChanges();

      for (let index = 0; index < strengths.length; index++) {
        shadow.querySelector<HTMLInputElement>(`input[name="coffee-strength"][value="${strengths[index]}"]`)!.click();
        await waitForChanges();
        const entries = Array.from(shadow.querySelectorAll('.results dt'));
        const valueFor = (label: string) => entries.find(entry => entry.textContent === label)?.nextElementSibling?.textContent;
        expect(valueFor('Koffie')).toBe(recipe.coffee[index]);
        expect(valueFor(recipe.amountLabel)).toBe(recipe.amount);
        expect(valueFor(`Verhouding koffie : ${recipe.id === 'espresso' ? 'espresso-opbrengst' : 'water'}`)).toBe(recipe.ratios[index]);
      }
    }
  });

  it('keeps multiple calculators independent', async () => {
    const first = await render(<coffee-calculator />);
    const second = await render(<coffee-calculator />);
    first.root.shadowRoot!.querySelector<HTMLInputElement>('input[value="espresso"]')!.click();
    await first.waitForChanges();
    expect(first.root.shadowRoot!.querySelector<HTMLInputElement>('input[value="espresso"]')!.checked).toBe(true);
    expect(second.root.shadowRoot!.querySelector<HTMLInputElement>('input[value="filter"]')!.checked).toBe(true);
  });

  it('updates the water temperature for each method and keeps it when cups change', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const cases = [
      { id: 'filter', label: 'Watertemperatuur bij zetten', temperature: '94 °C' },
      { id: 'aeropress', label: 'Watertemperatuur bij zetten', temperature: '90 °C' },
      { id: 'espresso', label: 'Watertemperatuur van de machine bij zetten', temperature: '93 °C' },
      { id: 'moka-pot', label: 'Watertemperatuur bij vullen', temperature: '90 °C' },
    ];

    for (const recipe of cases) {
      shadow.querySelector<HTMLInputElement>(`input[value="${recipe.id}"]`)!.click();
      await waitForChanges();
      const entries = Array.from(shadow.querySelectorAll('.results dt'));
      expect(entries.find(entry => entry.textContent === recipe.label)?.nextElementSibling?.textContent).toBe(recipe.temperature);
    }

    const inc = shadow.querySelector<HTMLButtonElement>('#cups-increase')!;
    for (let i = 0; i < 8; i++) inc.click();
    await waitForChanges();
    expect(shadow.querySelector('.results')?.textContent).toContain('Watertemperatuur bij vullen90 °C');
    expect(shadow.querySelector('.results')?.textContent).toContain('ovenwant');
  });

  it('scales each method from the unrounded ratio at ten cups', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const inc = shadow.querySelector<HTMLButtonElement>('#cups-increase')!;
    for (let i = 0; i < 8; i++) inc.click();
    await waitForChanges();

    const cases = [
      { id: 'filter', coffee: '153,3 g', result: '2.300 ml', label: 'Water' },
      { id: 'aeropress', coffee: '142,9 g', result: '2.000 ml', label: 'Water' },
      { id: 'espresso', coffee: '180 g', result: '360 g', label: 'Espresso-opbrengst' },
      { id: 'moka-pot', coffee: '50 g', result: '500 ml', label: 'Water' },
    ];
    for (const recipe of cases) {
      shadow.querySelector<HTMLInputElement>(`input[value="${recipe.id}"]`)!.click();
      await waitForChanges();
      const entries = Array.from(shadow.querySelectorAll('.results dt'));
      const valueFor = (label: string) => entries.find(entry => entry.textContent === label)?.nextElementSibling?.textContent;
      expect(valueFor('Koffie')).toBe(recipe.coffee);
      expect(valueFor(recipe.label)).toBe(recipe.result);
    }
  });

  it('supports keyboard selection and quantity adjustment', async () => {
    const { root, waitForChanges } = await render(<coffee-calculator />);
    const shadow = root.shadowRoot!;
    const filter = shadow.querySelector<HTMLInputElement>('input[value="filter"]')!;
    const aeropress = shadow.querySelector<HTMLInputElement>('input[value="aeropress"]')!;
    const value = shadow.querySelector('#cups-value')!;
    const inc = shadow.querySelector<HTMLButtonElement>('#cups-increase')!;

    filter.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    expect(aeropress.checked).toBe(true);
    expect(shadow.querySelector('.results')?.textContent).toContain('400 ml');

    inc.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(value.textContent).toBe('3 kopjes');
    expect(shadow.querySelector('.results')?.textContent).toContain('600 ml');
  });
});
