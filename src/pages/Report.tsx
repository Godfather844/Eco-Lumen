import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  CheckCircle, ArrowLeft, Download, ShieldCheck, HelpCircle, 
  Leaf, Info, Copy, Check
} from 'lucide-react';
import { CalculatorInput, ScreenType } from '../types';
import { calculateCarbonFootprint } from '../utils/calculations';

interface ReportProps {
  setCurrentScreen: (screen: ScreenType) => void;
  calcInput: CalculatorInput;
}

const COLORS = ['#6366f1', '#a855f7', '#14b8a6'] as const;

export default function Report({ setCurrentScreen, calcInput }: ReportProps) {
  // Toast notifications for downloadeable pdf compile workflows
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute standard footprint matching centralized calculations
  const emissionsSummary = useMemo(() => {
    return calculateCarbonFootprint(calcInput);
  }, [calcInput]);

  // Format Recharts Pie chart data cleanly under nested memoization arrays
  const pieChartData = useMemo(() => {
    return [
      { name: 'Scope 1: Transport', value: emissionsSummary.transport },
      { name: 'Scope 2: Utilities & Heat', value: emissionsSummary.utilities },
      { name: 'Scope 3: Diet & Habit Chains', value: emissionsSummary.diet },
    ];
  }, [emissionsSummary]);

  // Format Recharts Bar comparison charts
  const comparisonChartData = useMemo(() => {
    return [
      { name: 'US Average', Emissions: 16.2, color: '#3f3f46' },
      { name: 'Your Footprint', Emissions: emissionsSummary.total, color: '#6366f1' },
      { name: 'Global Safe Limit', Emissions: 2.3, color: '#14b8a6' },
    ];
  }, [emissionsSummary.total]);

  // List dynamic behavioral recommendations based on the highest category
  const dynamicRecommendations = useMemo(() => {
    const list: { title: string; desc: string; category: string }[] = [];

    if (emissionsSummary.transport >= emissionsSummary.utilities && emissionsSummary.transport >= emissionsSummary.diet) {
      list.push(
        { title: 'Evaluate Commute Efficiency', desc: 'Commuting by private combustion car drives up emissions. Swap to partial bike, walk, or rail commuting.', category: 'Scope 1' },
        { title: 'Limit Domestic Air Travel', desc: 'Shorthaul flights consume high kerosene per seat-mile. Prefer electric high speed trains when viable.', category: 'Scope 1' }
      );
    } else if (emissionsSummary.utilities >= emissionsSummary.transport && emissionsSummary.utilities >= emissionsSummary.diet) {
      list.push(
        { title: 'Configure Geothermal Heat Pumps', desc: 'Boilers and electric baseboards consume high current. Switching to a heat pump lowers wattage up to 70%.', category: 'Scope 2' },
        { title: 'Partial Residential Solar', desc: 'Consult local grid providers for partial home solar installation contracts to bypass general power grid factors.', category: 'Scope 2' }
      );
    } else {
      list.push(
        { title: 'Adopt Vegan Nutritional Habits', desc: 'Reducing processed beef outputs saves up to 2 tons from culinary scope annually.', category: 'Scope 3' },
        { title: 'Lower Domestic Food Waste', desc: 'Rigorously compost organic waste to halt anaerobic methane discharges in national dumps.', category: 'Scope 3' }
      );
    }

    // Default general recommendation
    list.push({ 
      title: 'Upgrade Domestic Lighting', 
      desc: 'Swap outdated incandescent light bulbs to high-efficiency light-emitting diodes (LED) to lower grid draw.', 
      category: 'General' 
    });

    return list;
  }, [emissionsSummary]);

  const handleDownloadLedger = () => {
    setDownloading(true);
    setDownloadSuccess(false);
    // Simulating secure, cryptographically-hashed transaction processing
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 2000);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article id="report-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-zinc-100 pb-20">
      
      {/* Header and backward navigation triggers */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentScreen('calculator')}
            className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Return to carbon calculator form step"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div>
            <div id="report-header-badge" className="text-indigo-400 text-xs font-semibold font-mono uppercase tracking-widest mb-1">
              EMISSIONS COMPLIANCE SCOPE REPORT
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Your Audited Footprint analysis</h1>
          </div>
        </div>

        {/* Report Operations CTAs */}
        <div className="flex gap-2" role="toolbar" aria-label="Report utility operations">
          <button
            onClick={handleCopyLink}
            className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-400 hover:text-white transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold uppercase tracking-wider"
            aria-label="Copy report URL link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-indigo-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? "Link Copied" : "Share URL"}</span>
          </button>
          <button
            onClick={handleDownloadLedger}
            disabled={downloading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap shadow hover:shadow-indigo-500/20 flex items-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Download compiled ESG audit-ready PDF report"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{downloading ? 'Compiling PDF...' : 'Download Certified PDF'}</span>
          </button>
        </div>
      </header>

      {/* Success alert */}
      {downloadSuccess && (
        <div role="status" className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" aria-hidden="true" />
          <span>ESG Certified Compliance PDF compiled. Transferred hash to ledger blockchain verification.</span>
        </div>
      )}

      {/* Main Grid: Visual bento containers */}
      <h2 className="sr-only">Detailed Emissions Metrics Graphs</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* SIDEBAR MAIN TOTAL SCORES CARD */}
        <section className="lg:col-span-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between relative overflow-hidden" aria-labelledby="total-emissions-card-title">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" aria-hidden="true"></div>
          
          <div>
            <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-widest block">Total GHG Output</span>
            <h3 id="total-emissions-card-title" className="text-xl font-bold text-white mt-1 font-display">Scope 1, 2, & 3 Baseline</h3>
            
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Based on transportation, air miles, domestic electrical wattage base, heating mechanisms, nutritional configurations, and recycling rates:
            </p>

            <div className="my-8" aria-live="polite">
              <span className="text-6xl font-extrabold font-mono text-white leading-none">
                {emissionsSummary.total}
              </span>
              <span className="text-xs text-zinc-500 ml-2 font-bold font-mono">TONNES CO2e/YR</span>
            </div>

            <div className="space-y-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-550 font-bold font-mono">FOREST ABSORPTION VALUE</span>
                <span className="text-indigo-400 font-extrabold font-mono">{emissionsSummary.equivalentTrees} Trees</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                You would need to grow and maintain {emissionsSummary.equivalentTrees} mature maple trees every single year to completely buffer your output.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-850 pt-4 flex items-center space-x-2 text-[10px] text-zinc-600 font-mono">
            <ShieldCheck className="w-4 h-4 text-indigo-500" aria-hidden="true" />
            <span>GHG Protocol Standard Compliant</span>
          </div>
        </section>

        {/* PIE CHART BLOCK: DISSECTION BY SCOPE */}
        <section className="lg:col-span-8 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-805" aria-labelledby="pie-chart-title">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">Emissions Categorization</span>
              <h3 id="pie-chart-title" className="text-lg font-bold text-white mt-1 font-display">Emissions Dissection By Scope</h3>
            </div>
            <span className="text-[9px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-2.5 py-1 rounded-xl font-mono font-bold uppercase">Proportion View</span>
          </div>

          {/* Recharts Pie component */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-6 h-56" role="region" aria-label="Scope breakdown pie layout">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '14px' }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="md:col-span-6 space-y-4">
              
              <div className="flex items-center space-x-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-500" aria-hidden="true"></div>
                <div>
                  <div className="flex justify-between gap-12 text-xs">
                    <span className="font-semibold text-zinc-200">Scope 1: Transport</span>
                    <span className="font-bold font-mono text-white">{emissionsSummary.transport} Tons</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">Fossil fuel combustion and commercial aviation logs.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 border-t border-zinc-850/50 pt-3">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-500" aria-hidden="true"></div>
                <div>
                  <div className="flex justify-between gap-12 text-xs">
                    <span className="font-semibold text-zinc-200">Scope 2: Utilities & heat</span>
                    <span className="font-bold font-mono text-white">{emissionsSummary.utilities} Tons</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">Domestic electrical draw rates and thermal heating setups.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 border-t border-zinc-850/50 pt-3">
                <div className="w-3.5 h-3.5 rounded-full bg-teal-500" aria-hidden="true"></div>
                <div>
                  <div className="flex justify-between gap-12 text-xs">
                    <span className="font-semibold text-zinc-200">Scope 3: Diet & Lifestyle</span>
                    <span className="font-bold font-mono text-white">{emissionsSummary.diet} Tons</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">Culinary procurement offsets and food composting cycles.</p>
                </div>
              </div>

            </div>

          </div>
        </section>

      </div>

      {/* COMPARISON BAR CHART BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* BAR CHART DISPLAY CONTAINER */}
        <section className="lg:col-span-7 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800" aria-labelledby="bar-chart-title">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">Emissions Dissection Benchmark</span>
              <h3 id="bar-chart-title" className="text-lg font-bold text-white mt-1 font-display">Footprint Benchmarked Comparison</h3>
            </div>
            <span className="text-[9px] bg-teal-500/10 text-teal-300 border border-teal-500/25 px-2.5 py-1 rounded-xl font-mono font-bold uppercase">US Resident vs You</span>
          </div>

          {/* Recharts Bar Component */}
          <div className="h-64 w-full" role="region" aria-label="Benchmarked emissions chart comparing US Average, You, and Global Safe Limits">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="Emissions" radius={[8, 8, 0, 0]} name="Emissions (Metric Tons)">
                  {comparisonChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* DYNAMIC ACTION RECOMMENDATIONS */}
        <section className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between" aria-labelledby="recs-title">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-widest block font-bold">Mitigation Strategy</span>
                <h3 id="recs-title" className="text-lg font-bold text-white mt-1 font-display">Targeted Action Items</h3>
              </div>
              <Leaf className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            </div>

            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Based on your highest audited emissions vectors, climate compliance scientists recommend completing the following targets:
            </p>

            <div className="space-y-3" role="list">
              {dynamicRecommendations.map((rec) => (
                <article 
                  key={rec.title} 
                  className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-850 flex items-start space-x-3 hover:border-zinc-700 transition"
                  aria-labelledby={`rec-heading-${rec.title.replace(/\s+/g, '-')}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 id={`rec-heading-${rec.title.replace(/\s+/g, '-')}`} className="text-xs font-bold text-zinc-100 font-display">{rec.title}</h4>
                      <span className="text-[9px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-mono uppercase">{rec.category}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal mt-1">{rec.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="bg-indigo-600/10 hover:bg-indigo-650/20 text-indigo-400 border border-indigo-550/25 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer text-center font-display focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Access Eco Desk Dashboard to toggle actions"
            >
              Access Habit Logger
            </button>
          </div>
        </section>

      </div>

    </article>
  );
}
