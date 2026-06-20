import React from 'react';
import { Leaf, Award, Compass, Calculator, Users, PlusCircle, LayoutDashboard } from 'lucide-react';
import { ScreenType } from '../types/index';

interface NavbarProps {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  userXP: number;
}

export default function Navbar({ currentScreen, setCurrentScreen, userXP }: NavbarProps) {
  const navItems: { screen: ScreenType; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Home', icon: <Leaf className="w-4 h-4" /> },
    { screen: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { screen: 'guide', label: 'Impact Guide', icon: <Compass className="w-4 h-4" /> },
    { screen: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { screen: 'log-progress', label: 'Log Progress', icon: <PlusCircle className="w-4 h-4" /> },
    { screen: 'about', label: 'About', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 tracking-wide text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Brand - Styled after Bento Theme */}
        <button
          id="brand-logo-btn"
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-3 text-2xl font-bold font-display tracking-tight text-white hover:opacity-90 cursor-pointer transition-all duration-250"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/25">
            E
          </div>
          <span className="font-sans font-extrabold text-zinc-100">
            Eco<span className="text-indigo-400 font-display">Lumen</span>
          </span>
        </button>

        {/* Desktop Navigation - Styled with Bento Pill Accent */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800/80">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen || (item.screen === 'calculator' && currentScreen === 'report');
            return (
              <button
                id={`nav-${item.screen}`}
                key={item.screen}
                onClick={() => setCurrentScreen(item.screen)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-800 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button & XP Counter - Styled after Bento header details */}
        <div id="nav-actions" className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">Boost: {userXP} XP</span>
          </div>

          <button
            id="nav-get-started-btn"
            onClick={() => setCurrentScreen('calculator')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold font-display tracking-tight hover:shadow-indigo-500/20 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Start Analysis
          </button>
        </div>

      </div>
    </header>
  );
}

