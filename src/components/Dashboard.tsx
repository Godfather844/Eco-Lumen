import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  TreePine, Trophy, Award, Zap, Navigation, Play, CheckCircle2, Circle, ArrowUpRight, Droplet
} from 'lucide-react';
import { UserStats, ScreenType } from '../types';

interface DashboardProps {
  setCurrentScreen: (screen: ScreenType) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  actionStates: { [key: string]: boolean };
  toggleAction: (actionId: string, xpReward: number, offsetReward: number) => void;
}

// Fixed trend data for Recharts, aligned with the bento colors
const carbonTrendData = [
  { month: 'Jan', Footprint: 2.8, Target: 1.6 },
  { month: 'Feb', Footprint: 2.5, Target: 1.6 },
  { month: 'Mar', Footprint: 2.2, Target: 1.5 },
  { month: 'Apr', Footprint: 1.9, Target: 1.5 },
  { month: 'May', Footprint: 1.7, Target: 1.4 },
  { month: 'Jun', Footprint: 1.4, Target: 1.4 },
];

export default function Dashboard({ setCurrentScreen, stats, setStats, actionStates, toggleAction }: DashboardProps) {
  
  // XP Progress Pct
  const xpPct = Math.min(100, Math.max(0, (stats.currentXP / stats.nextLevelXP) * 100));

  return (
    <div id="dashboard-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white pb-20">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="text-indigo-400 text-xs font-semibold font-mono uppercase tracking-widest mb-1.5 animate-pulse">
            MEMBER NO. EL-924083
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display">Eco Desk Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Welcome back, <span className="text-zinc-100 font-semibold">{stats.name || 'Pioneer Tracker'}</span>. Here is your environmental analytics ledger for this period.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl">
          <img 
            referrerPolicy="no-referrer"
            src={stats.avatar} 
            alt="User profile avatar" 
            className="w-10 h-10 rounded-xl border border-indigo-500/35 object-cover"
          />
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Primary Objective</p>
            <p className="text-xs font-semibold text-indigo-400 font-display">{stats.goal || 'Optimize overall carbon footprint'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Gauges & General Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* CARD 1: SCORE CIRCULAR GAUGE CARD (lg:col-span-4) */}
        <motion.div 
          id="score-gauge-card"
          className="lg:col-span-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between items-center relative overflow-hidden text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full"></div>
          
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Climate Score</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-2.5 py-0.5 rounded-full font-mono font-medium">Top 8%</span>
          </div>

          {/* Svg Circle Progress - Customized with beautiful index-based indigo outline */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Outer boundary trail */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-zinc-850"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Foreground animated value */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-indigo-500 transition-all duration-500"
                strokeWidth="10"
                strokeDasharray="439.8"
                strokeDashoffset={439.8 - (439.8 * stats.sustainabilityScore) / 100}
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
              <Award className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Status: {stats.levelName}</span>
            </h3>
            <p className="text-zinc-400 text-xs px-2 leading-relaxed">
              Based on utility logging, low dietary footprint, and transit choices. Complete tasks below to level up.
            </p>
          </div>
        </motion.div>

        {/* CARD 2: PERSONAL ECO TREE (lg:col-span-5) */}
        <motion.div 
          id="personal-eco-tree-card"
          className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">Carbon Absorption Mascot</span>
              <h3 className="text-lg font-bold text-white mt-1 font-display">Personal Eco Tree</h3>
            </div>
            <button 
              className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-455 hover:bg-indigo-500/20 p-2 rounded-xl cursor-pointer transition-colors" 
              onClick={() => setCurrentScreen('guide')}
            >
              <TreePine className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          {/* Showcase Artwork */}
          <div className="grid grid-cols-12 gap-4 items-center my-2">
            <div className="col-span-4 relative">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-teal-950/10">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDdv9PKCDSBbAV3uiCAtNdtm9jiJ6FL7z6SG6wvywJiF0eR5QHSlWG2kWfP-8gt9HLd9xDS3XpdkJJdD050SZlbU4q4lfywBd6cJQEAD51SdjM_imoY62cRpg1xvTk3sOsS1qCcHYJTNOf91UKOUXcWUj3WFyVQ9ZFVG8lMa8cZ_-Nl6PLIqb08GHIyzYKpAvLgCs-LNV4J5RhiSS01l8NDO48Ot0txGgOk4d9HMkmgWII3m7inqAqlh1O4rNLjESiw_m3t9dL3cBv" 
                  alt="A majestic glowing green digital bonsai sapling rooted deep in fertile rich soil, symbolizing active eco tracking milestone expansion" 
                  className="w-full h-24 object-cover object-center group-hover:scale-105 transition-transform" 
                />
              </div>
            </div>
            
            <div className="col-span-8 space-y-1">
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-extrabold font-bold">Active Tree Grade</p>
              <h4 className="text-sm font-bold text-zinc-205 font-display">Level 4: Giant Maple Sapling</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">This digital tree represents 1.8 metric tons of offset potential grown by logging sustainable habits.</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono font-medium">
              <span className="text-zinc-500 font-bold">Next Growth Stage</span>
              <span className="text-indigo-400 font-bold font-mono">{stats.currentXP} / {stats.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800/50 p-0.5">
              <div 
                style={{ width: `${xpPct}%` }} 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
              ></div>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono italic block">Complete any action-step list task to deposit real XP points.</span>
          </div>

        </motion.div>

        {/* CARD 3: KEY METRICS GRID (lg:col-span-3) */}
        <div className="lg:col-span-3 grid grid-cols-1 gap-4">
          
          {/* Sub-item: Direct Carbon */}
          <div className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/80 flex flex-col justify-between">
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Carbon Offset</span>
              <Trophy className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white">{stats.directCarbonSaved.toFixed(2)} Tons</p>
              <span className="text-[10px] text-indigo-400 font-medium font-sans">Direct reduction achieved</span>
            </div>
          </div>

          {/* Sub-item: Water conserved */}
          <div className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/85 flex flex-col justify-between">
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Water Conserved</span>
              <Droplet className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white">{stats.waterConserved.toLocaleString()} Gal</p>
              <span className="text-[10px] text-teal-400 font-medium font-sans">From meat and recycling habit shifts</span>
            </div>
          </div>

          {/* Sub-item: Green Energy Percentage */}
          <div className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/80 flex flex-col justify-between">
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Grid Clean Energy</span>
              <Zap className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white">{stats.greenEnergyPct}% Clean</p>
              <span className="text-[10px] text-purple-400 font-medium font-sans">Active electrical power base</span>
            </div>
          </div>

        </div>

      </div>

      {/* Second Row Grid: Action Steps checklist & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: ACTION STEPS CARD (lg:col-span-5) */}
        <motion.div 
          id="action-steps-card"
          className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-450 font-bold uppercase tracking-widest block">Today's Reduction Ledger</span>
                <h3 className="text-lg font-bold text-white mt-1 font-display">Action Steps</h3>
              </div>
              <span className="text-[9px] text-amber-400 font-mono border border-amber-500/20 px-2 py-0.5 rounded-full bg-amber-500/5 font-bold uppercase tracking-wide">Interactive XP booster</span>
            </div>

            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Toggle actions below when you complete them in daily life. This dynamically updates your overall sustainability score, deposits points into your maple seed bank, and saves real-world carbon.
            </p>

            {/* Checklist Items */}
            <div className="space-y-3">
              
              {/* Item 1 */}
              <button
                id="act-unplug"
                onClick={() => toggleAction('unplug', 25, 0.015)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 ${
                  actionStates['unplug'] 
                    ? 'bg-indigo-505/10 border-indigo-500/40 text-indigo-300' 
                    : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {actionStates['unplug'] ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-650 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-display">Unplug electronics overnight</span>
                    <span className="text-[9px] font-mono bg-zinc-900 py-0.5 px-2 rounded-lg text-zinc-450 font-bold">+25 XP</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Shuts down ghost load currents immediately. saves 15kg CO2.</p>
                </div>
              </button>

              {/* Item 2 */}
              <button
                id="act-transit"
                onClick={() => toggleAction('transit', 50, 0.05)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 ${
                  actionStates['transit'] 
                    ? 'bg-indigo-505/10 border-indigo-500/40 text-indigo-300' 
                    : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {actionStates['transit'] ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-650 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-display">Use public transit or bike</span>
                    <span className="text-[9px] font-mono bg-zinc-900 py-0.5 px-2 rounded-lg text-zinc-455 font-bold">+50 XP</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Displace personal combustion engine transit outputs. saves 50kg CO2.</p>
                </div>
              </button>

              {/* Item 3 */}
              <button
                id="act-meal"
                onClick={() => toggleAction('meal', 40, 0.035)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 ${
                  actionStates['meal'] 
                    ? 'bg-indigo-505/10 border-indigo-500/40 text-indigo-300' 
                    : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {actionStates['meal'] ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-650 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-display">Try plant-based gourmet meal</span>
                    <span className="text-[9px] font-mono bg-zinc-900 py-0.5 px-2 rounded-lg text-zinc-450 font-bold">+40 XP</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Reducing beef/mutton procurement outputs. saves 35kg CO2.</p>
                </div>
              </button>

            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-850 flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 italic font-mono">Scores refresh every 24 hours.</span>
            <button
              onClick={() => setCurrentScreen('guide')}
              className="text-indigo-400 text-xs font-bold font-display hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>See Habit Log details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* COLUMN 2: CARBON FOOTPRINT MONTHLY TREND (lg:col-span-7) */}
        <motion.div 
          id="progress-trends-card"
          className="lg:col-span-7 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-mono text-zinc-450 font-bold uppercase tracking-wider block">Carbon Ledger History</span>
                <h3 className="text-lg font-bold text-white mt-1 font-display">Progress & Trends</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-zinc-950 text-indigo-400 border border-zinc-800 font-mono py-1 px-3 rounded-xl font-bold uppercase">Scope 1 & 2</span>
              </div>
            </div>

            {/* Recharts Trend Area Chart */}
            <div className="h-68 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={carbonTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  <Area type="monotone" dataKey="Target" name="Global Target" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
                  {/* Personal reduction trend line */}
                  <Area type="monotone" dataKey="Footprint" name="Your Footprint (Tons)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorFootprint)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-300 font-semibold font-display">Ready for a comprehensive emissions breakdown report?</p>
              <p className="text-[10px] text-zinc-500 leading-normal">Complete the 3-minute Carbon Footprint Calculator to audit Scope 1, 2, and 3 outputs completely.</p>
            </div>
            <button
              onClick={() => setCurrentScreen('calculator')}
              className="bg-indigo-600 hover:bg-indigo-505 text-white py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap shadow transition-colors cursor-pointer font-display uppercase tracking-wider"
            >
              Start Calculator
            </button>
          </div>
        </motion.div>

      </div>

      {/* CARD 5: ACHIEVEMENTS / REWARDS SYSTEM (BENTO BOTTOM BLOCK) */}
      <section id="milestones-badges" className="mt-8 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800">
        <div id="milestones-header" className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-mono text-zinc-405 font-bold uppercase tracking-wider block">Completed Goals</span>
            <h3 className="text-lg font-bold text-white mt-1 font-display">Milestones & Badges</h3>
          </div>
          <span className="text-xs text-indigo-405 font-mono font-bold uppercase tracking-wider">Unlocked (2/3)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Badge 1 */}
          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5 font-display">
                <span>Eco Explorer Lvl 1</span>
              </h4>
              <p className="text-zinc-400 text-xs mt-1 leading-normal text-zinc-400 leading-relaxed">Unlocked by configuring your account and completing your first Carbon analysis audit.</p>
              <span className="inline-block mt-2 text-[10px] bg-indigo-500/20 text-indigo-400 py-0.5 px-2 rounded-lg font-mono font-bold tracking-wider">UNLOCKED</span>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-teal-500/20 hover:border-teal-500/40 transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0">
              <Navigation className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5 font-display">
                <span>Clean Transit Hero</span>
              </h4>
              <p className="text-zinc-405 text-xs mt-1 leading-normal text-zinc-400 leading-relaxed">Unlocked by logging public transport transit steps 3 days in a row.</p>
              <span className="inline-block mt-2 text-[10px] bg-teal-500/20 text-teal-400 py-0.5 px-2 rounded-lg font-mono font-bold tracking-wider">UNLOCKED</span>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="bg-zinc-950/65 p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center space-x-4 opacity-75">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0">
              <Zap className="w-6 h-6 text-zinc-450" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-400 font-display">Master Recycler</h4>
              <p className="text-zinc-500 text-xs mt-1 leading-normal text-zinc-400 leading-relaxed">Achieve 85% weekly recycling targets through systematic logs.</p>
              <span className="inline-block mt-2 text-[10px] bg-zinc-800 text-zinc-400 py-0.5 px-2 rounded-lg font-mono font-bold tracking-wider">LOCKED (45/100 XP)</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
