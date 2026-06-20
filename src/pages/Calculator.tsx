import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, Flame, Apple, Sparkles, ArrowRight, AlertTriangle, Trees, ShieldCheck
} from 'lucide-react';
import { CalculatorInput, ScreenType } from '../types';
import { calculateCarbonFootprint } from '../utils/calculations';
import { safeParsePositiveNumber } from '../utils/validation';

interface CalculatorProps {
  setCurrentScreen: (screen: ScreenType) => void;
  calcInput: CalculatorInput;
  setCalcInput: React.Dispatch<React.SetStateAction<CalculatorInput>>;
}

export default function Calculator({ setCurrentScreen, calcInput, setCalcInput }: CalculatorProps) {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Compute live feedback utilizing the imported centralized utility function
  const liveEmissionsBreakdown = useMemo(() => {
    return calculateCarbonFootprint(calcInput);
  }, [calcInput]);

  const nationalAverage = 16.2; // Tons of Co2 per US resident annual average average

  const handleNextStep = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      // Direct carbon logging completes! Transition cleanly to dynamic 'report' screen
      setCurrentScreen('report');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  // Keyboard navigation helpers for sliders to meet strict WCAG criteria
  const handleMileageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      setCalcInput((prev) => ({ ...prev, annualMileage: Math.min(35000, prev.annualMileage + 500) }));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      setCalcInput((prev) => ({ ...prev, annualMileage: Math.max(0, prev.annualMileage - 500) }));
    }
  };

  const handleRecycleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      setCalcInput((prev) => ({ ...prev, recycleRate: Math.min(100, prev.recycleRate + 5) }));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      setCalcInput((prev) => ({ ...prev, recycleRate: Math.max(0, prev.recycleRate - 5) }));
    }
  };

  return (
    <article id="calculator-screen" className="flex-1 text-white min-h-[calc(100vh-4.5rem)] flex flex-col lg:flex-row items-stretch">
      
      {/* LEFT ASPECT: MULTI-STEP CONVERSATION REDUCTION FORM (60%) */}
      <section id="calc-form-segment" className="flex-1 p-6 md:p-12 flex flex-col justify-center max-w-2xl mx-auto lg:max-w-none lg:w-3/5" aria-labelledby="calc-title">
        
        {/* Step Header Indicator */}
        <div className="mb-8 max-w-md">
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
            {step === 1 && <Car className="w-4 h-4" aria-hidden="true" />}
            {step === 2 && <Flame className="w-4 h-4" aria-hidden="true" />}
            {step === 3 && <Apple className="w-4 h-4" aria-hidden="true" />}
            <span>Step 0{step} of 03 • {step === 1 ? 'Transit Scope' : step === 2 ? 'Utilities Scope' : 'Diet & Habits Scope'}</span>
          </div>

          <div className="flex space-x-2.5 mt-3" aria-hidden="true">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step === s 
                    ? 'bg-indigo-500 shadow-sm shadow-indigo-505/25' 
                    : step > s 
                      ? 'bg-indigo-950/40 border border-indigo-500/20' 
                      : 'bg-zinc-900 border border-zinc-805'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Wizard step render container */}
        <div className="min-h-[24rem] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: TRANSPORT & AVIATION */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
                role="region"
                aria-label="Scope 1: Transportation Inputs Form"
              >
                <div>
                  <h1 id="calc-title" className="text-2xl font-extrabold tracking-tight font-display text-white">Scope 1: Transport & Aviation</h1>
                  <p className="text-zinc-400 text-sm mt-1">Configure your personal and commercial travel logs to calculate mechanical outputs.</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Car type selector */}
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    <legend className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-2">Vehicle Propulsion Base</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['Gasoline', 'Hybrid', 'EV', 'None'] as any[]).map((t) => (
                        <button
                          id={`car-type-${t}`}
                          key={t}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, carType: t })}
                          aria-pressed={calcInput.carType === t}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            calcInput.carType === t 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Mileage Slider */}
                  {calcInput.carType !== 'None' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label htmlFor="mileage-slider" className="font-mono text-zinc-400 uppercase tracking-widest font-bold">Annual Mileage</label>
                        <span className="font-mono font-bold text-zinc-200">{calcInput.annualMileage.toLocaleString()} Miles</span>
                      </div>
                      <input
                        id="mileage-slider"
                        type="range"
                        min="0"
                        max="35000"
                        step="500"
                        value={calcInput.annualMileage}
                        onKeyDown={handleMileageKeyDown}
                        onChange={(e) => setCalcInput({ ...calcInput, annualMileage: safeParsePositiveNumber(e.target.value, 0, 35000) })}
                        aria-valuemin={0}
                        aria-valuemax={35000}
                        aria-valuenow={calcInput.annualMileage}
                        className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {/* Flights input */}
                  <div className="space-y-1.5 flex flex-col">
                    <label htmlFor="flights-input" className="text-[10px] font-mono text-zinc-405 uppercase tracking-widest font-bold">Short Flights per Year</label>
                    <input
                      id="flights-input"
                      type="number"
                      required
                      min="0"
                      max="1000"
                      placeholder="e.g. 4 flights"
                      value={calcInput.flightsPerYear}
                      onChange={(e) => setCalcInput({ ...calcInput, flightsPerYear: safeParsePositiveNumber(e.target.value, 0, 1000) })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-550/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 2: UTILITIES & WATER */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
                role="region"
                aria-label="Scope 2: Home Utilities Form"
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight font-display text-white">Scope 2: Home Utilities & Wattage</h1>
                  <p className="text-zinc-400 text-sm mt-1">Expose average domestic electrical draw rates and thermal power configurations.</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Electric Monthly bill input */}
                  <div className="space-y-1.5 flex flex-col">
                    <label htmlFor="electric-bill-input" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Monthly Electric Bill ($)</label>
                    <input
                      id="electric-bill-input"
                      type="number"
                      required
                      min="0"
                      max="50000"
                      placeholder="e.g. $120"
                      value={calcInput.electricBill}
                      onChange={(e) => setCalcInput({ ...calcInput, electricBill: safeParsePositiveNumber(e.target.value, 0, 50000) })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>

                  {/* Energy Electricity Source selection */}
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    <legend className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-2">Electrical Supply Source</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['grid', 'partial', 'clean'] as any[]).map((src) => (
                        <button
                          id={`energy-source-${src}`}
                          key={src}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, energySource: src })}
                          aria-pressed={calcInput.energySource === src}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            calcInput.energySource === src 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {src === 'grid' ? 'Standard Grid' : src === 'partial' ? 'Partial Solar' : '100% Clean Green'}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Heating source selection */}
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    <legend className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-2">Primary House Heating Mechanism</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['gas', 'electric', 'heatpump'] as any[]).map((heat) => (
                        <button
                          id={`heating-type-${heat}`}
                          key={heat}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, heatingType: heat })}
                          aria-pressed={calcInput.heatingType === heat}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            calcInput.heatingType === heat 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {heat === 'gas' ? 'Natural Gas' : heat === 'electric' ? 'Baseboard Electric' : 'Geothermal/Heat Pump'}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                </div>
              </motion.div>
            )}

            {/* STEP 3: DIET & HABITS */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
                role="region"
                aria-label="Scope 3: Diet & Lifestyle Factors Form"
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight font-display text-white">Scope 3: Diet & Habit Cycles</h1>
                  <p className="text-zinc-400 text-sm mt-1">Approximate culinary carbon procurement chains and municipal packaging cycles.</p>
                </div>

                <div className="space-y-5">
                  
                  {/* Diet Type */}
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    <legend className="text-[10px] font-mono text-zinc-405 uppercase tracking-widest font-bold mb-2">Nutritional Balance</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['heavy-meat', 'average', 'vegetarian', 'vegan'] as any[]).map((diet) => (
                        <button
                          id={`diet-type-${diet}`}
                          key={diet}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, dietType: diet })}
                          aria-pressed={calcInput.dietType === diet}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            calcInput.dietType === diet 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {diet === 'heavy-meat' ? 'Heavy Meat' : diet === 'average' ? 'Average' : diet === 'vegetarian' ? 'Vegetarian' : 'Vegan'}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Recycling Rate Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="recycle-slider" className="font-mono text-zinc-400 uppercase tracking-widest font-bold">Packaging Recycle Ratio</label>
                      <span className="font-mono font-bold text-indigo-400">{calcInput.recycleRate}% Rate</span>
                    </div>
                    <input
                      id="recycle-slider"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={calcInput.recycleRate}
                      onKeyDown={handleRecycleKeyDown}
                      onChange={(e) => setCalcInput({ ...calcInput, recycleRate: safeParsePositiveNumber(e.target.value, 0, 100) })}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={calcInput.recycleRate}
                      className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Food waste */}
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    <legend className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-2">Domestic Kitchen Food Waste</legend>
                    <div className="grid grid-cols-3 gap-3">
                      {(['low', 'medium', 'high'] as any[]).map((w) => (
                        <button
                          id={`food-waste-${w}`}
                          key={w}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, foodWaste: w })}
                          aria-pressed={calcInput.foodWaste === w}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            calcInput.foodWaste === w 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {w === 'low' ? 'Low Organic Waste' : w === 'medium' ? 'Average' : 'High Waste'}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Form Actions footer */}
          <div className="pt-8 border-t border-zinc-900 flex space-x-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider text-center transition-all cursor-pointer font-display focus:outline-none focus:ring-2 focus:ring-zinc-700"
              >
                Back Step
              </button>
            )}
            <button
              id="calc-proceed-btn"
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer font-display uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span>{step === 3 ? 'Analyze Footprint Output' : 'Lock Progress Step'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

      </section>

      {/* RIGHT ASPECT: LIVE FEEDBACK SIDEBAR GAUGE WIDGET */}
      <section id="calc-sidebar-gauge" className="hidden lg:flex w-2/5 p-12 bg-zinc-950 flex-col justify-between relative overflow-hidden border-l border-zinc-900" aria-label="Real-time CO2 emissions forecasting ledger">
        <img 
          id="calc-sidebar-moss"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyKHiO9xtbz1FBcx-pP8B8zq-DsloeM7O-PVo3j74Bd61RR1pg3XCxtFKhBKXt-nVtA5E1sEKlftX6sBaYOsr5sowDHpfDypAAWtjrIfz4NZhuO4jSF3DiykIOBN684Yg6iToUFBGJ9WP5fNqoI6xAtHdKspAIaI88F9_P8h5lLTM7gZIKgoErx822SvZCdUfdVSW5EBceiuHJArlQqnHsS1cagonQAZpMalsq3FvdfCoh8HNBduNxL22FkcCaKr2w1-jr_5eKutvR" 
          alt="Lush green forest background representing real-time calculations" 
          className="absolute inset-0 w-full h-full object-cover opacity-15" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" aria-hidden="true"></div>

        {/* Brand */}
        <div className="relative z-10 flex items-center space-x-2 text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <span>Real-Time Carbon Forecasting Engine</span>
        </div>

        {/* Main Live Feedback Gauge results */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Estimated Annual Output</span>
            <div className="flex items-baseline space-x-2" aria-live="polite">
              <span className="text-6xl font-extrabold font-mono text-white leading-none">
                {liveEmissionsBreakdown.total}
              </span>
              <span className="text-lg text-zinc-400 font-semibold font-display">Metric Tons</span>
            </div>
            
            {/* Status indicators */}
            {liveEmissionsBreakdown.total > nationalAverage ? (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center space-x-2 pt-2 mt-4 inline-flex shadow-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
                <span>Exceeding average resident output by {Math.round(liveEmissionsBreakdown.total - nationalAverage)} tons.</span>
              </span>
            ) : (
              <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl flex items-center space-x-2 pt-2 mt-4 inline-flex shadow-sm">
                <Trees className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-bounce" aria-hidden="true" />
                <span>Safely under US average by {Math.round(nationalAverage - liveEmissionsBreakdown.total)} tons!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-zinc-900 pt-6">
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Reforest Trees Needed</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-bold font-mono text-indigo-405">{liveEmissionsBreakdown.equivalentTrees}</span>
                <span className="text-xs text-zinc-400 font-display">Saplings</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">US Resident Average</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-bold font-mono text-zinc-400">16.2</span>
                <span className="text-xs text-zinc-400 font-display">Tonnes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol verify footer */}
        <div className="relative z-10 flex items-center space-x-2 text-[10px] text-zinc-600 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
          <span>Formulas verified by the ESG Greenhouse Gas Protocol.</span>
        </div>

      </section>

    </article>
  );
}
