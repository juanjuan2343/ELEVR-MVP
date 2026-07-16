import React, { useState } from "react";
import { 
  TrainingPlan, 
  DailyReadinessInput, 
  WorkoutSession, 
  DailyReadinessScore 
} from "../types";
import { 
  runDailyExecutionEngine, 
  calculateReadiness 
} from "../engines";
import { 
  Activity, 
  BrainCircuit, 
  ShieldAlert, 
  CheckCircle, 
  Smile, 
  Zap, 
  ArrowRight, 
  Volume2, 
  HelpCircle, 
  Heart,
  Dumbbell,
  Moon,
  Compass,
  CornerDownRight,
  ClipboardList
} from "lucide-react";

interface TodayWorkoutViewProps {
  plan: TrainingPlan;
  readiness: DailyReadinessInput | undefined;
  onSaveReadiness: (input: DailyReadinessInput) => void;
  onLogWorkoutCompletion: (workoutId: string, feedback: string, rpe: number) => void;
  completedWorkouts: Record<string, { feedback: string; rpe: number; date: string }>;
  activeInjury: boolean;
  injuryAreas: string[];
}

export default function TodayWorkoutView({
  plan,
  readiness,
  onSaveReadiness,
  onLogWorkoutCompletion,
  completedWorkouts,
  activeInjury,
  injuryAreas
}: TodayWorkoutViewProps) {
  
  // Questionnaire states
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [sleepQuality, setSleepQuality] = useState<"bueno" | "normal" | "malo">("normal");
  const [stress, setStress] = useState<number>(2);
  const [fatigue, setFatigue] = useState<number>(2);
  const [muscleSoreness, setMuscleSoreness] = useState<number>(2);
  const [jointSoreness, setJointSoreness] = useState<number>(1);
  const [prevRpe, setPrevRpe] = useState<number>(5);

  // Completion logging states
  const [feedback, setFeedback] = useState<string>("adecuado");
  const [loggedRpe, setLoggedRpe] = useState<number>(5);

  // Identify today's day index (Lunes is 0, Domingo is 6)
  // Let's get actual local day. javascript getDay returns 0 for Sunday, 1 for Monday...
  const localDay = new Date().getDay();
  const dayIndex = localDay === 0 ? 6 : localDay - 1; // map so Monday is 0, Sunday is 6

  // Find scheduled workout for today
  // Let's use Week 1 by default, or active week. We can display active week's day
  const activeWeek = plan.weeks[0]; // For today, we assume we check active week
  const originalWorkout = activeWeek.sessions[dayIndex] || activeWeek.sessions[0];

  const hasLoggedReadiness = !!readiness;

  // Run running decision engines
  let readinessScore: DailyReadinessScore | null = null;
  let adaptationResult: ReturnType<typeof runDailyExecutionEngine> | null = null;

  if (hasLoggedReadiness && readiness) {
    readinessScore = calculateReadiness(readiness);
    adaptationResult = runDailyExecutionEngine(
      originalWorkout,
      readinessScore.score,
      activeInjury,
      injuryAreas,
      readiness.jointSoreness || 1,
      readiness.muscleSoreness
    );
  }

  const handleReadinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: DailyReadinessInput = {
      date: new Date().toISOString().split("T")[0],
      sleepHours,
      sleepQuality,
      stress,
      fatigue,
      muscleSoreness,
      jointSoreness,
      prevRPE: prevRpe
    };
    onSaveReadiness(input);
  };

  const getDayName = (idx: number) => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return days[idx] || "Hoy";
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "carrera": return <Activity className="w-5 h-5 text-neon" />;
      case "fuerza": return <Dumbbell className="w-5 h-5 text-blue-400" />;
      case "movilidad": return <Compass className="w-5 h-5 text-teal-400" />;
      default: return <Moon className="w-5 h-5 text-white/40" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      
      {/* Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-neon/10 text-neon text-[9px] font-black uppercase tracking-widest">
            Running Daily Execution Engine
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1.5">
            Entrenamiento de Hoy ({getDayName(dayIndex)})
          </h2>
          <p className="text-xs text-white/60 font-semibold">
            Adaptación del plan en vivo según tus sensaciones corporales inmediatas de esta mañana.
          </p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 font-black text-xs uppercase tracking-wider rounded-xl font-mono">
          {new Date().toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* STEP 1: FILL READINESS IF NOT PRESENT */}
      {!hasLoggedReadiness ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 bg-neon/10 rounded-xl text-neon">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">Cuestionario de Readiness Diario</h3>
              <p className="text-xs text-white/50 font-semibold">Completa tus indicadores de hoy para activar las adaptaciones inteligentes del plan.</p>
            </div>
          </div>

          <form onSubmit={handleReadinessSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Horas de Sueño */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Horas de Sueño Anoche</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="3" 
                    max="10" 
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full accent-neon bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-mono font-black text-xs text-neon bg-black/40 px-2.5 py-1 rounded-md shrink-0 border border-white/5">
                    {sleepHours} Horas
                  </span>
                </div>
              </div>

              {/* Calidad de Sueño */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Calidad del Sueño</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["bueno", "normal", "malo"] as const).map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition cursor-pointer ${
                        sleepQuality === q
                          ? "bg-neon/10 border-neon text-neon"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white/50"
                      }`}
                    >
                      {q === "bueno" ? "Bueno (+10)" : q === "normal" ? "Normal (0)" : "Malo (-20)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estrés */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block flex justify-between">
                  <span>Estrés Mental</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">1: Bajo | 5: Alto</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setStress(v)}
                      className={`py-2 rounded-lg border font-mono text-xs font-black cursor-pointer transition ${
                        stress === v
                          ? "bg-neon/15 border-neon text-neon"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fatiga */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block flex justify-between">
                  <span>Fatiga General</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">1: Fresco | 5: Exhausto</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFatigue(v)}
                      className={`py-2 rounded-lg border font-mono text-xs font-black cursor-pointer transition ${
                        fatigue === v
                          ? "bg-neon/15 border-neon text-neon"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dolor Muscular */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block flex justify-between">
                  <span>Dolor Muscular (Agujetas)</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">1: Ninguno | 5: Severo</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMuscleSoreness(v)}
                      className={`py-2 rounded-lg border font-mono text-xs font-black cursor-pointer transition ${
                        muscleSoreness === v
                          ? "bg-amber-500/15 border-amber-500 text-amber-400"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dolor Articular / Tendinoso */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block flex justify-between">
                  <span>Dolor Articular o Tendinoso</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">1: Ninguno | 5: Punzante</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setJointSoreness(v)}
                      className={`py-2 rounded-lg border font-mono text-xs font-black cursor-pointer transition ${
                        jointSoreness === v
                          ? "bg-rose-500/15 border-rose-500 text-rose-400"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* RPE anterior */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Esfuerzo de tu última sesión de entrenamiento (RPE 1-10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={prevRpe}
                    onChange={(e) => setPrevRpe(Number(e.target.value))}
                    className="w-full accent-neon bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-mono font-black text-xs text-white bg-black/40 px-3 py-1 rounded-md shrink-0 border border-white/5">
                    RPE {prevRpe}/10
                  </span>
                </div>
                <p className="text-[10px] text-white/40 font-semibold leading-relaxed">
                  Un RPE alto (9 o 10) en la sesión anterior aplicará una limitación adaptativa del 30-60% si se combina con pocas horas de sueño.
                </p>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-6 py-3 bg-neon text-darkbg hover:opacity-90 font-black uppercase tracking-widest rounded-xl text-xs transition cursor-pointer"
              >
                Calcular Readiness & Ajustar Entrenamiento
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* STEP 2: DISPLAY DYNAMIC OUTPUT */
        <div className="space-y-6">
          
          {/* Readiness Score Card */}
          {readinessScore && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score visualizer */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-neon/5 rounded-full blur-xl" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Índice de Readiness</span>
                
                {/* Dial SVG */}
                <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="64" cy="64" r="50" 
                      className="stroke-white/10" strokeWidth="8" fill="transparent" 
                    />
                    <circle 
                      cx="64" cy="64" r="50" 
                      className="stroke-neon transition-all duration-1000" strokeWidth="8" fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - readinessScore.score / 100)}`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{readinessScore.score}</span>
                    <span className="text-[9px] font-black text-white/40 tracking-widest">/100</span>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                  readinessScore.score >= 85 
                    ? "bg-neon/10 text-neon border border-neon/20" 
                    : readinessScore.score >= 70 
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                      : readinessScore.score >= 55
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  Estado: {readinessScore.score >= 85 ? "Progresar" : readinessScore.score >= 70 ? "Normal" : readinessScore.score >= 55 ? "Moderar Volumen" : readinessScore.score >= 40 ? "Adaptación Activa" : "Descanso / Descarga"}
                </span>
              </div>

              {/* Diagnostic checklist */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:col-span-2 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-neon" />
                    Indicadores del Despertar
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-white/80 font-semibold">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">Sueño total:</span>
                      <strong className="text-white">{readiness?.sleepHours} horas ({readiness?.sleepQuality})</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">Fatiga:</span>
                      <strong className="text-white">{readiness?.fatigue}/5</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">Estrés mental:</span>
                      <strong className="text-white">{readiness?.stress}/5</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">RPE previo:</span>
                      <strong className="text-white">{readiness?.prevRPE}/10</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">Dolor Muscular:</span>
                      <strong className={`${(readiness?.muscleSoreness || 0) > 3 ? "text-amber-400 font-bold" : "text-white"}`}>{readiness?.muscleSoreness}/5</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">Dolor Articular:</span>
                      <strong className={`${(readiness?.jointSoreness || 0) > 2 ? "text-rose-400 font-black" : "text-white"}`}>{readiness?.jointSoreness || 1}/5</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-semibold leading-normal">
                  <span>¿Algún dato erróneo?</span>
                  <button
                    onClick={() => onSaveReadiness(undefined as any)}
                    className="text-neon hover:underline font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer text-[10px]"
                  >
                    Recalcular Readiness
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Engine Output Box */}
          {adaptationResult && (
            <div className="space-y-6">
              
              {/* Decision and Status banner */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                adaptationResult.status === "mantener"
                  ? "bg-neon/10 border-neon/20 text-neon"
                  : adaptationResult.status === "reducido"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest block">Decisión del Motor Adaptativo</span>
                  <h4 className="text-lg font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Smile className="w-5 h-5" />
                    Entrenamiento: {adaptationResult.status.toUpperCase()}
                  </h4>
                  <p className="text-xs text-white/80 font-semibold leading-relaxed max-w-2xl">
                    {adaptationResult.justification}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1 font-mono shrink-0">
                  <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">Riesgo de Lesión</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    adaptationResult.injuryRisk === "Bajo" 
                      ? "bg-neon/10 text-neon border border-neon/20" 
                      : adaptationResult.injuryRisk === "Moderado" 
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" 
                        : "bg-rose-500/15 text-rose-400 border border-rose-500/20 animate-pulse"
                  }`}>
                    {adaptationResult.injuryRisk}
                  </span>
                </div>
              </div>

              {/* Side-by-side or comparison cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Original Scheduled */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 opacity-60">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">1. Previsto en Plan Original</span>
                    {getSessionTypeIcon(originalWorkout.type)}
                  </div>
                  <h4 className="font-black text-white uppercase tracking-wider text-sm">{originalWorkout.name}</h4>
                  
                  <div className="space-y-1 text-xs text-white/60 font-semibold">
                    <span className="text-[9px] font-black text-white/40 uppercase block">Trabajo Principal:</span>
                    <p>{originalWorkout.mainWork}</p>
                  </div>
                  <div className="space-y-1 text-xs text-white/60 font-semibold">
                    <span className="text-[9px] font-black text-white/40 uppercase block">Ritmos planificados:</span>
                    <p>{originalWorkout.intensity}</p>
                  </div>
                </div>

                {/* Final Recommended */}
                <div className="bg-white/5 border border-neon/30 rounded-2xl p-5 space-y-3 shadow-lg shadow-neon/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-neon/10 text-neon text-[8px] font-black px-2.5 py-0.5 rounded-bl-lg uppercase tracking-widest">
                    Recomendado por IA
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[9px] font-black text-neon uppercase tracking-widest block">2. Entrenamiento Final Recomendado</span>
                    {adaptationResult.adaptedWorkout ? getSessionTypeIcon(adaptationResult.adaptedWorkout.type) : <Moon className="w-5 h-5 text-rose-400" />}
                  </div>

                  {adaptationResult.adaptedWorkout ? (
                    <>
                      <h4 className="font-black text-white uppercase tracking-wider text-sm">{adaptationResult.adaptedWorkout.name}</h4>
                      
                      <div className="space-y-1 text-xs">
                        <span className="text-[9px] font-black text-neon uppercase tracking-widest block mb-1">Trabajo Principal Reajustado:</span>
                        <p className="text-white font-semibold bg-black/40 p-3 rounded-lg border border-white/10 leading-relaxed">
                          {adaptationResult.adaptedWorkout.mainWork}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-1.5 font-semibold">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Calentamiento:</span>
                          <p className="text-white/80">{adaptationResult.adaptedWorkout.warmup}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Ritmo Recomendado:</span>
                          <p className="text-neon font-mono font-black">{adaptationResult.adaptedWorkout.intensity}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <p className="text-white/50 text-xs font-semibold">Se recomienda descanso total absoluto hoy para asimilar fatiga.</p>
                      <span className="text-sm font-black text-rose-400 uppercase tracking-widest">Descanso Obligatorio</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Recovery tips */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Recomendación de Recuperación Preventiva:</span>
                <p className="text-xs text-white/80 font-semibold leading-relaxed">
                  {adaptationResult.recoveryRecommendation}
                </p>
              </div>

              {/* Log Completion Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
                  <CheckCircle className="w-5 h-5 text-neon" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Reportar Finalización de Sesión</h4>
                </div>

                {completedWorkouts[originalWorkout.id] ? (
                  <div className="p-4 bg-neon/10 border border-neon/20 rounded-xl text-xs text-neon font-black uppercase tracking-wider flex items-center gap-2">
                    ✓ ¡Entrenamiento ya completado y guardado hoy! Buen trabajo asimilando la carga.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60 font-semibold leading-relaxed">
                      ¿Has terminado el entrenamiento recomendado? Guarda tu feedback para acumular memoria adaptativa y que el plan aprenda de tu rendimiento real.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Feedback */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Sensación General:</label>
                        <select
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-neon cursor-pointer font-semibold"
                        >
                          <option value="perfecto">Excelente / Perfecto</option>
                          <option value="adecuado">Adecuado / Bien</option>
                          <option value="muy_duro">Muy duro / Agotador</option>
                          <option value="facil">Demasiado fácil</option>
                          <option value="incompleto">Incompleto / Abandono</option>
                        </select>
                      </div>

                      {/* RPE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Percepción de Esfuerzo de esta sesión (RPE 1-10):</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={loggedRpe}
                            onChange={(e) => setLoggedRpe(Number(e.target.value))}
                            className="w-full accent-neon bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="font-mono font-black text-xs text-neon bg-black/40 px-2 py-0.5 rounded-md shrink-0 border border-white/5">
                            {loggedRpe}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onLogWorkoutCompletion(originalWorkout.id, feedback, loggedRpe)}
                        className="px-6 py-3 bg-neon text-darkbg hover:opacity-90 font-black uppercase tracking-widest rounded-xl text-xs transition cursor-pointer"
                      >
                        Guardar & Registrar Sesión Realizada
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
