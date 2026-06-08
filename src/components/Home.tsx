import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, Cpu, RefreshCw, BarChart3, 
  HelpCircle, CheckCircle, TrendingDown, Users, Trees
} from 'lucide-react';
import { ScreenType } from '../types';

interface HomeProps {
  setCurrentScreen: (screen: ScreenType) => void;
}

export default function Home({ setCurrentScreen }: HomeProps) {
  // Interactive Sustainability Simulator state
  const [effortLevel, setEffortLevel] = useState<number>(45);

  // Dynamic calculations for the simulator
  // 100% effort level reduces footprint significantly and speeds up neutrality target.
  const baselineFootprint = 18.4; // Metric tons per user or million tons per company
  const simulatedFootprint = Math.max(2.1, Number((baselineFootprint * (1 - effortLevel / 100)).toFixed(1)));
  const simulatedOffset = Math.min(10.0, Number((effortLevel * 0.1).toFixed(1)));
  const targetYear = Math.max(2028, 2050 - Math.floor(effortLevel * 0.22));

  return (
    <div id="home-screen" className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-600 selection:text-white pb-16 font-sans">
      
      {/* SECTION 1: HERO SECTION */}
      <section id="hero-banner" className="relative overflow-hidden pt-12 md:pt-16 pb-20 border-b border-zinc-900">
        <div id="hero-dot-pattern" className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              className="lg:col-span-7 flex flex-col space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div id="hero-badge" className="inline-flex self-start items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 py-1.5 px-3 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span>The Modern Paradigm of Climate Tech</span>
              </div>

              <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none font-display">
                Lighting the Way to a{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-500 bg-clip-text text-transparent">
                  Carbon-Neutral
                </span>{' '}
                Tomorrow
              </h1>

              <p id="hero-subtext" className="text-zinc-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
                Eco-Lumen delivers a dual perspective of climate stewardship. Our platform serves corporate environments with high-precision regulatory reporting, and engages employees with interactive daily habit tracking and visual gamification.
              </p>

              <div id="hero-ctas" className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  id="hero-primary-cta"
                  onClick={() => setCurrentScreen('calculator')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold font-display uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-indigo-500/20 cursor-pointer group transition-all duration-205"
                >
                  <span>Begin Your Analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="hero-secondary-cta"
                  onClick={() => setCurrentScreen('log-progress')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-zinc-700 px-6 py-3.5 rounded-2xl text-xs font-extrabold font-display uppercase tracking-wider text-center transition-all duration-200 cursor-pointer"
                >
                  Join Employee Movement
                </button>
              </div>

              {/* Instant Social / Stat Proof */}
              <div className="grid grid-cols-3 gap-6 border-t border-zinc-900 pt-8 mt-4 font-display">
                <div>
                  <p className="text-3xl font-extrabold text-indigo-400 font-mono">14.2 kt</p>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase font-bold">CO2 OFFSET WORLDWIDE</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-400 font-mono">92%</p>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase font-bold">REDUCTION METRIC HIT</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-400 font-mono">45k+</p>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase font-bold">Active Habit Trackers</p>
                </div>
              </div>
            </motion.div>

            {/* Right Graphic/Image Column */}
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div id="hero-photo-wrapper" className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                <img 
                  id="hero-brand-img"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuvIw-yzmlPbfszilYSAVBD0mGPepKl9LvjWxYg3krMNLXKwFU7Wes8xh22zLFMbgQoGM2WTiYhV_0WMst9s_9JmedOButasK7oqF7_kNA9ILZeFCwAR1mfZiDFckkh0F55uyFiNznTMbkE8WxltxdArREMXJVyy0Lq1EKM5mgzN2Nl8AaiVs77Ui4HRd0cFzbaaXkCH68OeLwmGHZilEE0GYbcdSvMIn0PbrroGppSKzoyIq2c_Wg5XLV4q30k7rDSZZBpyuu3E1r" 
                  alt="Sleek Wind Farms and Grid Infrastructure representing carbon-neutral energy logistics" 
                  className="w-full h-96 object-cover object-bottom opacity-75 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-extrabold">Active Grid Sync</p>
                      <p className="text-xs font-semibold text-zinc-200">Austin solar fields log live metrics</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 py-1 px-2.5 rounded-full font-mono font-bold animate-pulse">SYSTEM OPTIMAL</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: THE SMARTER METHOD (4 BENTO BLOCKS) */}
      <section id="bento-presentation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono">
            Core Methodologies
          </span>
          <h2 id="bento-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            A Smarter Method of Environmental Stewardship
          </h2>
          <p id="bento-subheading" className="text-zinc-400 text-base mt-4 font-normal">
            Whether you are looking to audit your business scope emissions or start employee sustainability challenges, we equip you with high-precision modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Automatic Sync - Indigo themed bento box */}
          <motion.div 
            id="bento-card-1"
            className="group relative bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800/80 hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div id="bento-dec-1" className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
            <div>
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">1. Automatic Utility Synchronization</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Effortlessly hook up municipal power configurations, smart thermostat records, logistics providers, and corporate procurement channels via OAuth secure frameworks. Receive clean carbon audits with zero manual data entry required.
              </p>
            </div>
            <div className="mt-8 flex items-center text-indigo-400 text-xs font-bold uppercase tracking-wider space-x-1.5 group-hover:translate-x-2 transition-transform font-display">
              <span>View Data Connectors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 2: Compelling Analytics - Purple themed bento box */}
          <motion.div 
            id="bento-card-2"
            className="group relative bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800/80 hover:border-purple-500/40 hover:shadow-purple-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div id="bento-dec-2" className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full"></div>
            <div>
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/25 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">2. Scope 1, 2, and 3 GHG Reporting</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Log direct emissions (fuel combustion), indirect emissions (electricity grids), and third-party logistics. Automatically categorize and breakdown offsets to achieve 5-star climate score compliance.
              </p>
            </div>
            <div className="mt-8 flex items-center text-purple-400 text-xs font-bold uppercase tracking-wider space-x-1.5 group-hover:translate-x-2 transition-transform font-display">
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 3: High Precision Audit - Teal themed bento box */}
          <motion.div 
            id="bento-card-3"
            className="group relative bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800/80 hover:border-teal-500/40 hover:shadow-teal-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div id="bento-dec-3" className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full"></div>
            <div>
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/25 rounded-2xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">3. Third-Party Audit Validation Ready</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Ensure regulatory compliance for audit-verified reporting (e.g. SEC Carbon rules, CSRD Directive). Data structures store verifiable, cryptographically checkable transaction hashes linking carbon logs cleanly.
              </p>
            </div>
            <div className="mt-8 flex items-center text-teal-400 text-xs font-bold uppercase tracking-wider space-x-1.5 group-hover:translate-x-2 transition-transform font-display">
              <span>Audit Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 4: Forecast Simulator - Orange/Amber themed bento box */}
          <motion.div 
            id="bento-card-4"
            className="group relative bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800/80 hover:border-amber-500/40 hover:shadow-amber-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div id="bento-dec-4" className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
            <div>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">4. Dynamic Offset Scenario Forecasting</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Simulate transition timelines dynamically. Calculate immediate environmental and bottom-line impacts of changing logistics parameters, switching to a hybrid workspace, or converting local microgrids.
              </p>
            </div>
            <div className="mt-8 flex items-center text-amber-400 text-xs font-bold uppercase tracking-wider space-x-1.5 group-hover:translate-x-2 transition-transform font-display">
              <span>Open Simulation Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: INTERACTIVE SUSTAINABILITY SIMULATOR WIDGET */}
      <section id="interactive-simulator-section" className="bg-zinc-950/40 py-16 border-y border-zinc-905 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Simulator Left Intro */}
            <div className="lg:col-span-5 space-y-6">
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono inline-block">
                LIVE COMPLIANCE FORECASTER
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight font-display">
                Simulate Your Organizational Effort
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Adjust the sliding environmental effort gauge to approximate the reduction targets. View the real-time simulation engine calculating emissions reduction schedules, offset rates, and carbon-neutral milestones immediately.
              </p>
              
              <div className="p-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl flex items-start space-x-3 text-xs text-zinc-400 leading-relaxed">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>The system scales your Scope 1 carbon outputs directly based on transit models and hybrid electric source distribution.</span>
              </div>
            </div>

            {/* Simulator Right Play area - Designed as a beautiful bento dashboard */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-indigo-400 text-xs font-mono font-extrabold uppercase tracking-widest block">Active Reduction Level</span>
                  <span className="text-xl font-bold font-mono text-zinc-100">{effortLevel}% Impact Focus</span>
                </div>

                {/* Range Slider */}
                <div id="effort-slider-group" className="space-y-4 mb-8">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">
                    <span>MIN (0%)</span>
                    <span>MID GOAL</span>
                    <span>REVO (100%)</span>
                  </div>
                  <input
                    id="sim-effort-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={effortLevel}
                    onChange={(e) => setEffortLevel(Number(e.target.value))}
                    className="w-full h-2.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-indigo-600 outline-none active:scale-[0.99] transition-transform"
                  />
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-zinc-950 border border-zinc-800/50">
                      <div 
                        style={{ width: `${effortLevel}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150"
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Simulated Metrics Screen Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80">
                  
                  {/* KPI 1 */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Simulated Footprint</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-white font-mono">{simulatedFootprint}</span>
                      <span className="text-xs text-zinc-400"> Tons</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      -{Math.round((baselineFootprint - simulatedFootprint) / baselineFootprint * 100)}% decrease
                    </span>
                  </div>

                  {/* KPI 2 */}
                  <div className="border-t sm:border-t-0 sm:border-x border-zinc-900 pt-4 sm:pt-0 sm:px-6 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Net Offset</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-white font-mono">{simulatedOffset}</span>
                      <span className="text-xs text-zinc-400"> Tons</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-sans font-medium block">Reforest Equivalent</span>
                  </div>

                  {/* KPI 3 */}
                  <div className="border-t sm:border-t-0 pt-4 sm:pt-0 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Neutral target</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-purple-400 font-mono">{targetYear}</span>
                    </div>
                    <span className="text-[11px] text-indigo-400 font-bold block">
                      {targetYear <= 2035 ? 'Aggressive Shift' : 'Standard Path'}
                    </span>
                  </div>

                </div>
              </div>

              {/* Action Button inside simulator */}
              <div className="mt-8 flex justify-end">
                <button
                  id="sim-action-btn"
                  onClick={() => setCurrentScreen('calculator')}
                  className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center space-x-2 font-display"
                >
                  <span>Build Live Plan with Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CORE FEATURES GRID */}
      <section id="features-highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
              Designed for Employees, Trusted by Auditors
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
              Eco-Lumen balances two distinct targets: delivering precision compliance workflows for corporate reporting, and engaging employees with fun logs, social achievements, and active eco-tree growth metrics.
            </p>
          </div>
          <div className="lg:col-span-1 lg:text-right">
            <button
              onClick={() => setCurrentScreen('log-progress')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-indigo-500/20 cursor-pointer transition-colors"
            >
              Sign Up Your Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature Card 1 */}
          <div className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 font-display">Carbon Dashboard</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Fully interactive analytics visualizer mapping monthly usage averages against global sustainability benchmarks.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 font-display">Automated Compliance</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              One-click compliance reporting compiled in PDF format, ready to direct to ESG compliance agencies.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 mb-4 font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 font-display">Interactive habit log</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Check actions to update XP booster and footprint projection instantly. Set reminders to stay clean.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-4 font-bold">
              <Trees className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2 font-display">Personal Eco Tree</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Gamified carbon absorption milestone widget. Watch employee-specific tree tokens grow on your dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 5: HERO 3 */}
      <section id="hero-3-cta-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
          <img 
            id="hero-landscape-img"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1c8bwmLwhSQkuYsWmkVYFMAaq0Uscn111jA8t6WE9fYCnv5XGfHuRWKUHmzOrH2UU3B-YHoCNmWF2txIPVUsSfXjwDVFl8TgEYN-KYee0HH3hwU9hQFFyIMmVyLPIf1_Ix89bSUFu_q9787IHL_SdrtRRsuuFEzhZ0h5dCE9xx04a5Q4QagxNkKatSe-4ma9c4NdYGLs9WoRGxc6nUIRMr4Kztl2fjluHuGWD_xWXX8pA-WgLU41tjD6a4vpORswT-9oX2rX7mDBq" 
            alt="Wide majestic high contrast landscape representing clean energy future" 
            className="absolute inset-0 w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
          
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 max-w-2xl flex flex-col space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
              Are you ready to redefine your environmental legacy?
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed">
              Start by modeling your dynamic profile using our multi-step Carbon Footprint Calculator, or login with your company workspace credentials today to track metrics hand-in-hand with teams worldwide.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => setCurrentScreen('calculator')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-indigo-500/20 cursor-pointer transition-colors font-display"
              >
                Begin Your Analysis
              </button>
              <button
                onClick={() => setCurrentScreen('log-progress')}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-705 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-display"
              >
                Join the Movement
              </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
