import React, { useState } from "react";
import { motion } from "motion/react";
import { OnboardingData, RunningObjective, TrainingPlan } from "../types";
import {
  User,
  Scale,
  Ruler,
  Activity,
  Award,
  Check,
  Undo,
  Calendar,
  Sparkles,
  TrendingUp,
  Info
} from "lucide-react";
import { calculateBMI } from "../engines";

interface ProfileViewProps {
  onboarding: OnboardingData;
  plan: TrainingPlan;
  onUpdateProfile: (updated: OnboardingData) => void;
}

export default function ProfileView({ onboarding, plan, onUpdateProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [age, setAge] = useState<string>(String(onboarding.age ?? ""));
  const [height, setHeight] = useState<string>(String(onboarding.height ?? ""));
  const [weight, setWeight] = useState<string>(String(onboarding.weight ?? ""));
  const [sex, setSex] = useState<"M" | "F">(onboarding.sex === "F" ? "F" : "M");

  const [saveSuccess, setSaveSuccess] = useState(false);

  const cleanNumericInput = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    return onlyDigits.replace(/^0+(?=\d)/, "");
  };

  const getSafeNumber = (value: string, fallback: number) => {
    if (value.trim() === "") return fallback;
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const parsedAge = getSafeNumber(age, onboarding.age || 30);
  const parsedHeight = getSafeNumber(height, onboarding.height || 175);
  const parsedWeight = getSafeNumber(weight, onboarding.weight || 70);

  const handleSave = () => {
    const updated: OnboardingData = {
      ...onboarding,
      age: parsedAge,
      height: parsedHeight,
      weight: parsedWeight,
      sex
    };

    onUpdateProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setAge(String(onboarding.age ?? ""));
    setHeight(String(onboarding.height ?? ""));
    setWeight(String(onboarding.weight ?? ""));
    setSex(onboarding.sex === "F" ? "F" : "M");
    setIsEditing(false);
  };

  const bmiData = calculateBMI(parsedWeight, parsedHeight);

  const getObjectiveLabel = (obj: RunningObjective) => {
    switch (obj) {
      case RunningObjective.PRIMER_10K:
        return "Mi Primer 10K";
      case RunningObjective.MEJORAR_10K:
        return "Mejorar marca de 10K";
      case RunningObjective.PRIMER_21K:
        return "Mi Primer Medio Maratón (21K)";
      case RunningObjective.MEJORAR_21K:
        return "Mejorar marca de 21K";
      case RunningObjective.MEJORAR_RITMO:
        return "Mejorar Ritmo / Velocidad";
      case RunningObjective.MEJORAR_RESISTENCIA:
        return "Mejorar Resistencia General";
      default:
        return obj;
    }
  };

  const estimatedPaces = plan.initialDiagnostic.estimatedPaces;

  const predictorItems = [
    { label: "Distancia 5K", value: estimatedPaces["5K"] || "24:30" },
    { label: "Distancia 10K", value: estimatedPaces["10K"] || "51:00" },
    { label: "Media Maratón (21.1K)", value: estimatedPaces["21K"] || "01:54:30" },
    { label: "Maratón Completa (42.2K)", value: estimatedPaces["42K"] || "04:05:00" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white flex items-center gap-3">
          <User className="w-6 h-6 text-neon" />
          Mi Perfil Fisiológico
        </h3>
        <p className="text-sm text-white/50 font-semibold mt-2">
          Gestiona tus datos personales, métricas de rendimiento y marcas estimadas.
        </p>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neon/10 border border-neon/20 text-neon rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          ¡Perfil actualizado con éxito! Los ritmos de entrenamiento se han recalculado.
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-neon" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">
                  Estado físico
                </h4>
              </div>
              <p className="text-xs text-white/40 font-semibold">
                Métricas principales
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white/10 hover:text-neon transition cursor-pointer"
              >
                Editar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
                >
                  <Undo className="w-3 h-3" />
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-neon text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neon-dark transition cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-neon" />
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                  Edad
                </p>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(cleanNumericInput(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon font-bold"
                />
              ) : (
                <p className="text-xl font-black text-white">{parsedAge} Años</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-4 h-4 text-neon" />
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                  Altura
                </p>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={height}
                  onChange={(e) => setHeight(cleanNumericInput(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon font-bold"
                />
              ) : (
                <p className="text-xl font-black text-white">{parsedHeight} cm</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-neon" />
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                  Peso
                </p>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={weight}
                  onChange={(e) => setWeight(cleanNumericInput(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon font-bold"
                />
              ) : (
                <p className="text-xl font-black text-white">{parsedWeight} kg</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-neon" />
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                  Sexo Biológico
                </p>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  {(["M", "F"] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`py-2 text-center rounded-lg border font-black uppercase tracking-wider text-[10px] transition cursor-pointer ${
                        sex === s
                          ? "bg-neon/10 border-neon text-neon"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-slate-400"
                      }`}
                    >
                      {s === "M" ? "Masc" : "Fem"}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xl font-black text-white">
                  {sex === "M" ? "Masculino" : "Femenino"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 bg-neon/10 border border-neon/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-neon" />
              <p className="text-xs font-black uppercase tracking-widest text-white">
                Composición Corporal Calculada
              </p>
            </div>
            <p className="text-lg font-black text-white">
              IMC: {bmiData.bmi} ({bmiData.category})
            </p>
            <p className="text-[11px] text-white/40 font-semibold mt-1">
              Fórmula Estándar
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-neon" />
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              Programa y Objetivo
            </h4>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
                Objetivo del plan
              </p>
              <p className="text-lg font-black text-white">
                {getObjectiveLabel(onboarding.objective)}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
                Frecuencia seleccionada
              </p>
              <p className="text-lg font-black text-white">
                {onboarding.frequency === "2_2" && "2 carrera + 2 fuerza"}
                {onboarding.frequency === "3_2" && "3 carrera + 2 fuerza"}
                {onboarding.frequency === "4_2" && "4 carrera + 2 fuerza"}
                {onboarding.frequency === "5_2" && "5 carrera + 2 fuerza"}
              </p>
            </div>

            {onboarding.activeInjury && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-1">
                  Lesión Activa Reportada
                </p>
                <p className="text-sm text-white/70 font-semibold">
                  Zonas con molestias: {onboarding.injuryAreas.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-neon" />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">
            Predictor de Marcas Estimadas
          </h4>
        </div>

        <p className="text-sm text-white/60 font-semibold leading-relaxed mb-5">
          Estimaciones calculadas mediante la fórmula de fatiga aeróbica de Riegel en base a tus datos de onboarding.
        </p>

        <div className="space-y-3">
          {predictorItems.map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
            >
              <span className="text-sm text-white/65 font-bold">
                {item.label}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-neon font-black text-sm font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-neon shrink-0 mt-0.5" />
          <p className="text-xs text-white/45 font-semibold leading-relaxed">
            Estas marcas asumen que completas el plan entrenando de forma consistente y asimilando las descargas.
          </p>
        </div>
      </div>
    </div>
  );
}
