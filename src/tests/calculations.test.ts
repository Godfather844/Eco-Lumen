import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from '../utils/calculations';
import { CalculatorInput } from '../types/index';

const mockInputGasoline: CalculatorInput = {
  carType: 'Gasoline',
  annualMileage: 10000,
  flightsPerYear: 2,
  electricBill: 100,
  energySource: 'grid',
  heatingType: 'gas',
  householdSize: 2,
  dietType: 'average',
  recycleRate: 50,
  foodWaste: 'medium',
};

const mockInputCleanEV: CalculatorInput = {
  carType: 'EV',
  annualMileage: 5000,
  flightsPerYear: 0,
  electricBill: 50,
  energySource: 'clean',
  heatingType: 'heatpump',
  householdSize: 4,
  dietType: 'vegan',
  recycleRate: 100,
  foodWaste: 'low',
};

describe('Calculations Utility Tests', () => {
  it('should calculate emissions accurately for a standard gasoline vehicle commuter (Test Case 1)', () => {
    const resultGas = calculateCarbonFootprint(mockInputGasoline);
    
    // Validate individual fields and total
    expect(resultGas.transport).toBe(4.8); // (10000 * 0.411) / 1000 + (2 * 350) / 1000 = 4.11 + 0.7 = 4.81 (rounded to 4.8)
    expect(resultGas.utilities).toBe(4.1); // Electric + Gas Heating
    expect(resultGas.diet).toBe(1.8); // Standard Diet + Food Waste Offset
    expect(resultGas.total).toBe(10.7); // sum = 4.81 + 4.09 + 1.825 = 10.725 (rounded to 10.7)
  });

  it('should calculate emissions accurately for a zero-carbon EV vegan commuter (Test Case 2)', () => {
    const resultClean = calculateCarbonFootprint(mockInputCleanEV);
    
    // EV factor is smaller (0.08 kg CO2/mile), partial clean offsets applied
    expect(resultClean.transport).toBe(0.4); 
    expect(resultClean.utilities).toBe(0.1);
    expect(resultClean.diet).toBe(0.5); // Minimum diet cap of 0.4 + 0.05 low waste factor = 0.45 -> rounds to 0.5
    expect(resultClean.total).toBe(1.0); // significantly reduced footprint
  });

  it('should map tree equivalents accurately (Test Case 3)', () => {
    const resultGas = calculateCarbonFootprint(mockInputGasoline);
    // Tree absorption is total emissions * 45, rounded up to next integer
    expect(resultGas.equivalentTrees).toBe(483); // Math.ceil(10.725 * 45) = Math.ceil(482.625) = 483
  });

  it('should handle extreme bounds safely (e.g. huge mileage or household size)', () => {
    const excessInput: CalculatorInput = {
      ...mockInputGasoline,
      annualMileage: 99999999, // exceeds max limit of 1000000
      householdSize: -5,       // below min limit of 1
    };
    const result = calculateCarbonFootprint(excessInput);
    expect(result.transport).toBeLessThan(500); // capped mileage cap prevents extreme number explosion
    expect(result.utilities).toBeDefined();      // negative household size resolved to minimum 1
    expect(isNaN(result.total)).toBe(false);
  });
});
