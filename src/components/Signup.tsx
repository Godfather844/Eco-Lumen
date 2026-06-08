import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, User, Mail, Lock, Shield, Sparkles, Sprout } from 'lucide-react';
import { ScreenType, UserStats } from '../types';

interface SignupProps {
  setCurrentScreen: (screen: ScreenType) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export default function Signup({ setCurrentScreen, stats, setStats }: SignupProps) {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form parameters
  const [nameInput, setNameInput] = useState<string>(stats.name || '');
  const [emailInput, setEmailInput] = useState<string>(stats.email || '');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••');
  
  // Selected goal
  const [selectedGoal, setSelectedGoal] = useState<string>(stats.goal || 'Reduce Travel Carbon');

  const goals = [
    { id: 'Reduce Travel Carbon', title: 'Reduce Transit Carbon', desc: 'Optimize daily commutes, use public transit share, and bike for low mileage trips.' },
    { id: 'Transition Energy Source', title: 'Transition Home Utilities', desc: 'Minimize gas usage, configure standby outlets, and purchase green solar shares.' },
    { id: 'Plant-based Lifestyle', title: 'Plant-Based Nutrition', desc: 'Swap beef/poultry plates with culinary greenhouse legumes and organic composting bounds.' },
    { id: 'Zero-Waste Living', title: 'Zero-Waste Cycles', desc: 'Maximize packaging recycling, avoid single-use plastics, and minimize kitchen waste.' },
  ];

  // Steps Transition handlers
  const handleNextStep = () => {
    if (step === 1) {
      if (!nameInput.trim() || !emailInput.trim()) return;
      setStats((prev) => ({ ...prev, name: nameInput, email: emailInput }));
      setStep(2);
    } else if (step === 2) {
      setStats((prev) => ({ ...prev, goal: selectedGoal }));
      setStep(3);
    }
  };

  const handleFinishSignup = () => {
    // Navigate straight to active Dashboard
    setCurrentScreen('dashboard');
  };

  return (
    <div id="signup-screen" className="flex-1 text-white min-h-[calc(100vh-4.5rem)] flex items-stretch">
      
      {/* LEFT ASPECT: LOGO/BACKGROUND GRID (40%) */}
      <div id="signup-creative-sidebar" className="hidden lg:flex w-2/5 p-12 bg-zinc-950 flex-col justify-between relative overflow-hidden border-r border-zinc-900">
        <img 
          id="signup-nature-moss-bg"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBy6cnBSRzXNYX5Flj4LScpUUlbNq2E9LoFJLyZrzyLANb9D-rP3IFQEwhXzi137xQnJtfZT-obr2-C0bHY6YgLugdArAfawZ9IRJXq9oMx4QZXCub8bI2MHOVgP3H8y0zdec4B86zYZ4qaSX8Hwu_BsMp9PxR24DgpeWZssYPiGWD_1aHowME2B_camhhTtIK-KfuOrw5Ay9IUQhEAcCCGMemO3zSsJsyaXt9s8xcqGvVVniXIZkJkhZqq_3ICNm9klrELwByDd5x" 
          alt="Lush thick green forest moss" 
          className="absolute inset-0 w-full h-full object-cover opacity-15" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        
        {/* Brand */}
        <div className="relative z-10 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-white text-base font-display">Eco Desk Portal</span>
        </div>

        {/* Narrative */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight font-display">
            Join the movement to secure our future.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed font-sans">
            By setting up a personal sustainability profile, your progress joins collective benchmarks tracking carbon offsets, water savings, and tree progress around the globe.
          </p>
        </div>

        {/* Security badge at bottom */}
        <div className="relative z-10 flex items-center space-x-2 text-[10px] text-zinc-500 font-mono tracking-wider font-bold">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>SECURED USING AES-256 CLOUD METRIC PROTOCOLS.</span>
        </div>
      </div>

      {/* RIGHT ASPECT: INTERACTIVE FORM (60%) */}
      <div id="signup-form-segment" className="flex-1 p-6 md:p-16 flex flex-col justify-center max-w-2xl mx-auto lg:max-w-none lg:w-3/5">
        
        {/* Stepper Wizard Indicator */}
        <div id="signup-stepper" className="flex items-center space-x-4 mb-10 max-w-md">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                step === s 
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/15' 
                  : step > s 
                    ? 'bg-indigo-950 border border-indigo-500/40 text-indigo-400' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-550'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              
              {s < 3 && (
                <div className={`flex-1 h-0.5 rounded transition-all ${
                  step > s ? 'bg-indigo-500/40' : 'bg-zinc-850'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Stepper Actions Container with Motion Transitions */}
        <div className="min-h-96 flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Account setup */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-extrabold block">Step 01 of 03</span>
                  <h1 className="text-2xl font-extrabold text-white mt-1 font-display">Configure Your Sustainability Account</h1>
                  <p className="text-zinc-400 text-sm mt-2">Enter your identity credentials below to register your personal analytics board.</p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Account / Call Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        placeholder="e.g. Liam Sterling"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Email Ledger Username</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        placeholder="lsterling@naturenetwork.org"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Secure Pin / Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        id="signup-password"
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="signup-step1-btn"
                    onClick={handleNextStep}
                    disabled={!nameInput.trim() || !emailInput.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-505 disabled:opacity-40 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest shadow transition-colors cursor-pointer font-display"
                  >
                    <span>Proceed to Goals</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Goal preference selection */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold block">Step 02 of 03</span>
                  <h1 className="text-2xl font-extrabold text-white mt-1 font-display">Select Your Primary Reduction Arena</h1>
                  <p className="text-zinc-400 text-sm mt-2">Customizes your active daily habit checklist objectives inside your dashboard.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((g) => {
                    const isSelected = selectedGoal === g.id;
                    return (
                      <button
                        id={`signup-goal-${g.id.replace(/\s+/g, '-')}`}
                        key={g.id}
                        onClick={() => setSelectedGoal(g.id)}
                        className={`text-left p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-indigo-500/10 border-indigo-550 text-white shadow-md' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-705 text-zinc-300'
                        }`}
                      >
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-indigo-404 text-indigo-300' : 'text-white'} font-display`}>{g.title}</h4>
                        <p className="text-zinc-400 text-xs mt-1.5 leading-normal font-sans">{g.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-805 text-white font-semibold py-3 px-6 rounded-2xl text-xs uppercase tracking-widest font-display transition-colors cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    id="signup-step2-btn"
                    onClick={handleNextStep}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-505 text-white font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-widest transition-colors cursor-pointer text-center font-display shadow-lg shadow-indigo-500/10"
                  >
                    Lock My Goal
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success details confirmation */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3 pb-4">
                  <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/35 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl font-bold p-2.5">
                    <CheckCircle2 className="w-8 h-8 font-bold text-indigo-400" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-white font-display">Analysis Ledger Provisioned!</h1>
                  <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                    Your Eco Desk profile for <span className="text-white font-semibold">{stats.name}</span> is ready and synchronized.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Personal Objective Matrix</span>
                  </div>
                  
                  <div className="space-y-3 text-xs leading-relaxed text-zinc-400 font-sans">
                    <p>
                      <strong>Active Target Theme:</strong> Track and minimize Scope 1 direct outputs in the <span className="text-indigo-400 font-bold">{stats.goal}</span> category.
                    </p>
                    <p>
                      <strong>Digital Maple Sprout:</strong> Your active carbon absorption score will track with your daily habit logs inside the desk room, starting with <span className="font-semibold text-white">0.05 Ton offsets</span>.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="signup-finish-btn"
                    onClick={handleFinishSignup}
                    className="w-full bg-indigo-600 hover:bg-indigo-505 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest shadow-lg transition-colors cursor-pointer font-display"
                  >
                    Go to your Eco Desk!
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
