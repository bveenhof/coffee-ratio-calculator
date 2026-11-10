import { Component, State, h } from '@stencil/core';
import { BrewMethod, CoffeeStrength } from './types';
import { methods } from './mock-data';

const coffeeStrengths: { id: CoffeeStrength; label: string }[] = [
  { id: 'mild', label: 'Mild' },
  { id: 'normal', label: 'Normaal' },
  { id: 'strong', label: 'Sterk' },
];

const strengthMultipliers: Record<CoffeeStrength, number> = {
  mild: 0.9,
  normal: 1,
  strong: 1.1,
};

const formatAmount = (value: number): string =>
  new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value);

@Component({
  tag: 'coffee-calculator',
  styleUrl: 'coffee-calculator.css',
  shadow: true,
})
export class CoffeeCalculator {
  @State() selectedMethod: BrewMethod = methods[0];
  @State() cups = 1;
  @State() selectedStrength: CoffeeStrength = 'normal';

  private changeCups = (cupModifier: number) => {
    this.cups = Math.min(10, Math.max(1, this.cups + cupModifier));
  };

  render() {
    const method = this.selectedMethod;
    const strengthMultiplier = strengthMultipliers[this.selectedStrength];
    const cupLabel = this.cups === 1 ? 'kopje' : 'kopjes';
    const amount = method.amountPerCup * this.cups;
    const coffee = (amount * method.ratio.coffee * strengthMultiplier) / method.ratio.amount;
    const ratioAmount = method.ratio.amount / strengthMultiplier;

    const renderedBrewMethodOptions = methods.map(option => (
                <label class={{ 'coffee-calculator__radio-option': true, 'coffee-calculator__radio-option--is-selected': method.id === option.id }}>
                  <input
                    type="radio"
                    name="brew-method"
                    value={option.id}
                    checked={method.id === option.id}
                    onChange={() => { this.selectedMethod = option; }}
                  />
                  <span>{option.name}</span>
                </label>
              ))

    const renderedCoffeeStrengthOptions = coffeeStrengths.map(option => (
                <label class={{ 'coffee-calculator__radio-option': true, 'coffee-calculator__radio-option--is-selected': this.selectedStrength === option.id }}>
                  <input
                    type="radio"
                    name="coffee-strength"
                    value={option.id}
                    checked={this.selectedStrength === option.id}
                    onChange={() => { this.selectedStrength = option.id; }}
                  />
                  <span class="card-title">{option.label}</span>
                </label>
              ))

    return (
      <div class="coffee-calculator__container" lang="nl">
        <section class="coffee-calculator__controls">
          <header>
            <h2>Koffie-waterverhouding</h2>
            <p>Een startpunt voor verschillende bereidingswijzen</p>
          </header>

          <fieldset class="coffee-calculator__radio-list">
            <legend>Kies je bereidingswijze</legend>
            {renderedBrewMethodOptions}
          </fieldset>

          <div class="coffee-calculator__cup-amount">
            <span id="cups-label">Aantal kopjes</span>
            <div role="group" aria-labelledby="cups-label">
              <button
                type="button"
                class="button"
                id="cups-decrease"
                aria-label="Minder kopjes"
                disabled={this.cups <= 1}
                onClick={() => this.changeCups(-1)}
              >
                -
              </button>
              <span id="coffee-calculator__cups-value">{this.cups} {cupLabel}</span>
              <button
                type="button"
                class="button"
                id="cups-increase"
                aria-label="Meer kopjes"
                disabled={this.cups >= 10}
                onClick={() => this.changeCups(1)}
              >
                +
              </button>
            </div>
          </div>

          <fieldset class="coffee-calculator__radio-list">
            <legend>Kies je sterkte</legend>
              {renderedCoffeeStrengthOptions}
          </fieldset>
        </section>

        <section class="coffee-calculator__results" aria-labelledby="results-heading" aria-live="polite" aria-atomic="true">
          <h3 id="results-heading">Aanbevolen hoeveelheden</h3>
          <ul>
            <li>
              <strong>Bereidingswijze</strong>
              <span>{method.name}</span>
            </li>
            <li>
              <strong>Aantal kopjes</strong>
              <span>{this.cups} {cupLabel}</span>
            </li>
            <li>
              <strong>Koffie</strong>
              <span>{formatAmount(coffee)}g</span>
            </li>
            <li>
              <strong>{method.resultLabel}</strong>
              <span>{formatAmount(amount)} {method.unit}</span>
            </li>
            <li>
              <strong>Verhouding</strong>
              <span>1:{formatAmount(ratioAmount)}</span>
            </li>
            <li>
              <strong>Maalgraad</strong>
              <span>{method.grindSize}</span>
            </li>
            <li>
              <strong>Watertemperatuur</strong>
              <span>{method.waterTemperatureC} °C</span>
            </li>
          </ul>
          {method.note && <p>{method.note}</p>}
        </section>
      </div>
    );
  }
}
