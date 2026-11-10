export interface BrewMethod {
  id: 'filter' | 'aeropress' | 'espresso' | 'moka-pot';
  name: string;
  grindSize: string;
  amountPerCup: number;
  ratio: { coffee: number; amount: number };
  resultLabel: string;
  ratioLabel: string;
  unit: 'ml' | 'g';
  waterTemperatureC: number;
  note?: string;
}

export type CoffeeStrength = 'mild' | 'normal' | 'strong';