import { Component, State, h } from '@stencil/core';

interface BrewMethod {
  id: 'filter' | 'aeropress' | 'espresso' | 'moka-pot';
  name: string;
  grindSize: string;
  amountPerCup: number;
  ratio: { coffee: number; amount: number };
  resultLabel: string;
  ratioLabel: string;
  unit: 'ml' | 'g';
  waterTemperatureC: number;
  temperatureLabel: string;
  note?: string;
}

type CoffeeStrength = 'mild' | 'normal' | 'strong';

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

const methods: BrewMethod[] = [
  {
    id: 'filter',
    name: 'Filterkoffie',
    grindSize: 'Gemiddeld',
    amountPerCup: 250,
    ratio: { coffee: 1, amount: 15 },
    resultLabel: 'Water',
    ratioLabel: 'water',
    unit: 'ml',
    waterTemperatureC: 94,
    temperatureLabel: 'Watertemperatuur bij zetten',
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    grindSize: 'Middelfijn',
    amountPerCup: 230,
    ratio: { coffee: 1, amount: 14 },
    resultLabel: 'Water',
    ratioLabel: 'water',
    unit: 'ml',
    waterTemperatureC: 95,
    temperatureLabel: 'Watertemperatuur bij zetten',
    note: 'Zet grotere hoeveelheden in meerdere batches als ze niet in je AeroPress passen.',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    grindSize: 'Fijn',
    amountPerCup: 36,
    ratio: { coffee: 1, amount: 2 },
    resultLabel: 'Espresso-opbrengst',
    ratioLabel: 'espresso-opbrengst',
    unit: 'g',
    waterTemperatureC: 93,
    temperatureLabel: 'Watertemperatuur van de machine bij zetten',
    note: 'Eén kopje is een dubbele espresso. De hoeveelheid water die de machine gebruikt verschilt; de opbrengst is het gewicht van de espresso in je kopje.',
  },
  {
    id: 'moka-pot',
    name: 'Mokapot',
    grindSize: 'Middelfijn tot fijn',
    amountPerCup: 50,
    ratio: { coffee: 1, amount: 10 },
    resultLabel: 'Water',
    ratioLabel: 'water',
    unit: 'ml',
    waterTemperatureC: 90,
    temperatureLabel: 'Watertemperatuur bij vullen',
    note: 'Gebruik een mokapot met passende capaciteit: vul het filtermandje met koffie en het waterreservoir tot onder het veiligheidsventiel. Gebruik een doek of ovenwant bij het vastpakken van het hete reservoir. De aangegeven hoeveelheden zijn een richtlijn.',
  },
];

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
                <label class={{ 'card-option': true, 'is-selected': method.id === option.id }}>
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
                <label class={{ 'card-option': true, 'is-selected': this.selectedStrength === option.id }}>
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
      <div class="calculator-container" lang="nl">
        <section>
          <header class="header">
            <h2>Koffie-waterverhouding</h2>
            <p>Een startpunt voor verschillende bereidingswijzen</p>
          </header>

          <fieldset class="brewing-methods">
            <legend>Kies je bereidingswijze</legend>
            <div>
              {renderedBrewMethodOptions}
            </div>
          </fieldset>

          <div class="cup-amount">
            <span>Aantal kopjes</span>
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
              <span>{this.cups} {cupLabel}</span>
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

          <fieldset class="coffee-strength">
            <legend>Kies je sterkte</legend>
            <div>
              {renderedCoffeeStrengthOptions}
            </div>
          </fieldset>
        </section>

        <section class="results" aria-labelledby="results-heading" aria-live="polite" aria-atomic="true">
          <h3 id="results-heading">Aanbevolen hoeveelheden</h3>
          <dl>
            <dt>Bereidingswijze</dt>
            <dd>{method.name}</dd>

            <dt>Aantal kopjes</dt>
            <dd>{this.cups} {cupLabel}</dd>

            <dt>Koffie</dt>
            <dd>{formatAmount(coffee)} g</dd>

            <dt>{method.resultLabel}</dt>
            <dd>{formatAmount(amount)} {method.unit}</dd>

            <dt>Verhouding koffie : {method.ratioLabel}</dt>
            <dd>1 : {formatAmount(ratioAmount)}</dd>

            <dt>Maalgraad</dt>
            <dd>{method.grindSize}</dd>
            
            <dt>{method.temperatureLabel}</dt>
            <dd>{method.waterTemperatureC} °C</dd>
          </dl>
          {method.note && <p>{method.note}</p>}
        </section>
      </div>
    );
  }
}
