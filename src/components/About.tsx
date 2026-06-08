import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Flag, Calendar, Compass, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';

interface HistoryYear {
  year: number;
  title: string;
  desc: string;
  detailedStats: string;
}

const TIMELINE_YEARS: HistoryYear[] = [
  { 
    year: 2021, 
    title: 'Foundational Models & Core Research', 
    desc: 'Marcus Thorne publishes foundational mathematical papers describing the link between utility logs and consumer greenhouse reductions.',
    detailedStats: 'Initial seed research backed by standard carbon grants and the Climate Science Alliance.'
  },
  { 
    year: 2023, 
    title: 'Alpha Deployment in Austin Texas', 
    desc: 'Eco-Lumen launches Austin microgrid sync integration, mapping solar distribution logs cleanly.',
    detailedStats: '14 pilot organizations deployed, tracking and saving 320 metric tons of corporate Scope 1 gas.'
  },
  { 
    year: 2025, 
    title: 'Global Corporate Redesign', 
    desc: 'Platform rewritten with advanced predictive modeling sliders, gamified eco-tree features, and CSRD compliance reporting binders.',
    detailedStats: 'Expanding network across 43 multinational workspaces, engaging 45,000 active employee trackers daily.'
  }
];

export default function About({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const [activeYear, setActiveYear] = useState<number>(2025);

  const activeTimelineInfo = TIMELINE_YEARS.find(t => t.year === activeYear) || TIMELINE_YEARS[2];

  const team = [
    {
      name: 'Marcus Thorne',
      role: 'Founder & CEO',
      bio: 'Author of carbon intelligence math grids and a recognized environmental lead. Former renewable grid lead at Texas Clean Power.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlBUCgE1HSLdsapqSTO2Atueb3H6cA-5neynfNoGCQdmIDScSACz0ekT1HfEcWvcjzGtJ5DBTLchKD_3kYEOGTR8ON4rLGGLk0yNl5xbAG7VRjNbbFDft3hqNg_49PEpmoTuCspbp4x1is76aFM3x_NsX-gMN_ghQd6aMqNk48R1f7Wiz7UHgacJ83DXweb1MtY5TLuvxVek5I7hnuiBBWylvC6BvyAYvq-S2OG7B_HL_uG2-SPtjE8UQmvq3utsF5CrDmwh43m_Ca'
    },
    {
      name: 'Elena Ruiz',
      role: 'Chief Sustainability Officer',
      bio: 'Linen sourcing advisor and developer of the EPA-aligned agricultural reduction checklists on our resource dashboard.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7isOr-wGJo0f36s8ELk_Bwcri8h3g5iOOyHkTXZfgcgprtuO9-WgFOkRW1pxgMUwhmIlHO3IS-ADl4JvEVjKNlQk_rVl5fvNaRh7i8M_eH3uijK9vl3HAwDPBzYlhsZ9UGwUCKkIBM3mHHi3iFNZTIShkrtTMo3shf8R1S1MZqE1Yuhcoe0NcDMte5Z9f3Xv6mYUbzfPjyfm5JUZNa0HkQYW0S-NSu6wDIfddT5ySLwF2bgLWENh2tRvfImCsB0tKONFEpFpwXlI'
    },
    {
      name: 'David Chen',
      role: 'Lead Technologist',
      bio: 'Primary engineer behind our high-rigidity microgrid synchronizer and Recharts performance reporting engine.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPiLpQN9B9oqnxNsPAl1cVnvS3NjFN3laOfnAfNl4RdsSi49B8roDcEPoCEj5OT9cWs_Zu4UQ5HIgEmnwMRL9EzFVdubs6VKyn9TRgkTnduWiOXAxqCXLe0Zz8WTc0NSk6OYDuTb_i5UwvZjkJb7o6iKSjgZ10K8pKGvG-GUQNIYzG7JjSeAsbAfjgvAG0lTQAH-1jjijLQD3UPeGhpvu4R-3WXtE-0BzslpEYQm2Ei96BYkR6ISBPvC_w46zK2WtQ2CJZU38i3NZ-'
    },
    {
      name: 'Sarah Jenkins',
      role: 'VP of Operations',
      bio: 'Direct coordinator with corporate ESG directors mapping SEC filing formats and legal compliance scopes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfjuNNwUB_sceGgQOcl_Ho0t_VYIVmYUxfLj6WZoebjMG1hZ-khLhrpQsHnPYEe2aaSehH7yucI4c60_PH3uACORI96Z9rg0ykTbQ9nTgZBRR-SR_yZxXPU9qgKsLNJSedW-LOhjgHL1YsUb-6ghJmKVP2mIv6bkKsuVvh-lqKQZmlSkOgGWk4Q1ow_MWmv_D5Il41Ns-3QfOb6LxmGs6tcT5BjJon4q6wzDq5ksAc3uBKfr_lpRSkP5_v34_irQWn2TwrctbbfKZB'
    }
  ];

  return (
    <div id="about-screen" className="flex-1 text-white pb-20">
      
      {/* HERO BANNER SECTION */}
      <section id="about-hero" className="relative overflow-hidden py-24 border-b border-zinc-900">
        <div id="about-hero-artwork" className="absolute inset-0">
          <img 
            id="about-mission-bg"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcBxBlQh35oP5t8oCKAkITMxkNQ_trZT9YEIl25JUafue9sHOdmyioASa05kLMTrfMjckjB8OQHufRBkN-8WOfjQ_xTE-gnmE7qlFR6cugSO1WwdSf4b1alrcV0Tqiovcoi76bN799zSuI0KCA2JkpZbERnuWIhQt9ZO0zvfJlFqf-byr8nRiS_uH7Zxv2VzXh9PC84HIvmYcAO5VZZiG0rjrhID-AZfA6XPgyuRYNnsmw6dmrgime_-es1x1p4_lJdXVL-uCKXWVN" 
            alt="Majestic high contrast scenic panorama of clean active wind turbines lining beautiful rolling hills under warm skies" 
            className="w-full h-full object-cover opacity-15" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-505/10 border border-indigo-500/20 py-1.5 px-3.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest font-mono">
            <span>Corporate Vision & Heritage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight font-display">
            Redefining Stewardship for the{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Anthropocene Century
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            We build the numerical databases, high-precision visual analyzers, and interactive checklists that synchronize business goals with meaningful habit reduction metrics.
          </p>
        </div>
      </section>

      {/* CORE MISSION & VISION BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          {/* Card 1: Our Mission */}
          <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between items-start shadow-xl">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">Our Mission</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                To replace tedious, hard-to-parse environmental spreadsheets with clean real-world grid telemetry models and gamified challenges that engage.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                By equipping both compliance departments and employee teams with clear parameters, we illuminate the individual and collective impact of daily choices.
              </p>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between items-start shadow-xl">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">Our Vision</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                An integrated global network where utility companies, private workspaces, carbon footprints, and domestic accounts settle actual footprint reports cleanly.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We envision a future where carbon neutrality targets are calculated, monitored, and achieved in plain sight with audit-ready checkable data.
              </p>
            </div>
          </div>

        </div>

        {/* INTERACTIVE HISTORY TIMELINE */}
        <div className="bg-zinc-900/40 p-6 md:p-10 rounded-3xl border border-zinc-800/80 mb-20 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block">Interactive Chronology</span>
            <h2 className="text-2xl font-bold text-white font-display">Our Journey in Climate Tech</h2>
          </div>

          {/* Year Buttons */}
          <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-10">
            {TIMELINE_YEARS.map((t) => (
              <button
                id={`timeline-year-${t.year}`}
                key={t.year}
                onClick={() => setActiveYear(t.year)}
                className={`py-2 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border font-display ${
                  activeYear === t.year
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-450 hover:text-white hover:border-zinc-700'
                }`}
              >
                {t.year}
              </button>
            ))}
          </div>

          {/* Timeline Info Panels with Animation */}
          <div className="min-h-36 bg-zinc-950 p-6 rounded-2xl border border-zinc-800/80 flex flex-col justify-between shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2 font-display">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{activeTimelineInfo.title}</span>
                  </h3>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-mono py-0.5 px-2.5 rounded-full font-bold tracking-wider uppercase">
                    MILESTONE
                  </span>
                </div>
                
                <p className="text-zinc-300 text-sm leading-relaxed font-sans">{activeTimelineInfo.desc}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">{activeTimelineInfo.detailedStats}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CORE TEAM GRID */}
        <section id="our-team">
          <div className="text-center max-w-lg mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block">Scientific & Tech Leadership</span>
            <h2 className="text-3xl font-extrabold text-white font-display">Meet the Pioneers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="group bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="h-56 overflow-hidden bg-zinc-950 relative">
                    <img 
                      referrerPolicy="no-referrer"
                      src={member.image} 
                      alt={`Sleek elegant professional business photo headshot portrait of ${member.name}`} 
                      className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-450 transition-colors font-display">{member.name}</h4>
                    <p className="text-xs text-indigo-400 font-mono mt-0.5 font-bold uppercase tracking-wider">{member.role}</p>
                    <p className="text-zinc-400 text-xs mt-3.5 leading-relaxed font-sans">{member.bio}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-zinc-800/40">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block mt-3 font-bold">CONTACT VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </section>

    </div>
  );
}
