import React, { useState } from "react";
import { TrainingPlan, WorkoutSession, WeeklyPlan } from "../types";
import { 
  Calendar, 
  Dumbbell, 
  Activity, 
  Moon, 
  Compass, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  CornerDownRight, 
  Zap,
  Info
} from "lucide-react";

interface WeeklyPlanViewProps {
  plan: TrainingPlan;
  currentWeekIndex: number;
  onSetCurrentWeek: (idx: number) => void;
  onLogWorkoutCompletion: (workoutId: string, feedback: string, rpe: number) => void;
  completedWorkouts: Record<string, { feedback: string; rpe: number; date: string }>;
}

export default function WeeklyPlanView({
  plan,
  currentWeekIndex,
  onSetCurrentWeek,
  onLogWorkoutCompletion,
  completedWorkouts
}: WeeklyPlanViewProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  
  // Feedback form states
  const [selectedFeedback, setSelectedFeedback] = useState<string>("adecuado");
  const [selectedRpe, setSelectedRpe] = useState<number>(5);

  const activeWeek: WeeklyPlan = plan.weeks[currentWeekIndex];

  const getDayName = (dayIdx: number) => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return days[dayIdx] || "Día";
  };

  const getSessionTypeBadge = (type: string) => {
    switch (type) {
      case "carrera":
        return <span className="px-2.5 py-1 rounded-full bg-neon/10 text-neon text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-neon/20"><Activity className="w-3 h-3" /> Carrera</span>;
      case "fuerza":
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-500/20"><Dumbbell className="w-3 h-3" /> Fuerza</span>;
      case "movilidad":
        return <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-teal-500/20"><Compass className="w-3 h-3" /> Movilidad</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-white/10"><Moon className="w-3 h-3" /> Descanso</span>;
    }
  };

  const toggleExpand = (sessionId: string) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(sessionId);
      // Reset form values to normal defaults when opening
      setSelectedFeedback("adecuado");
      setSelectedRpe(5);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Week Selector Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neon/10 rounded-xl text-neon shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Cronograma del Plan</h3>
            <p className="text-xs text-white/50 font-semibold">Selecciona la semana que deseas auditar:</p>
          </div>
        </div>

        {/* Scrollable button pills for weeks */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
          {plan.weeks.map((w, idx) => {
            const isSelected = idx === currentWeekIndex;
            return (
              <button
                key={w.weekNumber}
                onClick={() => {
                  onSetCurrentWeek(idx);
                  setExpandedSessionId(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition flex flex-col items-center gap-0.5 shrink-0 min-w-[56px] cursor-pointer border ${
                  isSelected 
                    ? "bg-neon text-darkbg border-neon" 
                    : "bg-black/40 border-white/10 text-white/50 hover:border-white/25 hover:text-white"
                }`}
              >
                <span>S{w.weekNumber}</span>
                {w.isDescarga && (
                  <span className={`text-[8px] font-black uppercase tracking-wider ${isSelected ? "text-darkbg" : "text-amber-500"}`}>
                    Desc
                  </span>
                )}
                {w.isTaper && (
                  <span className={`text-[8px] font-black uppercase tracking-wider ${isSelected ? "text-darkbg" : "text-rose-500"}`}>
                    Taper
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Header Description */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-neon/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-black uppercase tracking-widest text-white">Semana {activeWeek.weekNumber} de {plan.durationWeeks}</span>
          {activeWeek.isDescarga && (
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-black rounded-md uppercase tracking-widest border border-amber-500/10">
              Semana de Descarga Activa (Deload)
            </span>
          )}
          {activeWeek.isTaper && (
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[9px] font-black rounded-md uppercase tracking-widest border border-rose-500/10">
              Semana de Taper & Puesta a Punto
            </span>
          )}
        </div>
        <p className="text-xs text-white/70 font-semibold leading-relaxed max-w-3xl">
          {activeWeek.description}
        </p>
      </div>

      {/* Days of the Week List */}
      <div className="space-y-3">
        {activeWeek.sessions.map((session, dayIdx) => {
          const isCompleted = !!completedWorkouts[session.id];
          const loggedFeedback = completedWorkouts[session.id];
          const isExpanded = expandedSessionId === session.id;

          return (
            <div 
              key={session.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isCompleted 
                  ? "bg-white/5 border-neon/20" 
                  : isExpanded 
                    ? "bg-white/5 border-white/20" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Day Header */}
              <div 
                onClick={() => toggleExpand(session.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="text-left">
                    <span className="text-white/40 text-[9px] uppercase font-black block tracking-widest">
                      Día {dayIdx + 1}
                    </span>
                    <span className="text-sm font-black uppercase tracking-wider text-white">
                      {getDayName(dayIdx)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-white/10 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      {getSessionTypeBadge(session.type)}
                      {isCompleted && (
                        <span className="px-2 py-0.5 bg-neon/10 text-neon text-[8px] font-black rounded-md uppercase tracking-widest flex items-center gap-0.5 border border-neon/20">
                          <CheckCircle className="w-2.5 h-2.5" /> Completado
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[280px] sm:max-w-[400px]">
                      {session.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isCompleted && session.type !== "descanso" && (
                    <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-widest text-white/40">
                      Ver entrenamiento
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-white/50" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </div>

              {/* Day Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-white/10 pt-5 bg-black/20 space-y-5">
                  {/* Single Column Clean Layout */}
                  <div className="max-w-2xl mx-auto space-y-5 text-xs font-semibold">
                    {/* Objetivo Fisiológico / Target */}
                    {(session.objective || session.intensity) && (
                      <div className="space-y-1.5 pb-3 border-b border-white/5">
                        {session.objective && (
                          <div>
                            <span className="text-white/40 font-black uppercase text-[9px] tracking-widest block">Objetivo Fisiológico:</span>
                            <p className="text-white font-bold text-sm leading-relaxed">{session.objective}</p>
                          </div>
                        )}
                        {session.intensity && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-white/40 font-black uppercase text-[9px] tracking-widest">Intensidad / Ritmos:</span>
                            <span className="px-2 py-0.5 bg-neon/15 text-neon font-mono font-bold text-[10px] rounded-md border border-neon/20">
                              {session.intensity}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timeline Column */}
                    {session.type !== "descanso" && (
                      <div className="relative pl-5 border-l border-white/10 space-y-5">
                        {/* Calentamiento */}
                        {session.warmup && (
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-white/30 border border-darkbg" />
                            <span className="text-white/40 font-black uppercase text-[9px] tracking-widest block mb-0.5">Calentamiento Preventivo:</span>
                            <p className="text-white/80 leading-relaxed">{session.warmup}</p>
                          </div>
                        )}

                        {/* Trabajo Principal */}
                        {session.mainWork && (
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-neon border border-darkbg animate-pulse" />
                            <span className="text-neon font-black uppercase text-[9px] tracking-widest block mb-0.5">Trabajo Principal:</span>
                            <p className="text-white font-bold leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                              {session.mainWork}
                            </p>
                          </div>
                        )}

                        {/* Recuperación */}
                        {session.recovery && session.recovery !== "N/A" && (
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-white/30 border border-darkbg" />
                            <span className="text-white/40 font-black uppercase text-[9px] tracking-widest block mb-0.5">Recuperación:</span>
                            <p className="text-white/80 leading-relaxed font-bold">{session.recovery}</p>
                          </div>
                        )}

                        {/* Vuelta a la Calma */}
                        {session.cooldown && (
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-white/30 border border-darkbg" />
                            <span className="text-white/40 font-black uppercase text-[9px] tracking-widest block mb-0.5">Vuelta a la Calma:</span>
                            <p className="text-white/80 leading-relaxed">{session.cooldown}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {session.physiologicalExplanation && (
                    <div className="max-w-2xl mx-auto p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-white/60 leading-relaxed font-semibold">
                      <strong className="text-white font-bold block mb-0.5 flex items-center gap-1 uppercase text-[9px] tracking-widest">
                        <Info className="w-3.5 h-3.5 text-neon" /> Explicación fisiológica:
                      </strong>
                      {session.physiologicalExplanation}
                    </div>
                  )}

                  {session.fatigueAdaptation && (
                    <div className="max-w-2xl mx-auto p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[11px] text-amber-300/80 leading-relaxed font-semibold">
                      <strong className="text-amber-400 block mb-0.5 uppercase text-[9px] tracking-widest">⚠️ Modificación adaptativa por fatiga:</strong>
                      {session.fatigueAdaptation}
                    </div>
                  )}

                  {/* Feedback Form (If not completed and not Rest) */}
                  {!isCompleted && session.type !== "descanso" && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Zap className="w-4 h-4 text-neon" />
                        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Reportar sesión realizada</h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Feedback selector */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Sensación General:</label>
                          <select
                            value={selectedFeedback}
                            onChange={(e) => setSelectedFeedback(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-neon font-semibold cursor-pointer"
                          >
                            <option value="perfecto">Excelente / Perfecto</option>
                            <option value="adecuado">Adecuado / Bien</option>
                            <option value="muy_duro">Muy duro / Agotador</option>
                            <option value="facil">Demasiado fácil</option>
                            <option value="incompleto">Incompleto / Abandono</option>
                          </select>
                        </div>

                        {/* RPE Selector */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Percepción de Esfuerzo (RPE 1-10):</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={selectedRpe}
                              onChange={(e) => setSelectedRpe(Number(e.target.value))}
                              className="w-full accent-neon bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="font-mono font-black text-sm text-neon bg-black/40 px-2 py-0.5 rounded-md shrink-0 border border-white/5">
                              {selectedRpe}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            onLogWorkoutCompletion(session.id, selectedFeedback, selectedRpe);
                            setExpandedSessionId(null);
                          }}
                          className="px-4 py-2 bg-neon text-darkbg hover:opacity-90 font-black text-[10px] uppercase tracking-widest rounded-lg transition cursor-pointer"
                        >
                          Guardar Feedback & Marcar Completado
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If completed, show logged data */}
                  {isCompleted && loggedFeedback && (
                    <div className="p-3 bg-neon/10 rounded-xl border border-neon/20 flex items-center justify-between text-xs text-white/80 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-neon" />
                        <span>
                          Reportado como <strong className="text-white capitalize">{loggedFeedback.feedback.replace("_", " ")}</strong> con RPE de <strong className="text-neon">{loggedFeedback.rpe}/10</strong>.
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40">
                        {new Date(loggedFeedback.date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
