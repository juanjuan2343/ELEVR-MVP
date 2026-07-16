import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  OnboardingData,
  TrainingPlan,
  DailyReadinessInput
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
  LayoutDashboard,
  CalendarDays,
  Flame,
  LogOut,
  User
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"landing" | "onboarding" | "dashboard" | "today" | "plan" | "profile">("landing");

  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [readinessHistory, setReadinessHistory] = useState<Record<string, DailyReadinessInput>>({});
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, { feedback: string; rpe: number; date: string }>>({});

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
        setActiveTab("today");
      }

      if (savedWeekIdx) setCurrentWeekIndex(Number(savedWeekIdx));
      if (savedReadiness) setReadinessHistory(JSON.parse(savedReadiness));
      if (savedCompleted) setCompletedWorkouts(JSON.parse(savedCompleted));
    } catch (e) {
      console.error("Error loading localStorage running plan states:", e);
    }
  }, []);

  const handleSetCurrentWeekIndex = (idx: number) => {
    setCurrentWeekIndex(idx);
    localStorage.setItem("run_plan_current_week", String(idx));
  };

  const handleCompleteOnboarding = (data: OnboardingData) => {
    const newPlan = generateTrainingPlan(data);

    setOnboarding(data);
    setPlan(newPlan);
    setCurrentWeekIndex(0);
    setActiveTab("dashboard");

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

  const todayKey = new Date().toISOString().split("T")[0];
  const todayReadiness = readinessHistory[todayKey];

  const topNavButtonClass = (tab: "today" | "dashboard" | "plan" | "profile") =>
    `px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ${
      activeTab === tab
        ? "bg-neon/10 text-neon"
        : "text-white/50 hover:text-white"
    }`;

  const horizontalNavButtonClass = (tab: "today" | "dashboard" | "plan" | "profile") =>
    `flex-1 min-w-[78px] px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
      activeTab === tab
        ? "bg-neon/10 text-neon border border-neon/30"
        : "text-white/45 border border-white/5 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen bg-darkbg text-white flex flex-col font-sans select-none antialiased">
      <header className="sticky top-0 z-50 bg-darkbg/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveTab(plan ? "today" : "landing")}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition group"
          >
            <div className="p-2 bg-neon rounded-xl text-black shadow-lg shadow-neon/10 shrink-0">
              <svg viewBox="0 0 100 100" className="w-5 h-5 fill-current" fillRule="evenodd">
                <polygon points="15,75 34,75 40,65 21,65" />
                <polygon points="25,55 44,55 50,45 31,45" />
                <path d="M 35,35 L 41,25 L 66,25 C 77,25 86,34 86,45 C 86,56 77,65 66,65 L 49,65 L 55,55 L 66,55 C 71,55 76,51 76,45 C 76,39 71,35 66,35 L 35,35 Z" />
                <polygon points="55,65 67,65 81,85 69,85" />
              </svg>
            </div>

            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-1">
                ELEVR <span className="text-[8px] bg-neon/10 text-neon px-1.5 py-0.5 rounded-md font-black">RUNNING</span>
              </h1>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-black">
                RISE · COMMIT · CONQUER
              </p>
            </div>
          </div>

          {plan && (
            <nav className="hidden md:flex items-center gap-1">
              <button onClick={() => setActiveTab("today")} className={topNavButtonClass("today")}>
                <Flame className="w-4 h-4" />
                Hoy
              </button>

              <button onClick={() => setActiveTab("dashboard")} className={topNavButtonClass("dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                Diagnóstico
              </button>

              <button onClick={() => setActiveTab("plan")} className={topNavButtonClass("plan")}>
                <CalendarDays className="w-4 h-4" />
                Plan
              </button>

              <button onClick={() => setActiveTab("profile")} className={topNavButtonClass("profile")}>
                <User className="w-4 h-4" />
                Perfil
              </button>
            </nav>
          )}

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
          </div>
        </div>
      </header>

      {plan && (
        <div className="sticky top-[73px] z-40 bg-darkbg/95 backdrop-blur-md border-b border-white/10 px-3 py-3 md:hidden">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
            <button onClick={() => setActiveTab("today")} className={horizontalNavButtonClass("today")}>
              <Flame className="w-4 h-4" />
              Hoy
            </button>

            <button onClick={() => setActiveTab("dashboard")} className={horizontalNavButtonClass("dashboard")}>
              <LayoutDashboard className="w-4 h-4" />
              Diagnóstico
            </button>

            <button onClick={() => setActiveTab("plan")} className={horizontalNavButtonClass("plan")}>
              <CalendarDays className="w-4 h-4" />
              Plan
            </button>

            <button onClick={() => setActiveTab("profile")} className={horizontalNavButtonClass("profile")}>
              <User className="w-4 h-4" />
              Perfil
            </button>
          </div>
        </div>
      )}

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

          {activeTab === "profile" && onboarding && plan && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileView
                onboarding={onboarding}
                plan={plan}
                onUpdateProfile={handleUpdateProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
