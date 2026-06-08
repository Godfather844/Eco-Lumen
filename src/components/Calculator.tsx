import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, Flame, Apple, Sparkles, ChevronRight, Trees, ArrowRight, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { CalculatorInput, ScreenType } from '../types';

interface CalculatorProps {
  setCurrentScreen: (screen: ScreenType) => void;
  calcInput: CalculatorInput;
  setCalcInput: React.Dispatch<React.SetStateAction<CalculatorInput>>;
}

export default function Calculator({ setCurrentScreen, calcInput, setCalcInput }: CalculatorProps) {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Live Carbon Calculator Model based on inputs
  const calculateLiveFootprint = () => {
    let transportEmissions = 0;
    let utilityEmissions = 0;
    let dietEmissions = 0;

    // Transport Math model
    if (calcInput.carType !== 'None') {
      let ef = 0.411; // Gasoline (kg per mile)
      if (calcInput.carType === 'Hybrid') ef = 0.22;
      if (calcInput.carType === 'EV') ef = 0.08;
      transportEmissions += (calcInput.annualMileage * ef) / 1000; // to tonnes
    }
    // Flight Math model: average ~250kg per short flight
    transportEmissions += (calcInput.flightsPerYear * 350) / 1000;

    // Utility Math model
    // Monthly bill converted to estimated usage. Average $0.15/kWh
    const estimatedMonthlyKwh = calcInput.electricBill / 0.15;
    const annualKwh = estimatedMonthlyKwh * 12;
    let energyEf = 0.4; // standard grid (kg CO2 per kWh)
    if (calcInput.energySource === 'partial') energyEf = 0.22;
    if (calcInput.energySource === 'clean') energyEf = 0.02;

    utilityEmissions += (annualKwh * energyEf) / 1000;

    // Heating math: gas: 1.2 tons, electric: 0.8 tons, heat pump: 0.2 tons
    let heatingEf = 1.25;
    if (calcInput.heatingType === 'electric') heatingEf = 0.75;
    if (calcInput.heatingType === 'heatpump') heatingEf = 0.15;
    utilityEmissions += heatingEf / Math.max(1, calcInput.householdSize * 0.7);

    // Diet & Habits Math model
    // annual diet: meat lovers (2.9 tons), average: 1.8 tons, vegetarian: 1.1 tons, vegan: 0.7 tons
    let dietBase = 1.8;
    if (calcInput.dietType === 'heavy-meat') dietBase = 2.9;
    if (calcInput.dietType === 'vegetarian') dietBase = 1.15;
    if (calcInput.dietType === 'vegan') dietBase = 0.65;
    dietEmissions += dietBase;

    // recycling offsets: up to 0.4 tons saved
    const recycleOffset = (calcInput.recycleRate / 100) * 0.45;
    dietEmissions = Math.max(0.4, dietEmissions - recycleOffset);

    // food waste adds up to 0.5 tons
    let foodWasteEf = 0.25;
    if (calcInput.foodWaste === 'high') foodWasteEf = 0.5;
    if (calcInput.foodWaste === 'low') foodWasteEf = 0.05;
    dietEmissions += foodWasteEf;

    const total = transportEmissions + utilityEmissions + dietEmissions;
    return {
      total: Number(total.toFixed(1)),
      transport: Number(transportEmissions.toFixed(1)),
      utilities: Number(utilityEmissions.toFixed(1)),
      diet: Number(dietEmissions.toFixed(1)),
      equivalentTrees: Math.ceil(total * 45), // 45 trees per ton of annual carbon CO2 absorption
    };
  };

  const currentScores = calculateLiveFootprint();
  const nationalAverage = 16.2; // Tons of Co2 per US resident annual average

  const handleNextStep = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      // Analyze Footprint completely! Transition straight to 'report' screen
      setCurrentScreen('report');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  return (
    <div id="calculator-screen" className="flex-1 text-white min-h-[calc(100vh-4.5rem)] flex items-stretch">
      
      {/* LEFT ASPECT: MULTI-STEP CONVERSATION REDUCTION FORM (60%) */}
      <div id="calc-form-segment" className="flex-1 p-6 md:p-12 flex flex-col justify-center max-w-2xl mx-auto lg:max-w-none lg:w-3/5">
        
        {/* Step Header Indicator */}
        <div className="mb-8 max-w-md">
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
            {step === 1 && <Car className="w-4 h-4" />}
            {step === 2 && <Flame className="w-4 h-4" />}
            {step === 3 && <Apple className="w-4 h-4" />}
            <span>Step 0{step} of 03 • {step === 1 ? 'Transit Output' : step === 2 ? 'Utilities & Wattage' : 'Diet & Lifestyle'}</span>
          </div>

          <div className="flex space-x-2.5 mt-3">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step === s 
                    ? 'bg-indigo-500 shadow-sm shadow-indigo-500/20' 
                    : step > s 
                      ? 'bg-indigo-950/40 border border-indigo-500/20' 
                      : 'bg-zinc-900 border border-zinc-800'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Wizard step render */}
        <div className="min-h-96 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: TRANSPORT */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight font-display">Scope 1: Transport & Aviation</h1>
                  <p className="text-zinc-400 text-sm mt-1">Configure your personal and commercial travel logs to calculate mechanical outputs.</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Car type selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Vehicle Propulsion Base</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['Gasoline', 'Hybrid', 'EV', 'None'] as any[]).map((t) => (
                        <button
                          id={`car-type-${t}`}
                          key={t}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, carType: t })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display ${
                            calcInput.carType === t 
                              ? 'bg-indigo-500/10 border-indigo-550 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mileage Slider */}
                  {calcInput.carType !== 'None' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-mono text-zinc-450 uppercase tracking-widest font-bold">Annual Mileage</label>
                        <span className="font-mono font-bold text-zinc-200">{calcInput.annualMileage.toLocaleString()} Miles</span>
                      </div>
                      <input
                        id="mileage-slider"
                        type="range"
                        min="0"
                        max="35000"
                        step="500"
                        value={calcInput.annualMileage}
                        onChange={(e) => setCalcInput({ ...calcInput, annualMileage: Number(e.target.value) })}
                        className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  )}

                  {/* Flights input */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Short Flights per Year</label>
                    <input
                      id="flights-input"
                      type="number"
                      required
                      placeholder="e.g. 4 flights"
                      value={calcInput.flightsPerYear}
                      onChange={(e) => setCalcInput({ ...calcInput, flightsPerYear: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 2: UTILITIES & HEATING */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight font-display">Scope 2: Home Utilities & Wattage</h1>
                  <p className="text-zinc-400 text-sm mt-1">Expose average domestic electrical draw rates and thermal power foundations.</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Electric Monthly bill input */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Monthly Electric Bill ($)</label>
                    <input
                      id="electric-bill-input"
                      type="number"
                      required
                      placeholder="e.g. $120"
                      value={calcInput.electricBill}
                      onChange={(e) => setCalcInput({ ...calcInput, electricBill: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Energy Electricity Source selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Electrical Supply Source</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['grid', 'partial', 'clean'] as any[]).map((src) => (
                        <button
                          id={`energy-source-${src}`}
                          key={src}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, energySource: src })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display ${
                            calcInput.energySource === src 
                              ? 'bg-indigo-500/10 border-indigo-550 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {src === 'grid' ? 'Standard Grid' : src === 'partial' ? 'Partial Solar' : '100% Clean Green'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Heating source selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Primary House Heating Mechanism</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['gas', 'electric', 'heatpump'] as any[]).map((heat) => (
                        <button
                          id={`heating-type-${heat}`}
                          key={heat}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, heatingType: heat })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display ${
                            calcInput.heatingType === heat 
                              ? 'bg-indigo-500/10 border-indigo-550 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {heat === 'gas' ? 'Natural Gas' : heat === 'electric' ? 'Baseboard Electric' : 'Geothermal/Heat Pump'}
                        </button>
                      ))}
                    </div>
                  </div>

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
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight font-display">Scope 3: Diet & Habit Cycles</h1>
                  <p className="text-zinc-400 text-sm mt-1">Approximate culinary carbon procurement chains and municipal packaging cycles.</p>
                </div>

                <div className="space-y-5">
                  
                  {/* Diet Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Nutritional Balance</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['heavy-meat', 'average', 'vegetarian', 'vegan'] as any[]).map((diet) => (
                        <button
                          id={`diet-type-${diet}`}
                          key={diet}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, dietType: diet })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display ${
                            calcInput.dietType === diet 
                              ? 'bg-indigo-500/10 border-indigo-550 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {diet === 'heavy-meat' ? 'Heavy Meat' : diet === 'average' ? 'Average' : diet === 'vegetarian' ? 'Vegetarian' : 'Vegan'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recycling Rate Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-mono text-zinc-450 uppercase tracking-widest font-bold">Packaging Recycle Ratio</label>
                      <span className="font-mono font-bold text-indigo-400">{calcInput.recycleRate}% Rate</span>
                    </div>
                    <input
                      id="recycle-slider"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={calcInput.recycleRate}
                      onChange={(e) => setCalcInput({ ...calcInput, recycleRate: Number(e.target.value) })}
                      className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Food waste */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Domestic Kitchen Food Waste</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['low', 'medium', 'high'] as any[]).map((w) => (
                        <button
                          id={`food-waste-${w}`}
                          key={w}
                          type="button"
                          onClick={() => setCalcInput({ ...calcInput, foodWaste: w })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all font-display ${
                            calcInput.foodWaste === w 
                              ? 'bg-indigo-500/10 border-indigo-550 text-indigo-400' 
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {w === 'low' ? 'Low Organic Waste' : w === 'medium' ? 'Average' : 'High Waste'}
                        </button>
                      ))}
                    </div>
                  </div>

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
                className="flex-1 bg-zinc-950 border border-zinc-805 hover:border-zinc-700 text-zinc-300 font-semibold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider text-center transition-all cursor-pointer font-display"
              >
                Back Room
              </button>
            )}
            <button
              id="calc-proceed-btn"
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-indigo-600 hover:bg-indigo-505 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer font-display uppercase tracking-widest"
            >
              <span>{step === 3 ? 'Analyze Footprint Output' : 'Lock Progress Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT ASPECT: LIVE FEEDBACK SIDEBAR GAUGE (40%) */}
      <div id="calc-sidebar-gauge" className="hidden lg:flex w-2/5 p-12 bg-zinc-950 flex-col justify-between relative overflow-hidden border-l border-zinc-900">
        <img 
          id="calc-sidebar-moss"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyKHiO9xtbz1FBcx-pP8B8zq-DsloeM7O-PVo3j74Bd61RR1pg3XCxtFKhBKXt-nVtA5E1sEKlftX6sBaYOsr5sowDHpfDypAAWtjrIfz4NZhuO4jSF3DiykIOBN684Yg6iToUFBGJ9WP5fNqoI6xAtHdKspAIaI88F9_P8h5lLTM7gZIKgoErx822SvZCdUfdVSW5EBceiuHJArlQqnHsS1cagonQAZpMalsq3FvdfCoh8HNBduNxL22FkcCaKr2w1-jr_5eKutvR" 
          alt="Green forest backdrop" 
          className="absolute inset-0 w-full h-full object-cover opacity-15" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>

        {/* Brand */}
        <div className="relative z-10 flex items-center space-x-2 text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Real-time analysis ledger</span>
        </div>

        {/* Main Live Feedback Gauge results */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Annual Carbon Output</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-extrabold font-mono text-white leading-none">
                {currentScores.total}
              </span>
              <span className="text-lg text-zinc-400 font-semibold font-display">Tonnes</span>
            </div>
            
            {/* Status alerts vs average */}
            {currentScores.total > nationalAverage ? (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center space-x-2 pt-2 mt-4 inline-flex">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Exceeding average by {Math.round(currentScores.total - nationalAverage)} tons.</span>
              </span>
            ) : (
              <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl flex items-center space-x-2 pt-2 mt-4 inline-flex">
                <Trees className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-bounce" />
                <span>Safely under average by {Math.round(nationalAverage - currentScores.total)} tons!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-zinc-900 pt-6">
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Trees absorption needed</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-bold font-mono text-indigo-400">{currentScores.equivalentTrees}</span>
                <span className="text-xs text-zinc-400 font-display">Trees</span>
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

        {/* Security badge at bottom */}
        <div className="relative z-10 flex items-center space-x-2 text-[10px] text-zinc-650 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-500/40" />
          <span>Formulas verified by the ESG Greenhouse Gas Protocol.</span>
        </div>

      </div>

    </div>
  );
}
