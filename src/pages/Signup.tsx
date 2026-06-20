import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UserStats, ScreenType } from '../types';
import { validateEmail, validateName, sanitizeInput } from '../utils/validation';

interface SignupProps {
  setCurrentScreen: (screen: ScreenType) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export default function Signup({ setCurrentScreen, stats, setStats }: SignupProps) {
  // Wizard steps: 1: Name & Authentication, 2: Goal preferences selection
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [nameInput, setNameInput] = useState(stats.name || '');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(stats.goal || 'Minimize electricity usage');

  // Multi-step form error validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate Name
    const nameCheck = validateName(nameInput);
    if (!nameCheck.isValid) {
      setValidationError(nameCheck.message);
      return;
    }

    // Validate Email
    if (!validateEmail(emailInput)) {
      setValidationError('Please enter a valid, corporate or standard personal email address.');
      return;
    }

    // Validate Password strength
    if (passwordInput.length < 8) {
      setValidationError('Password is too weak. Please use at least 8 characters containing letters or digits.');
      return;
    }

    setStep(2);
  };

  const handleSignupComplete = () => {
    // Sanitize values cleanly
    const safeName = sanitizeInput(nameInput);
    const safeGoal = sanitizeInput(selectedGoal);

    // Save state completely and transition to primary dashboard
    setStats((prev) => ({
      ...prev,
      name: safeName,
      goal: safeGoal,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(safeName)}`
    }));

    setCurrentScreen('dashboard');
  };

  return (
    <article id="signup-screen" className="flex-1 max-w-md mx-auto px-4 py-16 text-zinc-100 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" aria-hidden="true"></div>
        
        {/* Step details header */}
        <header className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest mb-2.5">
            <span>Stewardship Access Onboarding</span>
            <span>Step 0{step} of 02</span>
          </div>
          
          <h1 className="text-xl font-bold text-white font-display">
            {step === 1 ? 'Configure Environmental Profile' : 'Select Core Carbon Objectives'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {step === 1 
              ? 'Enter credentials to synchronize corporate records and active ledger dashboards.' 
              : 'Choose the objective that matches your main emission reduction strategy.'}
          </p>
        </header>

        {/* Global Error Banner */}
        {validationError && (
          <div role="alert" className="mb-5 p-3.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
            {validationError}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1 FORM */}
          {step === 1 && (
            <motion.form
              key="signup-step-1"
              onSubmit={handleNextStep}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              
              {/* Name */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="auth-name-input" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" aria-hidden="true" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    placeholder="e.g. Liam Parker"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 pl-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="auth-email-input" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" aria-hidden="true" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    placeholder="e.g. liam@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 focus:border-indigo-500/50 rounded-xl p-3 pl-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="auth-password-input" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Primary Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" aria-hidden="true" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 pl-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center space-x-1 cursor-pointer font-display focus:outline-none focus:ring-2 focus:ring-indigo-550"
                  aria-label="Proceed to environmental goals setup"
                >
                  <span>Select Environmental Goal</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

            </motion.form>
          )}

          {/* STEP 2 FORM */}
          {step === 2 && (
            <motion.div
              key="signup-step-2"
              className="space-y-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-3">Primary Goal Target Focus</legend>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Optimize overall carbon footprint',
                    'Transition to electric public commutes',
                    'Adopt zero meat-beef culinary habits',
                    'Minimize household power draw rates'
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setSelectedGoal(goal)}
                      aria-pressed={selectedGoal === goal}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold cursor-pointer font-display transition-all focus:outline-none focus:ring-2 focus:ring-indigo-550 ${
                        selectedGoal === goal
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                          : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="pt-5 border-t border-zinc-800 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-400 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider text-center cursor-pointer transition-colors font-display focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  aria-label="Return to auth setup step"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" aria-hidden="true" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSignupComplete}
                  className="flex-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow flex items-center justify-center space-x-1.5 cursor-pointer font-display focus:ring-2 focus:ring-indigo-500"
                  aria-label="Complete Setup and Access Environmental Ledger"
                >
                  <span>Build Digital Ledger</span>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </article>
  );
}
