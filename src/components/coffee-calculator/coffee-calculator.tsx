import { Component, Prop, State, Watch, h } from '@stencil/core';
import { BrewMethod, CoffeeStrength } from './types';
import { methods as mockMethods } from './mock-data';
import { ModalComponent }from '../modal/modal-component';

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
  /** Brew methods to display. */
  @Prop() methods: BrewMethod[] = mockMethods;
  @State() selectedMethodId = '';
  @State() cups = 1;
  @State() selectedStrength: CoffeeStrength = 'normal';

  @Watch('methods')
  handleMethodsChange() {
    const methods = Array.isArray(this.methods) ? this.methods : [];
    if (!methods.some(method => method.id === this.selectedMethodId)) {
      this.selectedMethodId = methods[0]?.id ?? '';
    }
  }

  private changeCups = (cupModifier: number) => {
    this.cups = Math.min(10, Math.max(1, this.cups + cupModifier));
  };

  render() {
    const methods = Array.isArray(this.methods) ? this.methods : [];
    if (methods.length === 0) {
      return (
        <div class="coffee-calculator__container coffee-calculator__container--error" lang="nl" role="alert">
          <img src="build/assets/icon-error.svg" alt="Foutmelding: er is geen data beschikbaar" class="icon" />
          <h2>Er zijn geen zetmethodes beschikbaar.</h2>
        </div>
      );
    }

    const method = methods.find(option => option.id === this.selectedMethodId) ?? methods[0];

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
                    onChange={() => { this.selectedMethodId = option.id; }}
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
                  <span>{option.label}</span>
                </label>
              ))

    return (
      <div class="coffee-calculator__container" lang="nl">
        <section class="coffee-calculator__controls">
          <header>
            <h2 class="coffee-calculator__title">
              <img src="build/assets/coffee-bean-icon.svg" alt="" class="icon" />
              Koffie-waterverhouding
            </h2>
            <p>Een startpunt voor verschillende bereidingswijzen</p>
          </header>

          <fieldset class="coffee-calculator__radio-list">
            <legend>Kies je bereidingswijze</legend>
            <div class="coffee-calculator__radio-list-items">
              {renderedBrewMethodOptions}
            </div>
          </fieldset>

          <div class="coffee-calculator__cup-amount">
            <h3 id="cups-label">Aantal kopjes</h3>
            <div role="group" aria-labelledby="cups-label" class="coffee-calculator__cup-amount-controls">
              <button
                type="button"
                class="button button--round"
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
                class="button button--round"
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
            <div class="coffee-calculator__radio-list-items">
              {renderedCoffeeStrengthOptions}
            </div>
          </fieldset>

          <div class="coffee-calculator__review">
            <h3 id="coffee-review">Hoe was de koffie?</h3 >
            <div role="group" aria-labelledby="coffee-review" class="coffee-calculator__review-controls">
              <button class="button" type="button" aria-label="Te zwak">Te zwak</button>
              <button class="button" type="button" aria-label="Acidisch">Acidisch </button>
              <button class="button" type="button" aria-label="Bitter">Bitter</button>
            </div>
          </div>
        </section>

        <section class="coffee-calculator__results" aria-labelledby="results-heading" aria-live="polite" aria-atomic="true">
          <h3 id="results-heading">Aanbevolen hoeveelheden</h3>
          <ul class="coffee-calculator__results-list">
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

        <ModalComponent>
          <p>Dit is een modale inhoud.</p>
        </ModalComponent>
      </div>
    );
  }
}
