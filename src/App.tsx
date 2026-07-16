import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  OnboardingData, 
  TrainingPlan, 
  DailyReadinessInput, 
  RunningObjective,
  FrequencyOption
} from "./types";
import { generateTrainingPlan } from "./engines";

// View components
import Landing from "./components/Landing";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import WeeklyPlanView from "./components/WeeklyPlanView";
import TodayWorkoutView from "./components/TodayWorkoutView";
import ProfileView from "./components/ProfileView";

// Icons
import { 
  Activity, 
  LayoutDashboard, 
  CalendarDays, 
  Flame, 
  LogOut, 
  Info,
  Menu,
  X,
  Compass,
  User
} from "lucide-react";

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"landing" | "onboarding" | "dashboard" | "today" | "plan" | "profile">("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core application states
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [readinessHistory, setReadinessHistory] = useState<Record<string, DailyReadinessInput>>({});
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, { feedback: string; rpe: number; date: string }>>({});

  // On mount: Load from localStorage
  useEffect(() => {
    try {
      const savedOnboarding = localStorage.getItem("run_plan_onboarding");
      const savedPlan = localStorage.getItem("run_plan_data");
      const savedWeekIdx = localStorage.getItem("run_plan_current_week");
      const savedReadiness = localStorage.getItem("run_plan_readiness");
      const savedCompleted = localStorage.getItem("run_plan_completed_workouts");

      if (savedOnboarding) setOnboarding(JSON.parse(savedOnboarding));
      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
        // If plan exists, default view should be Today's Workout or Dashboard!
        setActiveTab("today");
      }
      if (savedWeekIdx) setCurrentWeekIndex(Number(savedWeekIdx));
      if (savedReadiness) setReadinessHistory(JSON.parse(savedReadiness));
      if (savedCompleted) setCompletedWorkouts(JSON.parse(savedCompleted));
    } catch (e) {
      console.error("Error loading localStorage running plan states:", e);
    }
  }, []);

  // Sync current week to localStorage
  const handleSetCurrentWeekIndex = (idx: number) => {
    setCurrentWeekIndex(idx);
    localStorage.setItem("run_plan_current_week", String(idx));
  };

  // Complete onboarding flow
  const handleCompleteOnboarding = (data: OnboardingData) => {
    // Generate actual plan through Master Brain
    const newPlan = generateTrainingPlan(data);
    
    // Save to states
    setOnboarding(data);
    setPlan(newPlan);
    setCurrentWeekIndex(0);
    setActiveTab("dashboard"); // redirect straight to diagnostic/dashboard

    // Persist to localStorage
    localStorage.setItem("run_plan_onboarding", JSON.stringify(data));
    localStorage.setItem("run_plan_data", JSON.stringify(newPlan));
    localStorage.setItem("run_plan_current_week", "0");
  };

  const handleUpdateProfile = (data: OnboardingData) => {
    const newPlan = generateTrainingPlan(data);
    setOnboarding(data);
    setPlan(newPlan);
    localStorage.setItem("run_plan_onboarding", JSON.stringify(data));
    localStorage.setItem("run_plan_data", JSON.stringify(newPlan));
  };

  // Save Daily Readiness
  const handleSaveReadiness = (input: DailyReadinessInput) => {
    const todayKey = new Date().toISOString().split("T")[0];
    const newHistory = { ...readinessHistory };
    
    if (input === undefined) {
      delete newHistory[todayKey];
    } else {
      newHistory[todayKey] = input;
    }

    setReadinessHistory(newHistory);
    localStorage.setItem("run_plan_readiness", JSON.stringify(newHistory));
  };

  // Log workout completion
  const handleLogWorkoutCompletion = (workoutId: string, feedback: string, rpe: number) => {
    const newCompleted = {
      ...completedWorkouts,
      [workoutId]: {
        feedback,
        rpe,
        date: new Date().toISOString()
      }
    };
    setCompletedWorkouts(newCompleted);
    localStorage.setItem("run_plan_completed_workouts", JSON.stringify(newCompleted));
  };

  // Import full plan state
  const handleImportState = (imported: {
    onboarding: OnboardingData | null;
    plan: TrainingPlan | null;
    readinessHistory: Record<string, DailyReadinessInput>;
    completedWorkouts: Record<string, { feedback: string; rpe: number; date: string }>;
  }) => {
    setOnboarding(imported.onboarding);
    setPlan(imported.plan);
    setReadinessHistory(imported.readinessHistory);
    setCompletedWorkouts(imported.completedWorkouts);
    setCurrentWeekIndex(0);

    if (imported.plan) {
      localStorage.setItem("run_plan_onboarding", JSON.stringify(imported.onboarding));
      localStorage.setItem("run_plan_data", JSON.stringify(imported.plan));
      localStorage.setItem("run_plan_current_week", "0");
      localStorage.setItem("run_plan_readiness", JSON.stringify(imported.readinessHistory));
      localStorage.setItem("run_plan_completed_workouts", JSON.stringify(imported.completedWorkouts));
      setActiveTab("today");
    } else {
      handleResetAll();
    }
  };

  // Clear all states and reset app
  const handleResetAll = () => {
    setOnboarding(null);
    setPlan(null);
    setCurrentWeekIndex(0);
    setReadinessHistory({});
    setCompletedWorkouts({});
    setActiveTab("landing");

    localStorage.removeItem("run_plan_onboarding");
    localStorage.removeItem("run_plan_data");
    localStorage.removeItem("run_plan_current_week");
    localStorage.removeItem("run_plan_readiness");
    localStorage.removeItem("run_plan_completed_workouts");
  };

  // Get readiness input of today
  const todayKey = new Date().toISOString().split("T")[0];
  const todayReadiness = readinessHistory[todayKey];

  return (
    <div className="min-h-screen bg-darkbg text-white flex flex-col font-sans select-none antialiased">
      
      {/* Header and navigation bar */}
      <header className="sticky top-0 z-50 bg-darkbg/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo brand */}
          <div 
            onClick={() => setActiveTab(plan ? "today" : "landing")}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition group"
          >
            <div className="p-2 bg-neon rounded-xl text-black shadow-lg shadow-neon/10 shrink-0">
              <svg viewBox="0 0 100 100" className="w-5 h-5 fill-current" fillRule="evenodd">
                {/* Bottom bar of E */}
                <polygon points="15,75 34,75 40,65 21,65" />
                {/* Middle bar of E */}
                <polygon points="25,55 44,55 50,45 31,45" />
                {/* R Loop and Top Bar of E */}
                <path d="M 35,35 L 41,25 L 66,25 C 77,25 86,34 86,45 C 86,56 77,65 66,65 L 49,65 L 55,55 L 66,55 C 71,55 76,51 76,45 C 76,39 71,35 66,35 L 35,35 Z" />
                {/* R Leg */}
                <polygon points="55,65 67,65 81,85 69,85" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-1">
                ELEVR <span className="text-[8px] bg-neon/10 text-neon px-1.5 py-0.5 rounded-md font-black">RUNNING</span>
              </h1>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-black">RISE · COMMIT · CONQUER</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {plan && (
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab("today")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "today" 
                    ? "bg-neon/10 text-neon" 
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Flame className="w-4 h-4" />
                Hoy
              </button>

              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "dashboard" 
                    ? "bg-neon/10 text-neon" 
                    : "text-white/50 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Mi Diagnóstico
              </button>

              <button
                onClick={() => setActiveTab("plan")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "plan" 
                    ? "bg-neon/10 text-neon" 
                    : "text-white/50 hover:text-white"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Plan Semanal
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "profile" 
                    ? "bg-neon/10 text-neon" 
                    : "text-white/50 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Perfil
              </button>
            </nav>
          )}

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {plan && (
              <button
                onClick={handleResetAll}
                title="Reiniciar Plan"
                className="hidden sm:flex p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-rose-400 hover:border-rose-500/20 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger Button */}
            {plan && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white transition cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && plan && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[73px] left-0 right-0 bg-darkbg border-b border-white/10 p-4 space-y-2 z-40 shadow-2xl"
          >
            <button
              onClick={() => { setActiveTab("today"); setMobileMenuOpen(false); }}
              className={`w-full p-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-left flex items-center gap-3 ${
                activeTab === "today" ? "bg-neon/10 text-neon" : "text-white/50"
              }`}
            >
              <Flame className="w-4 h-4" />
              Entrenamiento de Hoy
            </button>
            <button
              onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
              className={`w-full p-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-left flex items-center gap-3 ${
                activeTab === "dashboard" ? "bg-neon/10 text-neon" : "text-white/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Diagnóstico Inicial
            </button>
            <button
              onClick={() => { setActiveTab("plan"); setMobileMenuOpen(false); }}
              className={`w-full p-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-left flex items-center gap-3 ${
                activeTab === "plan" ? "bg-neon/10 text-neon" : "text-white/50"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Plan de Semanas
            </button>
            <button
              onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
              className={`w-full p-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-left flex items-center gap-3 ${
                activeTab === "profile" ? "bg-neon/10 text-neon" : "text-white/50"
              }`}
            >
              <User className="w-4 h-4" />
              Perfil
            </button>
            <button
              onClick={() => { handleResetAll(); setMobileMenuOpen(false); }}
              className="w-full p-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-left text-rose-400 flex items-center gap-3 bg-rose-500/5 hover:bg-rose-500/10 transition mt-4"
            >
              <LogOut className="w-4 h-4" />
              Borrar todo y Salir
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto relative">
        <AnimatePresence mode="wait">
          {activeTab === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Landing 
                onStartOnboarding={() => setActiveTab("onboarding")}
                hasPlan={!!plan}
                onGoToDashboard={() => setActiveTab("today")}
              />
            </motion.div>
          )}

          {activeTab === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Onboarding 
                onComplete={handleCompleteOnboarding}
                onCancel={() => setActiveTab(plan ? "today" : "landing")}
              />
            </motion.div>
          )}

          {activeTab === "dashboard" && plan && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard 
                plan={plan}
                activeInjury={onboarding?.activeInjury || false}
                injuryAreas={onboarding?.injuryAreas || []}
              />
            </motion.div>
          )}

          {activeTab === "today" && plan && (
            <motion.div
              key="today"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TodayWorkoutView 
                plan={plan}
                readiness={todayReadiness}
                onSaveReadiness={handleSaveReadiness}
                onLogWorkoutCompletion={handleLogWorkoutCompletion}
                completedWorkouts={completedWorkouts}
                activeInjury={onboarding?.activeInjury || false}
                injuryAreas={onboarding?.injuryAreas || []}
              />
            </motion.div>
          )}

          {activeTab === "plan" && plan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WeeklyPlanView 
                plan={plan}
                currentWeekIndex={currentWeekIndex}
                onSetCurrentWeek={handleSetCurrentWeekIndex}
                onLogWorkoutCompletion={handleLogWorkoutCompletion}
                completedWorkouts={completedWorkouts}
              />
            </motion.div>
          )}

          {activeTab === "profile" && onboarding && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileView 
                onboarding={onboarding}
                onUpdateProfile={handleUpdateProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-white/10 bg-darkbg px-4 py-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full neon-bg"></div>
              <span>© 2026 AeroPlan Running Corp.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <span>VAM Calculadora v1.2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <span>Riegel Predictor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full neon-bg"></div>
              <span>Readiness Algoritmo v3.0</span>
            </div>
          </div>
          <div className="text-[10px] text-white/20 italic font-bold tracking-widest">
            AEROPLAN_CORE_V1.1.0
          </div>
        </div>
      </footer>

    </div>
  );
}
