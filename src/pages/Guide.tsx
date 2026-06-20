import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, HelpCircle, FileText, CheckCircle2, Droplet, 
  Trash2, Plus, Zap, Sparkles, BookOpen, Bike, Tag, Apple
} from 'lucide-react';
import { UserStats, Activity, ScreenType } from '../types';
import { sanitizeInput, safeParsePositiveNumber } from '../utils/validation';

interface GuideProps {
  setCurrentScreen: (screen: ScreenType) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const TRIVIA_FACTS = [
  'Replacing one beef meal with vegetable options saves roughly 3,000 gallons of water and 15kg of CO2 emissions.',
  'Phantom loads from plugged-in home devices consume up to 10% of standard domestic power bills.',
  'Commuting 10 miles via public transit or bicycle instead of gasoline cars reduces greenhouse footprint by 82%.',
  'Composting organic kitchen goods halts anaerobic landfills outputs of methane, which is 25x more toxic than CO2.',
  'Lowering hot water washing temperatures to cozy 30°C saves up to 75% of regular cycle electric load.',
] as const;

// Preset definitions mapping for activities
const ACTIVITY_PRESETS: Record<string, { label: string; xp: number; co2: number; water: number }> = {
  'meat-less': { label: 'Meat-less meal (Vegan/Veg)', xp: 20, co2: 0.003, water: 15 },
  'electric-commute': { label: 'Electric/Bicycle transit walk', xp: 35, co2: 0.008, water: 0 },
  'recycle-bin': { label: 'Recycle paper/metals batch', xp: 15, co2: 0.002, water: 5 },
  'lights-out': { label: 'Smart thermostat adjustments', xp: 10, co2: 0.001, water: 0 },
};

export default function Guide({ stats, setStats, activities, setActivities }: GuideProps) {
  // Local Form state
  const [actType, setActType] = useState<string>('meat-less');
  const [actAmount, setActAmount] = useState<string>('1');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [activeGuideKey, setActiveGuideKey] = useState<string | null>(null);

  // Form input validation error state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Memoized Daily savings projections for performance boost
  const dailyProjections = useMemo(() => {
    let totalSavedCo2 = 0;
    let totalSavedWater = 0;

    activities.forEach((act) => {
      const scale = safeParsePositiveNumber(act.amount, 1, 100);
      totalSavedCo2 += act.co2Saved * scale;
      totalSavedWater += act.waterSaved * scale;
    });

    return {
      co2: Number(totalSavedCo2.toFixed(3)),
      water: totalSavedWater,
    };
  }, [activities]);

  // Form submit handler
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const safeAmount = safeParsePositiveNumber(actAmount, 0.01, 100);
    if (safeAmount <= 0) {
      setValidationError('Please enter a valid count or portion greater than zero.');
      return;
    }

    const preset = ACTIVITY_PRESETS[actType];
    if (!preset) {
      setValidationError('Please select a valid habit action category.');
      return;
    }

    const newActivity: Activity = {
      id: sanitizeInput(`manual-${Date.now()}`),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: preset.label,
      amount: String(safeAmount),
      co2Saved: preset.co2,
      waterSaved: preset.water,
      xpGained: preset.xp,
    };

    // Append to list & grant dynamic XP rewards
    setActivities((prev) => [newActivity, ...prev]);

    const finalXpGrant = preset.xp * Math.ceil(safeAmount);
    const finalCo2Saved = preset.co2 * safeAmount;
    const finalWaterSaved = preset.water * safeAmount;

    setStats((prev) => {
      const nextXp = prev.currentXP + finalXpGrant;
      let level = prev.level;
      let levelName = prev.levelName;
      let cap = prev.nextLevelXP;

      if (nextXp >= cap) {
        level += 1;
        levelName = level >= 5 ? 'Ecosophy Sage' : level === 4 ? 'Giant Maple Tracker' : 'Green Canopy Guard';
        cap = Math.round(cap * 1.5);
      }

      return {
        ...prev,
        currentXP: nextXp,
        nextLevelXP: cap,
        level,
        levelName,
        directCarbonSaved: prev.directCarbonSaved + finalCo2Saved,
        waterConserved: prev.waterConserved + finalWaterSaved,
        sustainabilityScore: Math.min(100, prev.sustainabilityScore + Math.ceil(safeAmount * 2)),
      };
    });

    setFormSuccess(true);
    setActAmount('1');
    setTimeout(() => setFormSuccess(false), 3000);
  };

  // Activity Delete Handler matching initial architecture
  const handleDeleteActivity = (id: string) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;

    setActivities((prev) => prev.filter((item) => item.id !== id));
    
    // Deduct portion from stats safely
    const scale = safeParsePositiveNumber(act.amount, 1, 100);
    setStats((prev) => ({
      ...prev,
      directCarbonSaved: Math.max(0, prev.directCarbonSaved - act.co2Saved * scale),
      waterConserved: Math.max(0, prev.waterConserved - act.waterSaved * scale),
      currentXP: Math.max(0, prev.currentXP - act.xpGained * Math.ceil(scale)),
    }));
  };

  const cycleTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % TRIVIA_FACTS.length);
  };

  return (
    <article id="guide-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-zinc-100 pb-20">
      
      {/* Search/Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-6 gap-4">
        <div>
          <div id="guide-header-badge" className="text-teal-400 text-xs font-semibold font-mono uppercase tracking-widest mb-1">
            MANUAL LEDGER DEPOSIT & ESG GUIDES
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Impact Guide & Log</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Use this segment to record specific carbon-saving behaviors manually. Explore verified methodology manuals.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center space-x-3 max-w-sm" aria-label="Manual check-in projected daily savings">
          <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 animate-pulse" aria-hidden="true" />
          <div>
            <p className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-wider">PROJECTED CO2 SAVED TODAY</p>
            <p className="text-base font-bold font-mono text-zinc-100 mt-0.5">
              {dailyProjections.co2} Tons • {dailyProjections.water} Gal Conserved
            </p>
          </div>
        </section>
      </header>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE LOGGER FORM & RECORD LISTS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Form component section */}
          <section id="manual-logger-form" className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-805" aria-labelledby="form-section-title">
            <h2 id="form-section-title" className="text-lg font-bold text-white mb-4 font-display flex items-center space-x-2">
              <Plus className="w-5 h-5 text-teal-400" aria-hidden="true" />
              <span>Record a Climate Action</span>
            </h2>

            {/* Error notifications */}
            {validationError && (
              <div role="alert" className="mb-4 p-3.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
                {validationError}
              </div>
            )}

            {/* Success toaster */}
            {formSuccess && (
              <div role="status" className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Habit successfully logged! XP and Carbon offset values updated on your dashboard.</span>
              </div>
            )}

            <form onSubmit={handleLogSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              
              <div className="md:col-span-6 flex flex-col space-y-1.5">
                <label htmlFor="action-type-select" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Category of Action</label>
                <select
                  id="action-type-select"
                  value={actType}
                  onChange={(e) => setActType(sanitizeInput(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all cursor-pointer font-medium"
                >
                  <option value="meat-less">Meat-less meal (Vegan/Veg)</option>
                  <option value="electric-commute">Electric/Bicycle transit walk</option>
                  <option value="recycle-bin">Recycle paper/metals batch</option>
                  <option value="lights-out">Smart thermostat adjustments</option>
                </select>
              </div>

              <div className="md:col-span-3 flex flex-col space-y-1.5">
                <label htmlFor="action-count-input" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Portions / Counts</label>
                <input
                  id="action-count-input"
                  type="number"
                  required
                  min="0.1"
                  max="50"
                  step="0.1"
                  value={actAmount}
                  onChange={(e) => setActAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-teal-500/50 rounded-xl p-3 text-xs text-white focus:outline-none transition-all font-medium"
                  placeholder="e.g. 1"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer font-display focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Submit logged climate Action"
                >
                  Log Action
                </button>
              </div>

            </form>
          </section>

          {/* Activity Ledger Listings */}
          <section id="manual-ledger-list" className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800" aria-labelledby="list-section-title">
            <h2 id="list-section-title" className="text-lg font-bold text-white mb-4 font-display">Check-in Ledger Log</h2>

            {activities.length === 0 ? (
              <div className="text-center py-10 bg-zinc-950 rounded-2xl border border-zinc-850">
                <Compass className="w-10 h-10 text-zinc-650 mx-auto mb-3" aria-hidden="true" />
                <p className="text-zinc-500 text-xs font-semibold">No habits recorded manually today.</p>
                <p className="text-[10px] text-zinc-600 mt-1">Use the active check-in form above to add customized actions.</p>
              </div>
            ) : (
              <div className="space-y-3" role="table" aria-label="Manually recorded eco logs check-ins">
                {activities.map((item) => {
                  const scale = safeParsePositiveNumber(item.amount, 1, 100);
                  const totalCo2Saved = (item.co2Saved * scale).toFixed(3);
                  return (
                    <article 
                      key={item.id} 
                      className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center hover:border-zinc-700 transition-all"
                      aria-label={`${item.type} checked in at ${item.timestamp}`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                          {item.type.includes('meal') ? <Apple className="w-4.5 h-4.5" /> : <Bike className="w-4.5 h-4.5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm font-display text-zinc-100">{item.type}</span>
                            <span className="text-[10px] text-zinc-500 font-mono font-bold">x{item.amount}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1">
                            {item.timestamp} • Saves <span className="text-teal-400 font-bold">{totalCo2Saved} Tons</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-teal-950 border border-teal-800/40 text-teal-400 py-1 px-2 rounded-lg font-mono font-bold tracking-tight">
                          +{item.xpGained * Math.ceil(scale)} XP
                        </span>
                        <button
                          onClick={() => handleDeleteActivity(item.id)}
                          className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-red-500/20 hover:bg-red-500/5 cursor-pointer transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                          aria-label={`Delete record for ${item.type}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: MANUALS, TRIVIA & RESOURCES */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Active Custom Flashcards/Trivia module */}
          <section id="trivia-flashcard" className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between" aria-labelledby="trivia-heading">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Climate Trivia Fact</span>
              <HelpCircle className="w-4.5 h-4.5 text-teal-400 animate-bounce" aria-hidden="true" />
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850/80 min-h-24">
              <p id="trivia-heading" className="text-xs text-zinc-200 leading-relaxed font-sans">{TRIVIA_FACTS[triviaIndex]}</p>
            </div>

            <button
              onClick={cycleTrivia}
              className="mt-4 w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 py-2 rounded-xl text-xs font-semibold cursor-pointer text-zinc-300 transition-all font-display hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Cycle next climate trivia fact"
            >
              Cycle Trivia Fact
            </button>
          </section>

          {/* Active Methodology Documents */}
          <section id="custom-manuals-section" className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800" aria-labelledby="manuals-heading">
            <h3 id="manuals-heading" className="text-sm font-bold text-white mb-1 font-display uppercase tracking-widest text-teal-400">Methodology Manuals</h3>
            <p className="text-[11px] text-zinc-500 leading-normal mb-4">Read verified methodologies approved by climate standards organizations.</p>

            <nav className="space-y-2" aria-label="Methodology manuals articles list">
              
              {/* Manual 1 */}
              <button
                onClick={() => setActiveGuideKey(activeGuideKey === 'scope-1' ? null : 'scope-1')}
                className="w-full text-left p-3 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-505"
                aria-expanded={activeGuideKey === 'scope-1'}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-teal-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-zinc-3 font-semibold font-display">Scope 1: Mobile Combustion</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">GHG Protocol</span>
              </button>
              {activeGuideKey === 'scope-1' && (
                <div role="region" className="p-3.5 bg-zinc-950/80 rounded-xl border border-teal-500/10 text-[11px] text-zinc-400 leading-relaxed space-y-1.5">
                  <p>Scope 1 focuses strictly on direct fuel use. Vehicles using standard internal combustion engines discharge 0.411 kilograms of carbon dioxide equivalent per mile of distance traversed.</p>
                  <p>Ridesharing, corporate transit shuttles, and personal commutes represent direct organizational boundaries in Scope 1 accounting standards.</p>
                </div>
              )}

              {/* Manual 2 */}
              <button
                onClick={() => setActiveGuideKey(activeGuideKey === 'scope-2' ? null : 'scope-2')}
                className="w-full text-left p-3 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-505"
                aria-expanded={activeGuideKey === 'scope-2'}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-purple-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-zinc-3 font-semibold font-display">Scope 2: Purchased Electricity</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">EPA EGRID</span>
              </button>
              {activeGuideKey === 'scope-2' && (
                <div role="region" className="p-3.5 bg-zinc-950/80 rounded-xl border border-teal-500/10 text-[11px] text-zinc-400 leading-relaxed space-y-1.5">
                  <p>Scope 2 audits purchased electricity. Standard public grid lines discharge roughly 0.4kg CO2 per kilowatt-hour of drawn electrical current.</p>
                  <p>Switching facilities to partial solar or complete clean renewable contracts limits EPA emission factors down to 0.02kg/kWh.</p>
                </div>
              )}

              {/* Manual 3 */}
              <button
                onClick={() => setActiveGuideKey(activeGuideKey === 'scope-3' ? null : 'scope-3')}
                className="w-full text-left p-3 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-505"
                aria-expanded={activeGuideKey === 'scope-3'}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-zinc-3 font-semibold font-display">Scope 3: Waste & Diet Chains</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">IPCC Report</span>
              </button>
              {activeGuideKey === 'scope-3' && (
                <div role="region" className="p-3.5 bg-zinc-950/80 rounded-xl border border-teal-500/10 text-[11px] text-zinc-400 leading-relaxed space-y-1.5">
                  <p>Scope 3 comprises all downstream value. Nutritional balances dominate employee carbon footprint. Red meat represents 2.9 metric tons per annum whereas vegan balances map down to 0.65 tons.</p>
                  <p>Recycling metals, wood, paper and biological composting acts as an immediate packaging offset potential metric.</p>
                </div>
              )}

            </nav>
          </section>

        </aside>

      </div>

    </article>
  );
}
