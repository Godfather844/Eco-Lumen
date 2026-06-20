import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  TreePine, Trophy, Award, Zap, Navigation, CheckCircle2, Circle, ArrowUpRight, Droplet
} from 'lucide-react';
import { UserStats, ScreenType } from '../types';

interface DashboardProps {
  setCurrentScreen: (screen: ScreenType) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  actionStates: { [key: string]: boolean };
  toggleAction: (actionId: string, xpReward: number, offsetReward: number) => void;
}

// Monthly trend datasets
const CARBON_TREND_DATA = [
  { month: 'Jan', Footprint: 2.8, Target: 1.6 },
  { month: 'Feb', Footprint: 2.5, Target: 1.6 },
  { month: 'Mar', Footprint: 2.2, Target: 1.5 },
  { month: 'Apr', Footprint: 1.9, Target: 1.5 },
  { month: 'May', Footprint: 1.7, Target: 1.4 },
  { month: 'Jun', Footprint: 1.4, Target: 1.4 },
];

export default function Dashboard({ setCurrentScreen, stats, actionStates, toggleAction }: DashboardProps) {
  
  // Calculate raw progress percentages securely with mathematical guards
  const xpPct = useMemo(() => {
    return Math.min(100, Math.max(0, (stats.currentXP / Math.max(1, stats.nextLevelXP)) * 100));
  }, [stats.currentXP, stats.nextLevelXP]);

  // Circle Gauge SVG Stroke configurations
  const circleOffset = useMemo(() => {
    const rawVal = stats.sustainabilityScore;
    const boundedPct = Math.min(100, Math.max(0, rawVal));
    const circumference = 439.8; // 2 * Math.PI * radius (r=70)
    return circumference - (circumference * boundedPct) / 100;
  }, [stats.sustainabilityScore]);

  // Form key handler for the accessibility checkboxes to handle keyboard triggers
  const handleActionKeyDown = (e: React.KeyboardEvent, actionId: string, xp: number, co2: number) => {
    if (e.key === 'Spacebar' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleAction(actionId, xp, co2);
    }
  };

  return (
    <article id="dashboard-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-zinc-100 pb-20">
      
      {/* Header Row */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0 border-b border-zinc-900 pb-6">
        <div>
          <div className="text-indigo-400 text-xs font-semibold font-mono uppercase tracking-widest mb-1.5 animate-pulse">
            ENVIRONMENTAL ANALYSIS MEMBER NO. EL-924083
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Eco Desk Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Welcome back, <span className="text-zinc-100 font-semibold">{stats.name || 'Pioneer Tracker'}</span>. Here is your organizational environmental ledger.
          </p>
        </div>

        {/* Primary Objective Card */}
        <section className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl" aria-label="Objective settings">
          <img 
            referrerPolicy="no-referrer"
            src={stats.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"} 
            alt="User profile avatar settings" 
            className="w-10 h-10 rounded-xl border border-indigo-500/35 object-cover"
          />
          <div>
            <p className="text-[9px] text-zinc-400 font-mono uppercase tracking-wider font-bold">Stewardship Core Goal</p>
            <p className="text-xs font-bold text-indigo-400 font-display">{stats.goal || 'Optimize overall carbon footprint'}</p>
          </div>
        </section>
      </header>

      {/* Main Grid: Gauges & General Stats */}
      <h2 className="sr-only">Environmental KPI Gauges</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* CARD 1: SCORE CIRCULAR GAUGE CARD */}
        <motion.section 
          id="score-gauge-card"
          className="lg:col-span-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between items-center relative overflow-hidden text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-labelledby="score-gauge-title"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" aria-hidden="true"></div>
          
          <div className="w-full flex justify-between items-center mb-4">
            <span id="score-gauge-title" className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Climate Score Gauge</span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-2.5 py-0.5 rounded-full font-mono font-medium">Top 8% Global</span>
          </div>

          {/* Svg Circle Progress - Custom themed layout */}
          <div className="relative flex items-center justify-center my-6" aria-label={`Sustainability score is currently ${stats.sustainabilityScore} points`}>
            <svg className="w-40 h-40 transform -rotate-90" aria-hidden="true">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-zinc-800/70"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-indigo-500 transition-all duration-300"
                strokeWidth="10"
                strokeDasharray="439.8"
                strokeDashoffset={circleOffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-extrabold font-mono text-white leading-none">
                {stats.sustainabilityScore}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-1.5 uppercase tracking-wider font-bold">Points</span>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <h3 className="text-sm font-bold text-white flex items-center justify-center space-x-1.5 font-display">
              <Award className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Status Level: {stats.levelName}</span>
            </h3>
            <p className="text-zinc-400 text-xs px-2 leading-relaxed">
              Based on utility logging, diet factors, and transit cycles. Complete tasks below to level up.
            </p>
          </div>
        </motion.section>

        {/* CARD 2: PERSONAL ECO TREE MASCOT */}
        <motion.section 
          id="personal-eco-tree-card"
          className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-labelledby="mascot-section-title"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">Carbon Absorption Mascot</span>
              <h3 id="mascot-section-title" className="text-lg font-bold text-white mt-1 font-display">Personal Eco Tree</h3>
            </div>
            <button 
              className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 p-2 rounded-xl cursor-pointer transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              onClick={() => setCurrentScreen('guide')}
              aria-label="View interactive impact guide map details"
            >
              <TreePine className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            </button>
          </div>

          {/* Showcase Mascot Artwork */}
          <div className="grid grid-cols-12 gap-4 items-center my-2">
            <div className="col-span-4 relative">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-teal-950/20 shadow-inner">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDdv9PKCDSBbAV3uiCAtNdtm9jiJ6FL7z6SG6wvywJiF0eR5QHSlWG2kWfP-8gt9HLd9xDS3XpdkJJdD050SZlbU4q4lfywBd6cJQEAD51SdjM_imoY62cRpg1xvTk3sOsS1qCcHYJTNOf91UKOUXcWUj3WFyVQ9ZFVG8lMa8cZ_-Nl6PLIqb08GHIyzYKpAvLgCs-LNV4J5RhiSS01l8NDO48Ot0txGgOk4d9HMkmgWII3m7inqAqlh1O4rNLjESiw_m3t9dL3cBv" 
                  alt="A majestic glowing green digital bonsai sapling rooted deep in fertile rich soil, symbolizing active eco tracking milestones" 
                  className="w-full h-24 object-cover object-center group-hover:scale-105 transition-all duration-300" 
                />
              </div>
            </div>
            
            <div className="col-span-8 space-y-1">
              <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-extrabold">Mascot Grade</p>
              <h4 className="text-sm font-bold text-zinc-100 font-display">Level 4: Giant Maple Sapling</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">This digital tree represents 1.8 metric tons of offset potential grown by tracking habits.</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono font-medium">
              <span className="text-zinc-500 font-bold">Seed Growth Stage</span>
              <span className="text-indigo-400 font-bold font-mono">{stats.currentXP} / {stats.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800/50 p-0.5">
              <div 
                style={{ width: `${xpPct}%` }} 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                role="progressbar"
                aria-valuenow={stats.currentXP}
                aria-valuemin={0}
                aria-valuemax={stats.nextLevelXP}
                aria-label="Mascot XP progress"
              ></div>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono italic block">Complete action-step tasks below to deposit real-life XP offset points.</span>
          </div>

        </motion.section>

        {/* CARD 3: KEY ENVIRONMENTAL METRICS GRID */}
        <section className="lg:col-span-3 grid grid-cols-1 gap-4" aria-label="Stewardship tracking logs summary">
          
          {/* Item 1: Carbon Offset */}
          <article className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/80 flex flex-col justify-between" aria-label="Direct Net Carbon Saved kpi">
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Carbon Offset Saved</span>
              <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white">{stats.directCarbonSaved.toFixed(2)} Tons</p>
              <span className="text-[10px] text-indigo-400 font-medium font-sans">Reduction achieved from checklist habits</span>
            </div>
          </article>

          {/* Item 2: Water Converted */}
          <article className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/85 flex flex-col justify-between" aria-label="Direct Net Water Saved kpi">
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Water Conserved</span>
              <Droplet className="w-4 h-4 text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white">{stats.waterConserved.toLocaleString()} Gal</p>
              <span className="text-[10px] text-teal-400 font-medium font-sans">Water offset compiled from log diets</span>
            </div>
          </article>

          {/* Item 3: Grid Clean Energy */}
          <article className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/80 flex flex-col justify-between" aria-label="Percentage Green Energy utility base config">
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Grid Energy Source</span>
              <Zap className="w-4 h-4 text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white">{stats.greenEnergyPct}% Clean</p>
              <span className="text-[10px] text-purple-400 font-medium font-sans">Active electrical supply grid setting</span>
            </div>
          </article>

        </section>

      </div>

      {/* Second Row Grid: Action Steps checklist & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: ACTION STEPS CARD CONTROLLER */}
        <motion.section 
          id="action-steps-card"
          className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          aria-labelledby="habit-checklist-label"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block">Daily Reduction Habits</span>
                <h3 id="habit-checklist-label" className="text-lg font-bold text-white mt-1 font-display">Check-in Action Steps</h3>
              </div>
              <span className="text-[9px] text-amber-400 font-mono border border-amber-500/20 px-2 py-0.5 rounded-full bg-amber-500/5 font-bold uppercase tracking-wide">XP BOOSTER</span>
            </div>

            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Toggle actions below when you complete them in daily life. This dynamically updates your overall sustainability score, deposits points into your maple seed progress, and saves real-world carbon.
            </p>

            {/* Checklist Items */}
            <div className="space-y-3" role="group" aria-label="Sustainability daily actions checkboxes">
              
              {/* Item 1: Unplug Overnight */}
              <button
                id="act-unplug"
                role="checkbox"
                aria-checked={actionStates['unplug'] === true}
                onClick={() => toggleAction('unplug', 25, 0.015)}
                onKeyDown={(e) => handleActionKeyDown(e, 'unplug', 25, 0.015)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  actionStates['unplug'] 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' 
                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {actionStates['unplug'] ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600 flex-shrink-0" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-display">Unplug electronics overnight</span>
                    <span className="text-[9px] font-mono bg-zinc-900 py-0.5 px-2 rounded-lg text-zinc-400 font-bold">+25 XP</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Shuts down ghost load currents immediately. Saves 15kg CO2.</p>
                </div>
              </button>

              {/* Item 2: Public Transit */}
              <button
                id="act-transit"
                role="checkbox"
                aria-checked={actionStates['transit'] === true}
                onClick={() => toggleAction('transit', 50, 0.05)}
                onKeyDown={(e) => handleActionKeyDown(e, 'transit', 50, 0.05)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  actionStates['transit'] 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' 
                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {actionStates['transit'] ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600 flex-shrink-0" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-display">Use public transit or bike</span>
                    <span className="text-[9px] font-mono bg-zinc-900 py-0.5 px-2 rounded-lg text-zinc-400 font-bold">+50 XP</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Displace personal combustion engine outputs. Saves 50kg CO2.</p>
                </div>
              </button>

              {/* Item 3: Plantmeal */}
              <button
                id="act-meal"
                role="checkbox"
                aria-checked={actionStates['meal'] === true}
                onClick={() => toggleAction('meal', 40, 0.035)}
                onKeyDown={(e) => handleActionKeyDown(e, 'meal', 40, 0.035)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  actionStates['meal'] 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' 
                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {actionStates['meal'] ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600 flex-shrink-0" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-display">Try plant-based gourmet meal</span>
                    <span className="text-[9px] font-mono bg-zinc-900 py-0.5 px-2 rounded-lg text-zinc-400 font-bold">+40 XP</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Reduces beef/mutton procurement outputs. Saves 35kg CO2.</p>
                </div>
              </button>

            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 italic font-mono">Scores refresh every 24 hours.</span>
            <button
              onClick={() => setCurrentScreen('guide')}
              className="text-indigo-450 text-xs font-bold font-display hover:underline flex items-center space-x-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
              aria-label="See details of the Habit log guide"
            >
              <span>See Habit Log details</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </motion.section>

        {/* COLUMN 2: CARBON FOOTPRINT MONTHLY TREND AREA CHART */}
        <motion.section 
          id="progress-trends-card"
          className="lg:col-span-7 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          aria-labelledby="trends-chart-title"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">Carbon Ledger History</span>
                <h3 id="trends-chart-title" className="text-lg font-bold text-white mt-1 font-display">Progress & Trends</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-zinc-950 text-indigo-400 border border-zinc-800 font-mono py-1 px-3 rounded-xl font-bold uppercase">Scope 1 & 2 Audits</span>
              </div>
            </div>

            {/* Recharts Trend Area Chart wrapped with size bounds */}
            <div className="h-68 w-full mt-4" role="region" aria-label="Annual Carbon Footprint reduction area trends chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CARBON_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '16px' }}
                    labelStyle={{ color: '#a1a1aa', fontFamily: 'monospace', fontWeight: 'bold' }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  
                  {/* Target reference line */}
                  <Area type="monotone" dataKey="Target" name="Global Target Limit" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
                  {/* Personal reduction trend line */}
                  <Area type="monotone" dataKey="Footprint" name="Your Footprint (Tons)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorFootprint)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-300 font-semibold font-display">Ready for a complete Scope 1, 2, and 3 footprint audit?</p>
              <p className="text-[10px] text-zinc-500 leading-normal">Complete the 3-minute Carbon Footprint Calculator to download certified environmental logs.</p>
            </div>
            <button
              onClick={() => setCurrentScreen('calculator')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap shadow transition-colors cursor-pointer font-display uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Start Carbon Footprint Calculator"
            >
              Start Calculator
            </button>
          </div>
        </motion.section>

      </div>

      {/* REWARDS / BADGES SECTION */}
      <section id="milestones-badges" className="mt-8 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800" aria-labelledby="milestones-section-title">
        <div id="milestones-header" className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">Account Badges</span>
            <h3 id="milestones-section-title" className="text-lg font-bold text-white mt-1 font-display">Milestones & Badges</h3>
          </div>
          <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">UNLOCKED (2/3)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Badge 1 */}
          <article className="bg-zinc-950/60 p-5 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/45 transition-colors flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0" aria-hidden="true">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Eco Explorer Lvl 1</h4>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Unlocked by configuring your account and completing your first Carbon analysis audit.</p>
              <span className="inline-block mt-2 text-[10px] bg-indigo-500/20 text-indigo-300 py-0.5 px-2 rounded-lg font-mono font-bold tracking-wider">UNLOCKED</span>
            </div>
          </article>

          {/* Badge 2 */}
          <article className="bg-zinc-950/60 p-5 rounded-2xl border border-teal-500/20 hover:border-teal-500/40 transition-colors flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0" aria-hidden="true">
              <Navigation className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Clean Transit Hero</h4>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Unlocked by logging public transport transit steps 3 days in a row.</p>
              <span className="inline-block mt-2 text-[10px] bg-teal-500/20 text-teal-400 py-0.5 px-2 rounded-lg font-mono font-bold tracking-wider">UNLOCKED</span>
            </div>
          </article>

          {/* Badge 3 (Locked) */}
          <article className="bg-zinc-950/65 p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center space-x-4 opacity-75">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0" aria-hidden="true">
              <Zap className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-400 font-display">Master Recycler</h4>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Achieve 85% weekly recycling targets through systematic logs.</p>
              <span className="inline-block mt-2 text-[10px] bg-zinc-800 text-zinc-400 py-0.5 px-2 rounded-lg font-mono font-bold tracking-wider">LOCKED (45/100 XP)</span>
            </div>
          </article>

        </div>
      </section>

    </article>
  );
}
