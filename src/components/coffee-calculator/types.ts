export interface BrewMethod {
  id: string;
  name: string;
  grindSize: string;
  amountPerCup: number;
  ratio: { coffee: number; amount: number };
  resultLabel: string;
  unit: 'ml' | 'g';
  waterTemperatureC: number;
  note?: string;
}

export type CoffeeStrength = 'mild' | 'normal' | 'strong';