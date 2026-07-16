import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  RunningObjective, 
  ExperienceLevel, 
  FrequencyOption, 
  OnboardingData 
} from "../types";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Target, 
  Settings, 
  ShieldAlert, 
  Flame, 
  Heart,
  Activity
} from "lucide-react";

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onCancel: () => void;
}

export default function Onboarding({ onComplete, onCancel }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  
  // State for onboarding data
  const [age, setAge] = useState<number>(30);
  const [sex, setSex] = useState<"M" | "F" | "Otro">("M");
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [objective, setObjective] = useState<RunningObjective>(RunningObjective.PRIMER_10K);
  
  // Specific inputs
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(ExperienceLevel.INTERMEDIO_2K);
  const [time10K, setTime10K] = useState<string>("50:00");
  const [time21K, setTime21K] = useState<string>("01:55:00");
  const [vamTestDistance, setVamTestDistance] = useState<string>("");
  const [maxDistanceCurrent, setMaxDistanceCurrent] = useState<"less_5" | "5_10" | "10_15" | "more_15">("5_10");
  const [resistanceTarget, setResistanceTarget] = useState<"run_10k" | "run_15k" | "run_21k" | "general">("run_10k");
  
  // Frequency & Injuries
  const [frequency, setFrequency] = useState<FrequencyOption>(FrequencyOption.FREQ_3_2);
  const [activeInjury, setActiveInjury] = useState<boolean>(false);
  const [injuryAreas, setInjuryAreas] = useState<string[]>([]);
  const [injuryNotes, setInjuryNotes] = useState<string>("");

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Assemble and trigger complete
      const data: OnboardingData = {
        age,
        sex,
        height,
        weight,
        objective,
        frequency,
        activeInjury,
        injuryAreas,
        injuryNotes: injuryNotes || undefined,
        vamTestDistance: vamTestDistance ? Number(vamTestDistance) : undefined,
        completedAt: new Date().toISOString()
      };

      // Add objective specific options
      if (objective === RunningObjective.PRIMER_10K) {
        data.experienceLevel = experienceLevel;
      } else if (objective === RunningObjective.MEJORAR_10K) {
        data.time10K = time10K;
      } else if (objective === RunningObjective.PRIMER_21K) {
        data.time10K = time10K; // user might enter 10k to estimate
      } else if (objective === RunningObjective.MEJORAR_21K) {
        data.time21K = time21K;
        data.time10K = time10K;
      } else if (objective === RunningObjective.MEJORAR_RITMO) {
        data.time10K = time10K;
      } else if (objective === RunningObjective.MEJORAR_RESISTENCIA) {
        data.maxDistanceCurrent = maxDistanceCurrent;
        data.resistanceTarget = resistanceTarget;
      }

      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const toggleInjuryArea = (area: string) => {
    if (injuryAreas.includes(area)) {
      setInjuryAreas(prev => prev.filter(a => a !== area));
    } else {
      setInjuryAreas(prev => [...prev, area]);
    }
  };

  const renderObjectiveCard = (objVal: RunningObjective, title: string, desc: string, icon: React.ReactNode) => {
    const isSelected = objective === objVal;
    return (
      <div
        onClick={() => setObjective(objVal)}
        className={`p-4 rounded-xl border text-left cursor-pointer transition flex items-start gap-4 ${
          isSelected 
            ? "bg-neon/10 border-neon text-neon shadow-lg shadow-neon/5" 
            : "bg-white/5 border-white/10 hover:border-white/20 text-slate-300"
        }`}
      >
        <div className={`p-2 rounded-lg ${isSelected ? "bg-neon/20 text-neon" : "bg-white/5 text-slate-400"}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-black uppercase tracking-wider text-white mb-1 text-sm sm:text-base">{title}</h4>
          <p className="text-xs text-white/60 font-semibold">{desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl w-full mx-auto glass rounded-2xl p-6 sm:p-10 text-slate-200 shadow-2xl relative overflow-hidden my-6">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neon/10 rounded-lg text-neon">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-white">Configurar Plan Adaptativo</h2>
            <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Paso {step} de 4</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                s === step ? "bg-neon w-10" : s < step ? "bg-neon/40" : "bg-white/10"
              }`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-neon" />
                1. Perfil Fisiológico
              </h3>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                Estos datos se utilizan para el cálculo del IMC, la probabilidad de éxito de tus objetivos y los rangos metabólicos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Edad */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Edad (Años)</label>
                <input 
                  type="number"
                  min="12"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-bold"
                />
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Sexo Biológico</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["M", "F", "Otro"] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`py-3 text-center rounded-lg border font-black uppercase tracking-wider text-xs transition cursor-pointer ${
                        sex === s 
                          ? "bg-neon/10 border-neon text-neon" 
                          : "bg-white/5 border-white/10 hover:border-white/20 text-slate-400"
                      }`}
                    >
                      {s === "M" ? "Masc" : s === "F" ? "Fem" : "Otro"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Altura */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Altura (cm)</label>
                <input 
                  type="number"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-bold"
                />
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Peso (kg)</label>
                <input 
                  type="number"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-bold"
                />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-white/60 leading-relaxed font-semibold">
              <strong>Nota sobre composición corporal:</strong> El sistema calculará tu IMC automáticamente para evaluar el nivel de impacto de tus zancadas. Corredores con IMC mayor a 26 recibirán un incremento de volumen semanal más conservador y mayor enfoque en fuerza preventiva.
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-neon" />
                2. Objetivo Principal
              </h3>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                Selecciona la meta de entrenamiento que deseas abordar hoy. Esto determinará la lógica y estructura de tu plan completo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
              {renderObjectiveCard(
                RunningObjective.PRIMER_10K,
                "Preparar mi primer 10K",
                "Ideal si empiezas de 0 o quieres correr 10 km continuos por primera vez.",
                <Flame className="w-5 h-5" />
              )}
              {renderObjectiveCard(
                RunningObjective.MEJORAR_10K,
                "Mejorar mi marca 10K",
                "Si ya completas un 10K y buscas bajar tus tiempos con series y tempo.",
                <User className="w-5 h-5" />
              )}
              {renderObjectiveCard(
                RunningObjective.PRIMER_21K,
                "Preparar mi primer 21K",
                "Tu primera media maratón. Enfoque en volumen, fondo y asimilación gradual.",
                <Heart className="w-5 h-5" />
              )}
              {renderObjectiveCard(
                RunningObjective.MEJORAR_21K,
                "Mejorar mi marca 21K",
                "Para bajar de tiempo en 21.1 km con series de umbral y tiradas exigentes.",
                <Settings className="w-5 h-5" />
              )}
              {renderObjectiveCard(
                RunningObjective.MEJORAR_RITMO,
                "Mejorar ritmo de carrera",
                "Si quieres correr más rápido en distancias cortas e intermedias de forma general.",
                <Flame className="w-5 h-5" />
              )}
              {renderObjectiveCard(
                RunningObjective.MEJORAR_RESISTENCIA,
                "Mejorar resistencia general",
                "Si quieres aguantar más tiempo corriendo o acumular más base aeróbica.",
                <Activity className="w-5 h-5" />
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-neon" />
                3. Datos de Rendimiento
              </h3>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                Ajustemos las métricas específicas para tu objetivo: <strong className="text-neon uppercase text-xs">{objective.replace("_", " ")}</strong>.
              </p>
            </div>

            <div className="space-y-5">
              {/* PRIMER 10K Specific */}
              {objective === RunningObjective.PRIMER_10K && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-white/70 block">¿Cuál es tu nivel actual?</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { val: ExperienceLevel.PRINCIPIANTE_ZERO, label: "Principiante: Empiezo de 0 / Correr y caminar" },
                      { val: ExperienceLevel.INTERMEDIO_2K, label: "Intermedio: Puedo correr 2 km seguidos sin parar" },
                      { val: ExperienceLevel.AVANZADO_5K, label: "Avanzado: Puedo correr 5 km seguidos sin parar" }
                    ].map(x => (
                      <button
                        key={x.val}
                        type="button"
                        onClick={() => setExperienceLevel(x.val)}
                        className={`px-4 py-3.5 rounded-lg border text-left text-xs uppercase tracking-wider font-black transition cursor-pointer flex justify-between items-center ${
                          experienceLevel === x.val
                            ? "bg-neon/10 border-neon text-neon"
                            : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        {x.label}
                        {experienceLevel === x.val && <Check className="w-4 h-4 text-neon" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MEJORAR 10K OR PRIMER 21K OR MEJORAR RITMO Specific: Time in 10K */}
              {(objective === RunningObjective.MEJORAR_10K || objective === RunningObjective.PRIMER_21K || objective === RunningObjective.MEJORAR_RITMO) && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Tiempo actual en 10K (Formato mm:ss o hh:mm:ss)</label>
                  <input
                    type="text"
                    value={time10K}
                    onChange={(e) => setTime10K(e.target.value)}
                    placeholder="e.g. 52:45"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-mono font-bold"
                  />
                  <p className="text-[11px] text-white/40 font-semibold leading-relaxed">
                    Esto se usará para derivar tu velocidad actual promedio y estructurar tus ritmos de entrenamiento de series, tempo y tiradas largas.
                  </p>
                </div>
              )}

              {/* MEJORAR 21K Specific */}
              {objective === RunningObjective.MEJORAR_21K && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Tiempo actual en 21K (hh:mm:ss)</label>
                    <input
                      type="text"
                      value={time21K}
                      onChange={(e) => setTime21K(e.target.value)}
                      placeholder="e.g. 01:54:30"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Tiempo actual en 10K (mm:ss)</label>
                    <input
                      type="text"
                      value={time10K}
                      onChange={(e) => setTime10K(e.target.value)}
                      placeholder="e.g. 50:15"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* MEJORAR RESISTENCIA Specific */}
              {objective === RunningObjective.MEJORAR_RESISTENCIA && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/70 block">¿Cuál es tu distancia máxima actual corriendo?</label>
                    <select
                      value={maxDistanceCurrent}
                      onChange={(e) => setMaxDistanceCurrent(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition cursor-pointer font-bold"
                    >
                      <option value="less_5" className="bg-darkbg">Menos de 5 km seguidos</option>
                      <option value="5_10" className="bg-darkbg">De 5 a 10 km seguidos</option>
                      <option value="10_15" className="bg-darkbg">De 10 a 15 km seguidos</option>
                      <option value="more_15" className="bg-darkbg">Más de 15 km seguidos</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/70 block">¿Qué objetivo de resistencia tienes?</label>
                    <select
                      value={resistanceTarget}
                      onChange={(e) => setResistanceTarget(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition cursor-pointer font-bold"
                    >
                      <option value="run_10k" className="bg-darkbg">Correr 10 km de forma continua</option>
                      <option value="run_15k" className="bg-darkbg">Correr 15 km de forma continua</option>
                      <option value="run_21k" className="bg-darkbg">Correr 21 km (Media maratón) por primera vez</option>
                      <option value="general" className="bg-darkbg">Mejorar resistencia cardiovascular general</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Opcional: VAM Test */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/70 block flex items-center justify-between gap-2">
                  <span>Test de VAM (Velocidad Aeróbica Máxima) - Opcional</span>
                  <span className="text-[9px] bg-neon/10 text-neon px-2 py-0.5 rounded-full font-black">Recomendado</span>
                </label>
                <input
                  type="number"
                  value={vamTestDistance}
                  onChange={(e) => setVamTestDistance(e.target.value)}
                  placeholder="Metros recorridos en 5 minutos (e.g. 1150)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition font-bold"
                />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Si has hecho un test de 5 minutos al máximo, introduce la distancia en metros. La app calculará tus zonas con precisión científica de laboratorio (Regla del manual).
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-neon" />
                4. Disponibilidad y Lesiones
              </h3>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                Ajustemos la frecuencia semanal de running e historial de molestias para evitar lesiones en tu plan.
              </p>
            </div>

            <div className="space-y-5">
              {/* Frecuencia Semanal */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/70 block">Frecuencia Semanal de Running (+ Fuerza)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: FrequencyOption.FREQ_2_2, label: "2 + 2", desc: "2 carrera + 2 fuerza" },
                    { val: FrequencyOption.FREQ_3_2, label: "3 + 2", desc: "3 carrera + 2 fuerza" },
                    { val: FrequencyOption.FREQ_4_2, label: "4 + 2", desc: "4 carrera + 2 fuerza" },
                    { val: FrequencyOption.FREQ_5_2, label: "5 + 2", desc: "5 carrera + 2 fuerza" }
                  ].map(f => (
                    <button
                      key={f.val}
                      type="button"
                      onClick={() => setFrequency(f.val)}
                      className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer transition ${
                        frequency === f.val
                          ? "bg-neon/10 border-neon text-neon"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="font-black text-base text-white">{f.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{f.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed font-semibold">
                  Todas las opciones incluyen por defecto 2 días de fuerza para potenciar tu economía de carrera y proteger tus articulaciones.
                </p>
              </div>

              {/* Lesión Activa */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">¿Tienes alguna lesión o dolor muscular/articular activo?</h4>
                    <p className="text-[11px] text-white/40 font-semibold leading-normal">Permite modular la intensidad de carga al inicio del plan.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInjury(!activeInjury);
                      if (activeInjury) setInjuryAreas([]);
                    }}
                    className={`px-4 py-2 rounded-lg border font-black uppercase tracking-widest text-[10px] cursor-pointer transition ${
                      activeInjury 
                        ? "bg-rose-500/20 border-rose-500 text-rose-400"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {activeInjury ? "SÍ, TENGO" : "NO, SANO"}
                  </button>
                </div>

                {activeInjury && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-3 border-t border-white/10"
                  >
                    <label className="text-xs font-black uppercase tracking-widest text-white/50 block">Selecciona las zonas sensibles o de molestias:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "rodilla", "tobillo", "cadera", "gemelos", "sóleo", "aquiles", "fascia_plantar", "espalda", "isquios"
                      ].map(area => {
                        const isSel = injuryAreas.includes(area);
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleInjuryArea(area)}
                            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border cursor-pointer transition ${
                              isSel 
                                ? "bg-rose-500/30 border-rose-500 text-rose-400"
                                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                            }`}
                          >
                            {area.replace("_", " ")}
                          </button>
                        );
                      })}
                    </div>

                    <textarea
                      placeholder="Describe brevemente tus molestias actuales..."
                      value={injuryNotes}
                      onChange={(e) => setInjuryNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition h-16 resize-none font-semibold"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
        <button
          onClick={handleBack}
          className="px-5 py-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition text-xs font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-lg bg-neon hover:bg-neon-dark text-black font-black uppercase tracking-widest text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-neon/10"
        >
          {step === 4 ? "Generar Plan" : "Continuar"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
