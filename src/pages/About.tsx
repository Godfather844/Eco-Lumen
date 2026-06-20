import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, Award, Compass, Users, Sparkles, Building, ChevronLeft, Calendar } from 'lucide-react';

const TIMELINE_YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;

type TimelineYear = typeof TIMELINE_YEARS[number];

interface TimelineContent {
  year: TimelineYear;
  title: string;
  desc: string;
  stat: string;
}

const TIMELINE_DATA: Record<TimelineYear, TimelineContent> = {
  2021: {
    year: 2021,
    title: 'The Seed & Foundational Thesis',
    desc: 'Founded by senior researchers and software engineers. Released the core carbon analysis math protocol mapping direct Scope 1 and Scope 2 logistics.',
    stat: '1st open source model released',
  },
  2022: {
    year: 2022,
    title: 'First Employee Movement Suite',
    desc: 'Began partnering with progressive climate tech partners. Deployed our gamified employee feedback logs and interactive Maple sapling growth engine.',
    stat: '25,000+ habit check-ins',
  },
  2023: {
    year: 2023,
    title: 'SEC Climate Disclosure Sync',
    desc: 'Upgraded calculations to link directly with corporate municipal billing meters, utility providers, and transit logs via clean secure OAuth gateways.',
    stat: '4,200 metric tons offset',
  },
  2024: {
    year: 2024,
    title: 'Precision Bento Re-architecting',
    desc: 'Refactored reporting system to construct flawless bento visualization grid panels. Unveiled audit-verified compliance reports download workflows.',
    stat: '100% compliance rate',
  },
  2025: {
    year: 2025,
    title: 'Global Energy Grid Integrations',
    desc: 'Integrated Live carbon intensity calculations into our active dashboard, empowering homes to adapt water, thermal, and electrical consumption patterns.',
    stat: '14.2kt total reduction logged',
  },
  2026: {
    year: 2026,
    title: 'Horizon Goals & ESG Verification',
    desc: 'Expanding verified forest absorption programs globally. Adding new deep carbon-negative investments support to the employee eco-tree milestone shop.',
    stat: 'Top-tier ESG protocol verified',
  },
};

const TEAM_MEMBERS = [
  {
    name: 'Dr. Clara Vance',
    role: 'Co-Founder & Chief Climate Scientist',
    bio: 'Clara has spent 12 years auditing national energy grid grids. Holds a Ph.D. in Climate Logistics from Stanford University.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Leonidas Sterling',
    role: 'Principal Software Engineer',
    bio: 'Passionate about structural code quality, WCAG, and high-performance Webpack/Vite architectures. Built the core telemetry ledger.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Mei-Lin Zhao',
    role: 'Executive Product Architect',
    bio: 'Mei-Lin designs bento layouts focusing heavily on responsive grid structures, beautiful high-contrast dark visual tones, and microinteraction flows.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  },
];

export default function About() {
  const [activeYear, setActiveYear] = useState<TimelineYear>(2025);

  const activeContent = TIMELINE_DATA[activeYear];

  // Key-down handler for keyboard navigation on timeline years
  const handleTimelineKeyDown = (e: React.KeyboardEvent, s: TimelineYear) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveYear(s);
    }
  };

  return (
    <article id="about-screen" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-zinc-100 pb-20">
      
      {/* Header section with semantic H1 */}
      <section className="mb-12 max-w-3xl">
        <div id="about-intro-badge" className="text-indigo-400 text-xs font-semibold font-mono uppercase tracking-widest mb-2 animate-pulse">
          MISSION STATEMENT & CORE ETHOS
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight font-display text-white">Our Environmental Mission</h1>
        <p className="text-zinc-400 text-base mt-4 leading-relaxed">
          At Eco-Lumen, we strive to bridge the gap between high-precision corporate auditing systems and active employee engagement. Our solutions deliver audit-ready reports matching SEC and CSRD regulations while motivating daily behavioral refinement.
        </p>
      </section>

      {/* Main Grid: Organization info (Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        
        {/* Left Column: Vision & Mission Blocks */}
        <section className="lg:col-span-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between" aria-labelledby="vision-heading">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id="vision-heading" className="text-xl font-bold text-white font-display">The Vision</h2>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              We envision a fully connected world where carbon ledger synchronization is automated at every step — from the smart appliance inside a household to the supply train of multi-national conglomerates. By removing friction, carbon-neutrality becomes the baseline default.
            </p>
          </div>
          <div className="mt-8 border-t border-zinc-800 pt-4">
            <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest block">Verifiable Stewardship</span>
            <p className="text-[11px] text-zinc-500 mt-1">Our methodologies comply to global GHG protocol guidelines.</p>
          </div>
        </section>

        {/* Middle Column: Interactive Interactive Mission Timeline */}
        <section className="lg:col-span-8 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between" aria-labelledby="timeline-heading">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-widest block">Stewardship Milestones</span>
                <h2 id="timeline-heading" className="text-xl font-bold text-white font-display">Development Timeline</h2>
              </div>
              <Calendar className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            </div>

            <p className="text-zinc-400 text-xs mb-6">
              Select any operational year milestones marker tab below to audit our expansion history, active metrics, offset milestones, and technical advances.
            </p>

            {/* Year selector buttons (with WCAG tabs/buttons compatibility) */}
            <nav id="timeline-tabs" className="flex flex-wrap gap-2.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-850 mb-6" aria-label="Timeline years navigation">
              {TIMELINE_YEARS.map((y) => (
                <button
                  key={y}
                  id={`year-tab-${y}`}
                  role="tab"
                  aria-selected={activeYear === y}
                  tabIndex={0}
                  onClick={() => setActiveYear(y)}
                  onKeyDown={(e) => handleTimelineKeyDown(e, y)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all uppercase cursor-pointer ${
                    activeYear === y
                      ? 'bg-zinc-820 text-white shadow-md border border-zinc-700 font-extrabold'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {y}
                </button>
              ))}
            </nav>

            {/* Timeline details container */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80 min-h-24">
              <span className="text-[10px] text-indigo-430 font-mono font-bold uppercase tracking-widest">Active Focus: {activeContent.year}</span>
              <h3 className="text-base font-bold text-zinc-100 mt-1 font-display">{activeContent.title}</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{activeContent.desc}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 p-4 rounded-xl border border-zinc-850 gap-2">
            <span className="text-xs text-zinc-400 leading-normal">Operational Impact Milestone</span>
            <span className="text-xs font-extrabold font-mono text-indigo-400 uppercase tracking-widest">{activeContent.stat}</span>
          </div>
        </section>

      </div>

      {/* SECTION: TEAM MEMBERS SECTION */}
      <section className="bg-zinc-904/10 p-6 rounded-3xl border border-zinc-800/80" aria-labelledby="team-heading">
        <div className="mb-8">
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest block">PASSIONATE CLIMATE STEWARDS</span>
          <h2 id="team-heading" className="text-xl font-bold text-white font-display mt-1">Our Leadership & Research Team</h2>
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
            Our technology is built by a small team of software engineers, compliance officers, and environmental scientists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <article 
              key={member.name}
              className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-850 hover:border-zinc-700 transition-all flex flex-col justify-between"
              aria-labelledby={`member-${member.name.replace(/\s+/g, '-')}`}
            >
              <div>
                <img 
                  referrerPolicy="no-referrer"
                  src={member.img} 
                  alt={`Dr Clara - portrait image`} 
                  className="w-16 h-16 rounded-xl border border-zinc-800 object-cover mb-4"
                />
                <h3 id={`member-${member.name.replace(/\s+/g, '-')}`} className="text-sm font-bold text-zinc-100 font-display">{member.name}</h3>
                <p className="text-indigo-400 text-[11px] font-mono font-semibold uppercase tracking-wider mt-0.5">{member.role}</p>
                <p className="text-zinc-400 text-xs mt-3 leading-relaxed">{member.bio}</p>
              </div>
              <div className="border-t border-zinc-900 mt-4 pt-3 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Verification Authority</span>
                <span className="text-emerald-500 text-[10px] font-bold">APPROVED</span>
              </div>
            </article>
          ))}
        </div>
      </section>

    </article>
  );
}
