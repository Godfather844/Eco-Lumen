export type ScreenType = 'home' | 'dashboard' | 'guide' | 'log-progress' | 'calculator' | 'report' | 'about';

export interface Activity {
  id: string;
  timestamp: string; // Time representation (e.g. "10:15 AM")
  type: string;
  amount: string; // Portions/Counts as string for flexible display
  co2Saved: number; // in Tons
  waterSaved: number; // in Gallons
  xpGained: number; // XP points granted
}

export interface UserStats {
  name: string;
  email: string;
  avatar: string;
  level: number;
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
  // Step 1: Transport & Aviation
  carType: 'Gasoline' | 'Hybrid' | 'EV' | 'None';
  annualMileage: number; // in miles
  flightsPerYear: number;
  
  // Step 2: Utilities
  electricBill: number; // monthly electricity charge in $
  energySource: 'grid' | 'partial' | 'clean';
  heatingType: 'gas' | 'electric' | 'heatpump';
  householdSize: number;

  // Step 3: Diet & Habits
  dietType: 'heavy-meat' | 'average' | 'vegetarian' | 'vegan';
  recycleRate: number; // 0 to 100
  foodWaste: 'low' | 'medium' | 'high';
}
