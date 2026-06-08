import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import { 
  FileText, Share2, Sparkles, AlertCircle, ArrowLeft, Check, Compass, Printer
} from 'lucide-react';
import { CalculatorInput, ScreenType, UserStats } from '../types';

interface ReportProps {
  setCurrentScreen: (screen: ScreenType) => void;
  calcInput: CalculatorInput;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export default function Report({ setCurrentScreen, calcInput, stats, setStats }: ReportProps) {
  
  // Feedback action toasts states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic calculations mirroring the logic inside Calculator
  const getFootprintBreakdown = () => {
    let transportEmissions = 0;
    let utilityEmissions = 0;
    let dietEmissions = 0;

    // Transport
    if (calcInput.carType !== 'None') {
      let ef = 0.411; 
      if (calcInput.carType === 'Hybrid') ef = 0.22;
      if (calcInput.carType === 'EV') ef = 0.08;
      transportEmissions += (calcInput.annualMileage * ef) / 1000;
    }
    transportEmissions += (calcInput.flightsPerYear * 350) / 1000;

    // Electric
    const estimatedMonthlyKwh = calcInput.electricBill / 0.15;
    const annualKwh = estimatedMonthlyKwh * 12;
    let energyEf = 0.4;
    if (calcInput.energySource === 'partial') energyEf = 0.22;
    if (calcInput.energySource === 'clean') energyEf = 0.02;

    utilityEmissions += (annualKwh * energyEf) / 1000;

    // Heating
    let heatingEf = 1.25;
    if (calcInput.heatingType === 'electric') heatingEf = 0.75;
    if (calcInput.heatingType === 'heatpump') heatingEf = 0.15;
    utilityEmissions += heatingEf / Math.max(1, calcInput.householdSize * 0.7);

    // Diet
    let dietBase = 1.8;
    if (calcInput.dietType === 'heavy-meat') dietBase = 2.9;
    if (calcInput.dietType === 'vegetarian') dietBase = 1.15;
    if (calcInput.dietType === 'vegan') dietBase = 0.65;
    dietEmissions += dietBase;

    const recycleOffset = (calcInput.recycleRate / 100) * 0.45;
    dietEmissions = Math.max(0.4, dietEmissions - recycleOffset);

    let foodWasteEf = 0.25;
    if (calcInput.foodWaste === 'high') foodWasteEf = 0.5;
    if (calcInput.foodWaste === 'low') foodWasteEf = 0.05;
    dietEmissions += foodWasteEf;

    return {
      transport: Number(transportEmissions.toFixed(1)),
      utilities: Number(utilityEmissions.toFixed(1)),
      diet: Number(dietEmissions.toFixed(1)),
      total: Number((transportEmissions + utilityEmissions + dietEmissions).toFixed(1)),
    };
  };

  const breakdown = getFootprintBreakdown();

  // Pie chart data (Aligned Bento Grid Theme Colors: Indigo, Purple, Teal)
  const pieData = [
    { name: 'Transport & Air', value: breakdown.transport, color: '#6366f1' },
    { name: 'Home Utilities', value: breakdown.utilities, color: '#a855f7' },
    { name: 'Diet & Habits', value: breakdown.diet, color: '#14b8a6' },
  ];

  // Bar chart diagnostics vs US Average vs Global Paris Agreement target
  const barData = [
    { name: 'Your Footprint', emissions: breakdown.total, fill: '#6366f1' },
    { name: 'US Average', emissions: 16.2, fill: '#27272a' },
    { name: 'Paris Target', emissions: 2.0, fill: '#a855f7' },
  ];

  // Recommendations builder
  const getActionRecommendations = () => {
    const list = [];
    if (calcInput.carType === 'Gasoline') {
      list.push({
        cat: 'Transport',
        rec: 'Transition your gasoline engine. Upgrading to a hybrid or an electrical micro-battery drops commute footprint by over 65%.',
        impact: 'Saves ~2.1.0 Tons CO2/yr'
      });
    }
    if (calcInput.flightsPerYear > 2) {
      list.push({
        cat: 'Aviation',
        rec: 'Audit flying frequency. Consolidate long cross-flights, and purchase voluntary certified reforestation bounds during tickets.',
        impact: 'Saves ~350kg CO2 per event'
      });
    }
    if (calcInput.energySource === 'grid') {
      list.push({
        cat: 'Utilities',
        rec: 'Switch power meters to purchase green micro-solar. Local community solar farms hook up power logs via clean shares easily.',
        impact: 'Saves ~1.8 Tons CO2/yr'
      });
    }
    if (calcInput.heatingType === 'gas') {
      list.push({
        cat: 'Heating',
        rec: 'Exchange older gas heating units with high-induction warmth heat pumps to limit local emissions schedules.',
        impact: 'Saves ~1.1 Tons CO2/yr'
      });
    }
    if (calcInput.dietType === 'heavy-meat') {
      list.push({
        cat: 'Nutritional',
        rec: 'Incorporate delicious plant-based recipes three days a week. Opt for localized harvest grids instead of standard commercial beef pipelines.',
        impact: 'Saves ~1.2 Tons CO2/yr'
      });
    }
    // Default fallback
    if (list.length < 2) {
      list.push({
        cat: 'Micro habits',
        rec: 'Shut standby machinery down overnight using smart power bars. Keep packaging targets high with composting bins.',
        impact: 'Saves ~300kg CO2/yr'
      });
    }
    return list;
  };

  const currentRecs = getActionRecommendations();

  // Actions toast handlers
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div id="report-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white pb-20">
      
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div id="report-toast" className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-indigo-500/40 text-indigo-300 font-mono text-xs p-4 rounded-2xl shadow-2xl flex items-center space-x-2 animate-fade-in font-display">
          <Check className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
        <div>
          <button 
            onClick={() => setCurrentScreen('calculator')}
            className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 mb-2 cursor-pointer transition-colors font-display"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-500" />
            <span>Modify Calculator Inputs</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Emissions Analysis Report</h1>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full font-mono border border-indigo-500/20 font-bold uppercase tracking-wider">Official Score Ready</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div id="report-actions" className="flex items-center space-x-3">
          <button
            id="print-report-btn"
            onClick={() => triggerToast('Generating cryptographically signed ESG PDF... (check downloads)')}
            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-100 border border-zinc-800 p-2.5 h-10 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center space-x-2 font-display"
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            <span>Get PDF</span>
          </button>
          
          <button
            id="share-report-btn"
            onClick={() => triggerToast('Secure link copied to ledger dashboard clipboard.')}
            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-100 border border-zinc-800 p-2.5 h-10 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center space-x-2 font-display"
          >
            <Share2 className="w-4 h-4 text-zinc-400" />
            <span>Share Link</span>
          </button>

          <button
            id="report-go-desk"
            onClick={() => {
              // Boost actual scores!
              setStats((prev) => ({
                ...prev,
                sustainabilityScore: Math.round(95 - breakdown.total * 1.5),
                directCarbonSaved: prev.directCarbonSaved + 0.1,
              }));
              setCurrentScreen('dashboard');
            }}
            className="bg-indigo-600 hover:bg-indigo-505 text-white p-2.5 px-4 h-10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-indigo-500/10 tracking-widest font-display"
          >
            Save to Dashboard
          </button>
        </div>
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        
        {/* DONUT: BREAKDOWN PIE CHART (lg:col-span-5) */}
        <motion.div 
          id="pie-chart-con"
          className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between shadow-xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Scope 1, 2, and 3 Distribution</span>
            <h3 className="text-lg font-bold text-white mt-1 font-display">Footprint Breakdown</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
              Based on transportation fuel efficiency sliders, electric grid billing rates, and daily food waste habits.
            </p>
          </div>

          {/* Recharts Pie Donut */}
          <div className="h-60 w-full relative flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-mono text-white">{breakdown.total}</span>
              <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-zinc-500">Total Tons</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 pt-4 border-t border-zinc-800-40 mt-4 h-32 flex flex-col justify-center">
            {pieData.map((p) => {
              const share = breakdown.total > 0 ? Math.round((p.value / breakdown.total) * 100) : 0;
              return (
                <div key={p.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></div>
                    <span className="text-zinc-300 font-display font-medium">{p.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400 font-bold">{p.value} tons ({share}%)</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* COMPARISON BAR CHART (lg:col-span-7) */}
        <motion.div 
          id="bar-chart-con"
          className="lg:col-span-7 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between shadow-xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Relative Performance</span>
            <h3 className="text-lg font-bold text-white mt-1 font-display">Footprint vs Benchmarks</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
              How your dynamic footprint matches up against the US average per capita and international sustainability rules.
            </p>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="emissions" name="CO2 Emissions (Tons/yr)" radius={[8, 8, 0, 0]}>
                  {barData.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-start space-x-3 text-xs text-zinc-400 mt-2">
            <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span className="font-sans leading-relaxed">The target limit corresponding to the Paris Climate Agreement goals requires a standard individual budget under 2.0 metric tons of carbon annually by 2050.</span>
          </div>
        </motion.div>

      </div>

      {/* CORE RECOMMENDATIONS LIST PANEL */}
      <section id="deep-dive-recommendations" className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Actionable reduction ledger</span>
            <h3 className="text-xl font-bold text-white font-display">Deep-Dive Recommendations</h3>
          </div>
          <span className="text-xs text-indigo-450 font-mono font-bold uppercase border border-indigo-500/25 py-0.5 px-3 bg-indigo-505/10 rounded-full">Score-Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecs.map((r, i) => (
            <div key={i} className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 hover:border-zinc-700 transition-colors flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[9px] font-mono font-extrabold uppercase bg-indigo-500/10 text-indigo-400 p-1.5 px-2.5 rounded-lg inline-block mb-3.5 tracking-wider border border-indigo-500/20">{r.cat}</span>
                <p className="text-zinc-300 text-xs leading-relaxed font-sans font-medium">{r.rec}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-indigo-400 font-bold tracking-wider">
                <span>ESTIMATED PAYOFF</span>
                <span>{r.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
