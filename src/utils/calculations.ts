import { CalculatorInput } from '../types';

export interface EmissionsBreakdown {
  transport: number;
  utilities: number;
  diet: number;
  total: number;
  equivalentTrees: number;
}

/**
 * Calculates the annual greenhouse gas emissions breakdown in metric tons of CO2e.
 * Based on Greenhouse Gas Protocol estimates and standards.
 */
export function calculateCarbonFootprint(input: CalculatorInput): EmissionsBreakdown {
  let transportEmissions = 0;
  let utilityEmissions = 0;
  let dietEmissions = 0;

  // 1. Transportation Carbon Math (Scope 1)
  if (input.carType !== 'None') {
    let emissionFactor = 0.411; // Gasoline (kg CO2 per mile)
    if (input.carType === 'Hybrid') emissionFactor = 0.22;
    if (input.carType === 'EV') emissionFactor = 0.08;
    
    // Ensure mileage is a safe positive number
    const safeMileage = Math.max(0, Math.min(1000000, input.annualMileage));
    transportEmissions += (safeMileage * emissionFactor) / 1000; // Convert kg to Metric Tons
  }

  // Flights Math (Aviation, average 350kg CO2 per short/medium flight)
  const safeFlights = Math.max(0, Math.min(1000, input.flightsPerYear));
  transportEmissions += (safeFlights * 350) / 1000;

  // 2. Home Utilities (Scope 2)
  // Convert average monthly bill to estimated annual kWh ($0.15 average residential rate)
  const safeElectricBill = Math.max(0, Math.min(100000, input.electricBill));
  const estimatedMonthlyKwh = safeElectricBill / 0.15;
  const annualKwh = estimatedMonthlyKwh * 12;

  let energyFactor = 0.4; // standard electrical grid (kg CO2 per kWh)
  if (input.energySource === 'partial') energyFactor = 0.22;
  if (input.energySource === 'clean') energyFactor = 0.02;

  utilityEmissions += (annualKwh * energyFactor) / 1000;

  // Heating Math (Average heating scope values)
  let heatingFactor = 1.25; // standard natural gas heating equivalent (Tons)
  if (input.heatingType === 'electric') heatingFactor = 0.75;
  if (input.heatingType === 'heatpump') heatingFactor = 0.15;

  const safeHouseholdSize = Math.max(1, Math.min(100, input.householdSize));
  utilityEmissions += heatingFactor / Math.max(1, safeHouseholdSize * 0.7);

  // 3. Diet & Lifestyle (Scope 3)
  // Annual diet baseline values in Metric Tons CO2e
  let dietBase = 1.8;
  if (input.dietType === 'heavy-meat') dietBase = 2.9;
  if (input.dietType === 'vegetarian') dietBase = 1.15;
  if (input.dietType === 'vegan') dietBase = 0.65;
  dietEmissions += dietBase;

  // Recycling Offset (up to 0.45 Tons saved depending on recycling rate)
  const safeRecycleRate = Math.max(0, Math.min(100, input.recycleRate));
  const recycleOffset = (safeRecycleRate / 100) * 0.45;
  dietEmissions = Math.max(0.4, dietEmissions - recycleOffset);

  // Organic Food Waste Factor
  let foodWasteFactor = 0.25;
  if (input.foodWaste === 'high') foodWasteFactor = 0.5;
  if (input.foodWaste === 'low') foodWasteFactor = 0.05;
  dietEmissions += foodWasteFactor;

  const total = transportEmissions + utilityEmissions + dietEmissions;

  return {
    transport: Number(transportEmissions.toFixed(1)),
    utilities: Number(utilityEmissions.toFixed(1)),
    diet: Number(dietEmissions.toFixed(1)),
    total: Number(total.toFixed(1)),
    equivalentTrees: Math.ceil(total * 45), // average 45 trees needed to absorb 1 Metric Ton CO2 per year
  };
}
