import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Guide from './components/Guide';
import Signup from './components/Signup';
import Calculator from './components/Calculator';
import Report from './components/Report';
import About from './components/About';
import { ScreenType, UserStats, Activity, CalculatorInput } from './types';

export default function App() {
  // Navigation active screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Shared user states pre-loaded with realistic, high-fidelity default data
  const [userStats, setUserStats] = useState<UserStats>({
    name: 'Liam Sterling',
    email: 'lsterling@naturenetwork.org',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIx304homzzfgxq0sLNhWbN1OFXpyMqfilow-0QFD6M2UM5oVl0I9pbazrQliWy8R55akdTaMuPHthWbTDOjEYfRpZt7qGfvx7fs6JT_vF5zryqFkohFdDCoeUp3GZjHRUizzEdu52xJV5--CtTim3V2OgKVgBmBrdgoUdMcZfwLpBcFo_OYhI2cv8Xc-9k6c3057KcVByGtaSSgv6V-gKtWeNyZYubnyEBqrob5UgZXEQSZiJVQE505l5y3leh-jmT79UQ-pIY8U6',
    levelName: 'Carbon Advocate Level 4',
    nextLevelXP: 600,
    currentXP: 450,
    sustainabilityScore: 74,
    directCarbonSaved: 2.34, // in Tons
    waterConserved: 12450, // in Gallons
    greenEnergyPct: 85, // 85% clean energy
    goal: 'Reduce Travel Carbon',
  });

  // Trackers for daily logs inside Resource Guide
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'activity-1',
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      type: 'Meals',
      amount: 2,
      unit: 'Meals',
      impactSaved: 5.6, // kg
    },
    {
      id: 'activity-2',
      timestamp: new Date(Date.now() - 3600000 * 24), // 24 hours ago
      type: 'Transportation',
      amount: 12,
      unit: 'Miles',
      impactSaved: 4.9, // kg
    }
  ]);

  // Shared calculator inputs
  const [calcInput, setCalcInput] = useState<CalculatorInput>({
    carType: 'Gasoline',
    annualMileage: 12000,
    flightsPerYear: 3,
    electricBill: 150,
    energySource: 'grid',
    heatingType: 'gas',
    householdSize: 2,
    dietType: 'average',
    recycleRate: 40,
    foodWaste: 'medium',
  });

  // Checklist active state inside Dashboard
  const [actionStates, setActionStates] = useState<{ [key: string]: boolean }>({
    unplug: false,
    transit: false,
    meal: false,
  });

  // Action toggler helper update balances
  const toggleAction = (actionId: string, xpReward: number, offsetReward: number) => {
    const isCompletedNow = !actionStates[actionId];
    
    // Toggle check
    setActionStates((prev) => ({
      ...prev,
      [actionId]: isCompletedNow,
    }));

    // Update Overall Stats
    setUserStats((prev) => {
      const modifier = isCompletedNow ? 1 : -1;
      
      let newXP = prev.currentXP + xpReward * modifier;
      let newLevel = prev.levelName;
      let scoreDelta = isCompletedNow ? 4 : -4;

      // Handle custom Level up rules
      if (newXP >= prev.nextLevelXP) {
        newXP = newXP % prev.nextLevelXP;
        newLevel = "Carbon Champion Level 5";
      } else if (newXP < 0) {
        newXP = prev.nextLevelXP + newXP;
        newLevel = "Carbon Advocate Level 4";
      }

      return {
        ...prev,
        currentXP: Math.max(0, newXP),
        levelName: newLevel,
        sustainabilityScore: Math.min(100, Math.max(0, prev.sustainabilityScore + scoreDelta)),
        directCarbonSaved: Math.max(0, prev.directCarbonSaved + offsetReward * modifier),
        waterConserved: prev.waterConserved + (actionId === 'meal' ? 150 : 0) * modifier,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      
      {/* Dynamic Header */}
      <Navbar 
        currentScreen={currentScreen} 
        setCurrentScreen={setCurrentScreen} 
        userXP={userStats.currentXP} 
      />

      {/* Main Screen Routes Container */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <Home setCurrentScreen={setCurrentScreen} />
        )}

        {currentScreen === 'dashboard' && (
          <Dashboard 
            setCurrentScreen={setCurrentScreen}
            stats={userStats}
            setStats={setUserStats}
            actionStates={actionStates}
            toggleAction={toggleAction}
          />
        )}

        {currentScreen === 'guide' && (
          <Guide 
            setCurrentScreen={setCurrentScreen}
            stats={userStats}
            setStats={setUserStats}
            activities={activities}
            setActivities={setActivities}
          />
        )}

        {currentScreen === 'log-progress' && (
          <Signup 
            setCurrentScreen={setCurrentScreen}
            stats={userStats}
            setStats={setUserStats}
          />
        )}

        {currentScreen === 'calculator' && (
          <Calculator 
            setCurrentScreen={setCurrentScreen}
            calcInput={calcInput}
            setCalcInput={setCalcInput}
          />
        )}

        {currentScreen === 'report' && (
          <Report 
            setCurrentScreen={setCurrentScreen}
            calcInput={calcInput}
            stats={userStats}
            setStats={setUserStats}
          />
        )}

        {currentScreen === 'about' && (
          <About setCurrentScreen={setCurrentScreen} />
        )}
      </main>

      {/* Standard sleek technical carbon footer */}
      <footer id="app-footer" className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Eco-Lumen Greenhouse Audit Desk</span>
            <span className="text-slate-700">|</span>
            <span>All rights reserved &copy; 2026.</span>
          </div>

          <div className="flex items-center space-x-5 font-mono">
            <button onClick={() => setCurrentScreen('about')} className="hover:text-slate-300 cursor-pointer">Protocol Standard</button>
            <span>•</span>
            <button onClick={() => setCurrentScreen('calculator')} className="hover:text-slate-300 cursor-pointer">Scope Calculator</button>
            <span>•</span>
            <span className="text-emerald-500/80 animate-pulse font-bold">● CLIMATE ENGINE ACTIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
