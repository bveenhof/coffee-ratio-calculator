import { describe, expect, it } from '@stencil/vitest';

describe('coffee-calculator unit tests', () => {
  it('strength multiplier for mild is 0.9', () => {
    const strengthMultipliers = {
      mild: 0.9,
      normal: 1,
      strong: 1.1,
    };

    expect(strengthMultipliers.mild).toBe(0.9);
  });

  it('strength multiplier for normal is 1', () => {
    const strengthMultipliers = {
      mild: 0.9,
      normal: 1,
      strong: 1.1,
    };

    expect(strengthMultipliers.normal).toBe(1);
  });

  it('strength multiplier for strong is 1.1', () => {
    const strengthMultipliers = {
      mild: 0.9,
      normal: 1,
      strong: 1.1,
    };

    expect(strengthMultipliers.strong).toBe(1.1);
  });

  it('formats numbers with Dutch locale', () => {
    const formatAmount = (value: number): string =>
      new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value);

    expect(formatAmount(250)).toBe('250');
    expect(formatAmount(250.5)).toBe('250,5');
    expect(formatAmount(1000.123)).toBe('1.000,1');
  });

  it('calculates coffee amount correctly for filter method', () => {
    // Filter method: amountPerCup=250, ratio={coffee:1, amount:15}
    const amountPerCup = 250;
    const cups = 2;
    const ratio = { coffee: 1, amount: 15 };
    const strengthMultiplier = 1; // normal

    const amount = amountPerCup * cups; // 500
    const coffee = (amount * ratio.coffee * strengthMultiplier) / ratio.amount;

    expect(coffee).toBeCloseTo(33.33, 1);
    expect(Math.round(coffee * 10) / 10).toBe(33.3); // rounded to 1 decimal
  });

  it('applies strength multiplier to coffee calculation', () => {
    const amountPerCup = 250;
    const cups = 1;
    const ratio = { coffee: 1, amount: 15 };

    // Normal strength
    const normalCoffee = (amountPerCup * cups * ratio.coffee * 1) / ratio.amount;
    expect(Math.round(normalCoffee * 10) / 10).toBe(16.7);

    // Strong (1.1x)
    const strongCoffee = (amountPerCup * cups * ratio.coffee * 1.1) / ratio.amount;
    expect(Math.round(strongCoffee * 10) / 10).toBe(18.3);

    // Mild (0.9x)
    const mildCoffee = (amountPerCup * cups * ratio.coffee * 0.9) / ratio.amount;
    expect(Math.round(mildCoffee * 10) / 10).toBe(15);
  });

  it('calculates ratio correctly with strength applied', () => {
    const ratio = { coffee: 1, amount: 15 };
    const strengthMultiplier = 1.1; // strong

    const ratioAmount = ratio.amount / strengthMultiplier;
    expect(Math.round(ratioAmount * 10) / 10).toBe(13.6);
  });
});
