import { calculateCarbonFootprint } from '../utils/calculations';
import { CalculatorInput } from '../types/index';

/**
 * Self-contained unit tests for the Carbon Footprint Simulation math models.
 */

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

export function runCalculationsTestSuite() {
  console.log('--- STARTING CALCULATIONS TEST SUITE ---');

  // Test Case 1: Standard Gasoline commuter
  const resultGas = calculateCarbonFootprint(mockInputGasoline);
  if (resultGas.transport === 4.8 && resultGas.total === 11.2) {
    console.log('✓ Test Case 1: Standard Gasoline model calculations match expected values.');
  } else {
    console.error('✗ Test Case 1 Failed:', resultGas);
  }

  // Test Case 2: Clean Zero-Carbon EV Vegan commuter
  const resultClean = calculateCarbonFootprint(mockInputCleanEV);
  if (resultClean.transport === 0.4 && resultClean.total === 1.1) {
    console.log('✓ Test Case 2: EV and Vegan diet parameters offset correctly.');
  } else {
    console.error('✗ Test Case 2 Failed:', resultClean);
  }

  // Test Case 3: Trees equivalent absorption multiplier check
  if (resultGas.equivalentTrees === 504) {
    console.log('✓ Test Case 3: Trees factor calculation maps accurately (total * 45).');
  } else {
    console.error('✗ Test Case 3 Failed:', resultGas);
  }

  console.log('--- COMPLETED CALCULATIONS TEST SUITE ---');
}
