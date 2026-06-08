import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, HelpCircle, BookOpen, Clock, PlusCircle, Trash, CheckCircle2, AlertTriangle, HelpCircle as HelpIcon, Sparkles
} from 'lucide-react';
import { Activity, ScreenType, UserStats } from '../types';

interface GuideProps {
  setCurrentScreen: (screen: ScreenType) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const TRIVIA_FACTS = [
  "Linen fabrics are derived from the flax plant, which thrives with minimal pesticide application and consumes roughly 80% less municipal water than standard cotton crops.",
  "Transitioning your electricity grid consumption partially or completely to green municipal solar saves an average of 4.2 metric tons of carbon gas annually per household.",
  "Replacing just one premium corporate dinner with a plant-based gourmet alternative cuts the corresponding culinary footprint of that plate by up to 73%.",
  "Sending organic food remnants to professional composting structures reduces methane gas expansion by 95% compared to landfill decomposition.",
  "Active high voltage electrical meters extract about 10% 'ghost loads' from machinery plugged in standby state overnight.",
];

export default function Guide({ setCurrentScreen, stats, setStats, activities, setActivities }: GuideProps) {
  
  // Daily Trivia state
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  
  // Log Activity Form states
  const [actType, setActType] = useState<'Transportation' | 'Meals' | 'Electricity' | 'Waste'>('Transportation');
  const [actAmount, setActAmount] = useState<string>('15');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Active guide modal detail view
  const [activeGuideKey, setActiveGuideKey] = useState<'linen' | 'meal' | 'solar' | null>(null);

  // Next Fact handler
  const handleNextFact = () => {
    setTriviaIndex((prev) => (prev + 1) % TRIVIA_FACTS.length);
  };

  // Submit Logger handler
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(actAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    // Calculate dynamic impact saved
    let calculatedSaved = 0;
    let unitLabel = 'Miles';
    if (actType === 'Transportation') {
      calculatedSaved = parsedAmount * 0.41; // 0.41 kg per mile offset (combustion to public transit offset)
      unitLabel = 'Miles';
    } else if (actType === 'Meals') {
      calculatedSaved = parsedAmount * 2.8; // 2.8 kg CO2 saved per plant-based burger equivalent
      unitLabel = 'Meals';
    } else if (actType === 'Electricity') {
      calculatedSaved = parsedAmount * 0.85; // 0.85 kg saved per kWh of green source
      unitLabel = 'kWh';
    } else {
      calculatedSaved = parsedAmount * 1.5; // kg CO2 saved per kg recycled
      unitLabel = 'kg';
    }

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type: actType,
      amount: parsedAmount,
      unit: unitLabel,
      impactSaved: Number(calculatedSaved.toFixed(2)),
    };

    setActivities([newActivity, ...activities]);

    // Update Overall Stats
    setStats((prev) => {
      const addedXP = Math.floor(calculatedSaved * 8) + 10; // Dynamic XP booster
      const addedTons = Number((calculatedSaved / 1000).toFixed(4)); // Convert kg to Tonnes
      let newXP = prev.currentXP + addedXP;
      let newLevel = prev.levelName;
      let scoreBoost = Math.floor(calculatedSaved * 2);

      if (newXP >= prev.nextLevelXP) {
        newXP = newXP % prev.nextLevelXP;
        newLevel = "Carbon Champion Level 5";
      }

      return {
        ...prev,
        currentXP: newXP,
        levelName: newLevel,
        sustainabilityScore: Math.min(100, prev.sustainabilityScore + scoreBoost || 74),
        directCarbonSaved: prev.directCarbonSaved + addedTons,
        waterConserved: prev.waterConserved + (actType === 'Meals' ? parsedAmount * 120 : 0),
      };
    });

    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
    setActAmount('');
  };

  // Delete log item
  const handleDeleteActivity = (id: string, impactSaved: number) => {
    setActivities(activities.filter(a => a.id !== id));
    setStats(prev => ({
      ...prev,
      directCarbonSaved: Math.max(0, prev.directCarbonSaved - (impactSaved / 1000)),
    }));
  };

  // Calculation for Daily Projected Emissions today
  const dailySafetyThresholdMax = 12.0; // kg CO2 safe target per person day
  const loggingTodaySum = activities.reduce((sum, a) => sum + a.impactSaved, 0);
  const remainingProjected = Math.max(0, Number((dailySafetyThresholdMax - loggingTodaySum).toFixed(1)));
  const safetyPct = Math.min(100, Math.round((loggingTodaySum / dailySafetyThresholdMax) * 100));

  return (
    <div id="guide-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white pb-20">
      
      {/* Intro Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
        <div className="bg-indigo-505/10 border border-indigo-500/20 text-indigo-300 py-1.5 px-3.5 rounded-full text-xs font-bold font-mono tracking-widest inline-block uppercase">
          INTERACTIVE RESOURCE DESK
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Unlocking Sustainable Habits
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Access high-precision sustainability intelligence, log manual micro-reduction events, and watch the simulation models shift parameters instantly.
        </p>
      </div>

      {/* THREE ARTISTIC COMPASS GUIDES SECTION */}
      <section id="handbooks-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Handbook Card 1: Linen clothes */}
        <motion.div 
          id="guide-card-linen"
          onClick={() => setActiveGuideKey(activeGuideKey === 'linen' ? null : 'linen')}
          className={`group bg-zinc-900 border overflow-hidden rounded-3xl relative cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-xl ${
            activeGuideKey === 'linen' ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-550/5' : 'border-zinc-800'
          }`}
          whileHover={{ y: -4 }}
        >
          <div>
            <div className="h-44 relative overflow-hidden bg-zinc-950">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXlK5ev_G2tPMEwNRXpotffMo7nllKgrmwiFjWuIm1o0dboj6EsjJy4W540TvRUKF_JFvW2BKzkvHRD33ddHbG-OQ2fL3Xx5z89F1sNs51yRnK6e_tG21d6uSflveo-ScJFkISP2DkAHn5dTlw05PFf3s5CUipvbK-rcP-cdEtMjdKEFkuAA5XGtdv9yl99XBfl5uTHaPv5UwzI4iZim0WTmqTwUE0OLQLGxTQQPp_XzeLZA4AHrI2qFghri7fpTe826JME2GPFKvT" 
                alt="Beautiful hanging organic linen textiles" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-indigo-600 text-white font-mono text-[9px] font-bold uppercase py-0.5 px-2.5 rounded-lg tracking-wider">ECO FABRIC</span>
            </div>
            
            <div className="p-5">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 font-display">Low Impact Linen Guide</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Learn why switching fast-fashion fabrics to authentic linen reduces carbon output and chemical wash pollution by 80%.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 flex justify-between items-center text-xs font-bold text-indigo-400 border-t border-zinc-800/80 mt-2 font-display uppercase tracking-wider">
            <span>{activeGuideKey === 'linen' ? 'Close Handbook' : 'Open Handbook'}</span>
            <BookOpen className="w-3.5 h-3.5" />
          </div>

          {activeGuideKey === 'linen' && (
            <div className="p-5 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p className="font-bold text-white text-xs font-display">Sustainability Highlights:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Flax plant absorbs carbon deep into the root grid.</li>
                <li>Uses 80% less municipal water than cotton plants.</li>
                <li>Long fibers last 20+ years, curbing general landfill waste volumes.</li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Handbook Card 2: Plant Gourmet */}
        <motion.div 
          id="guide-card-diet"
          onClick={() => setActiveGuideKey(activeGuideKey === 'meal' ? null : 'meal')}
          className={`group bg-zinc-900 border overflow-hidden rounded-3xl relative cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-xl ${
            activeGuideKey === 'meal' ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-550/5' : 'border-zinc-800'
          }`}
          whileHover={{ y: -4 }}
        >
          <div>
            <div className="h-44 relative overflow-hidden bg-zinc-950">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWX72rDnxBvN7B3DXBTG6l1Ndd6JcP_y65S6Y182S70tZZPLlBLdFl3qtX569a6L2U6ReJdbeDLI6PqNSn6aDjHRMO3I6-UDyGHKFs_pb-II7kzUJYd5qVjdmpi33eqDpb0iGKh_mYZBEk4nAYKSUpi6j6ESIzg8FezIsJuSbRRfa80_WP0KoGxYjMwA63Fz8BSA4o9_Dl2C4Prf3J3xdKwT1N7Kaoci5xNtr5K5uAtquh_UtxpOxP8vwtybWsG2Nv79gO58X0_Kbe" 
                alt="A premium plant based custom gourmet burger stacked with farm-fresh elements" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-indigo-600 text-white font-mono text-[9px] font-bold uppercase py-0.5 px-2.5 rounded-lg tracking-wider">CULINARY</span>
            </div>
            
            <div className="p-5">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 font-display">Dietary Reduction Playbook</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Discover the direct mathematical correlations between beef procurement pipelines and global methane gas expansion schedules.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 flex justify-between items-center text-xs font-bold text-indigo-400 border-t border-zinc-800/80 mt-2 font-display uppercase tracking-wider">
            <span>{activeGuideKey === 'meal' ? 'Close Handbook' : 'Open Handbook'}</span>
            <BookOpen className="w-3.5 h-3.5" />
          </div>

          {activeGuideKey === 'meal' && (
            <div className="p-5 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p className="font-bold text-white text-xs font-display">Sustainability Highlights:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Swapping 1 beef meal saves ~3.5kg CO2 output.</li>
                <li>Reduces agricultural fertilizer runoffs by 60%.</li>
                <li>Conserves 450 gallons of direct hydration feed sources per event.</li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Handbook Card 3: Solar & renewables */}
        <motion.div 
          id="guide-card-solar"
          onClick={() => setActiveGuideKey(activeGuideKey === 'solar' ? null : 'solar')}
          className={`group bg-zinc-900 border overflow-hidden rounded-3xl relative cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-xl ${
            activeGuideKey === 'solar' ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-550/5' : 'border-zinc-800'
          }`}
          whileHover={{ y: -4 }}
        >
          <div>
            <div className="h-44 relative overflow-hidden bg-zinc-950">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASbu3iWZWn5efIh6B3_S5LYDfKfQ5Csimj9_kqKPRMv-YhekkhQH0Q3WluYMbyf8y7kaXH3EjOHKEmF2OdYdU_HmaN8CMUN9S5m827XXXV6yyb_awpkCIYGkrM1ahK144h_eYb811yXXczNVzlEp61J5sBLtgIitwYaV971O3NmATAUHZC75JZpx-nl7f2DfgD_dFCFp_bQqiNqfIj0-oVzjAp00rvQxhKtlIpdd2EfnURIFXtsOGfrwHM0LKOaxw5Gxd7gL8dyKJz" 
                alt="Solar farm panels" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-indigo-600 text-white font-mono text-[9px] font-bold uppercase py-0.5 px-2.5 rounded-lg tracking-wider">UTILITY</span>
            </div>
            
            <div className="p-5">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 font-display">Clean Grid Adaption Scheme</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Step-by-step methodology to locate and purchase community green solar shares to neutralize grid-based electricity bills.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 flex justify-between items-center text-xs font-bold text-indigo-400 border-t border-zinc-800/80 mt-2 font-display uppercase tracking-wider">
            <span>{activeGuideKey === 'solar' ? 'Close Handbook' : 'Open Handbook'}</span>
            <BookOpen className="w-3.5 h-3.5" />
          </div>

          {activeGuideKey === 'solar' && (
            <div className="p-5 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p className="font-bold text-white text-xs font-display">Sustainability Highlights:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Bypasses standard coal-fired power grid outputs.</li>
                <li>Qualifies households for local microgrid offsets of up to 4 tons CO2.</li>
                <li>Protects home networks from municipal energy price surges.</li>
              </ul>
            </div>
          )}
        </motion.div>

      </section>

      {/* SECOND ROW: DAILY LOG FORM & LIVE SCORE ESTIMATION GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12">
        
        {/* LEFT COLUMN: DAILY ACTIVITY LOG (lg:col-span-7) */}
        <motion.div 
          id="daily-activity-log-container"
          className="lg:col-span-7 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs font-mono text-zinc-450 font-bold uppercase tracking-widest block">Real-time ledger entries</span>
              <h2 className="text-xl font-bold text-white mt-1 font-display">Daily Activity Log</h2>
            </div>
            <PlusCircle className="w-5 h-5 text-indigo-400" />
          </div>

          {formSuccess && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-550/30 text-emerald-450 text-xs p-3.5 rounded-2xl flex items-center space-x-2 animate-fade-in font-display">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Activity logged! Overall Carbon Offset stats and Boost point balances have increased.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Type Select */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Activity Arena</label>
                <select
                  id="activity-type-select"
                  value={actType}
                  onChange={(e: any) => setActType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                >
                  <option value="Transportation">Transportation (Public Bus/Cycle)</option>
                  <option value="Meals">Meals (Plant-based Diet choice)</option>
                  <option value="Electricity">Electricity (Standby switches, Solar)</option>
                  <option value="Waste">Waste (Composted/Recycled volume)</option>
                </select>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  Amount / Quantity ({actType === 'Transportation' ? 'Miles' : actType === 'Meals' ? 'Counts' : actType === 'Electricity' ? 'kWh' : 'kilograms'})
                </label>
                <input
                  id="activity-amount-input"
                  type="number"
                  required
                  placeholder={actType === 'Transportation' ? 'e.g. 15' : 'e.g. 3'}
                  value={actAmount}
                  onChange={(e) => setActAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

            </div>

            <button
              id="log-and-update-btn"
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-505 text-white py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow block w-full text-center transition-colors cursor-pointer font-display shadow-indigo-505/10"
            >
              Log and Update Active Score
            </button>
          </form>

          {/* Recents logs list within the panel */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest block mb-1">Logged Activities Ledger (This Period)</h4>
            
            {activities.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-zinc-800/80 rounded-2xl text-xs text-zinc-500 font-mono">
                No custom records registered. Input stats above to see life update loops.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activities.map((a) => (
                  <div key={a.id} className="bg-zinc-950 border border-zinc-800/80 p-3 rounded-2xl flex justify-between items-center text-xs animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      <div>
                        <span className="font-bold text-zinc-200 font-display">{a.type}</span>
                        <span className="text-zinc-500 font-mono block text-[9px] mt-0.5">
                          {a.amount} {a.unit} logged
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 font-mono text-[11px]">
                      <span className="text-indigo-450 font-bold">-{a.impactSaved} kg CO2</span>
                      <button 
                        onClick={() => handleDeleteActivity(a.id, a.impactSaved)}
                        className="text-zinc-550 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </motion.div>

        {/* RIGHT COLUMN: DAILY PROJECTED GAUGE & DID YOU KNOW TRIVIA (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Item 1: Daily Projected Carbon Output Gauges */}
          <motion.div 
            id="projected-gauge-card"
            className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-zinc-520 font-bold uppercase tracking-widest block">Climate Velocity</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 py-0.5 px-2 rounded-full font-mono font-bold uppercase">Today's Cap</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Daily Projected Score</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Aggregating logged records. Your projected footprint is safely below the standard target grid threshold of 12.0 kg.
              </p>

              {/* Progress Slider Display */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Completed Reductions</span>
                  <span className="text-indigo-400 font-bold">{loggingTodaySum.toFixed(2)} kg Saved</span>
                </div>
                <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800/50 p-0.5">
                  <div 
                    style={{ width: `${safetyPct}%` }} 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  ></div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono leading-relaxed block">
                  Remaining safety budget: {remainingProjected} kg CO2 before breaching target limit.
                </span>
              </div>
            </div>

            {safetyPct > 0 ? (
              <div className="mt-6 flex items-center space-x-2.5 text-xs text-emerald-400 bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20 leading-relaxed font-sans">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Excellent job! You are already in the green threshold today.</span>
              </div>
            ) : (
              <div className="mt-6 flex items-center space-x-2.5 text-xs text-amber-300 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-550/20 leading-relaxed font-sans">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>No offsets logged today yet. Standard carbon outputs are in progress.</span>
              </div>
            )}
          </motion.div>

          {/* Item 2: Trivia Widget */}
          <motion.div 
            id="trivia-did-you-know"
            className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 relative overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 blur-xl rounded-full"></div>
            <div className="flex items-center space-x-2 mb-4">
              <HelpIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-indigo-450 uppercase tracking-widest font-extrabold">Did You Know?</span>
            </div>

            <div className="min-h-24 flex items-center">
              <p className="text-zinc-300 text-sm leading-relaxed italic font-sans font-medium">
                "{TRIVIA_FACTS[triviaIndex]}"
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                id="next-fact-btn"
                onClick={handleNextFact}
                className="bg-zinc-950 border border-zinc-800 hover:border-zinc-705 text-zinc-300 text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer transition-all hover:text-white"
              >
                Next Carbon Fact
              </button>
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
}
