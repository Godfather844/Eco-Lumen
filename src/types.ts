export type ScreenType = 'home' | 'dashboard' | 'guide' | 'log-progress' | 'calculator' | 'report' | 'about';

export interface Activity {
  id: string;
  timestamp: Date;
  type: 'Transportation' | 'Meals' | 'Electricity' | 'Waste';
  amount: number; // e.g. miles driven, meals eaten, kWh, or general scale
  unit: string;
  impactSaved: number; // kg CO2 saved
}

export interface UserStats {
  name: string;
  email: string;
  avatar: string;
  levelName: string;
  nextLevelXP: number;
  currentXP: number;
  sustainabilityScore: number;
  directCarbonSaved: number; // in Metric Tons
  waterConserved: number; // in Gallons
  greenEnergyPct: number; // e.g. 85
  goal: string;
}

export interface CalculatorInput {
  // Step 1: Transport
  carType: 'Gasoline' | 'Hybrid' | 'EV' | 'None';
  annualMileage: number; // in miles
  flightsPerYear: number;
  
  // Step 2: Utilities
  electricBill: number; // monthly $
  energySource: 'grid' | 'partial' | 'clean';
  heatingType: 'gas' | 'electric' | 'heatpump';
  householdSize: number;

  // Step 3: Diet & Habits
  dietType: 'heavy-meat' | 'average' | 'vegetarian' | 'vegan';
  recycleRate: number; // 0 to 100
  foodWaste: 'low' | 'medium' | 'high';
}
