import React, { useState } from "react";
import { motion } from "motion/react";
import { OnboardingData, RunningObjective } from "../types";
import { 
  User, 
  Scale, 
  Ruler, 
  Activity, 
  Award, 
  Check, 
  Undo,
  Calendar,
  Sparkles
} from "lucide-react";
import { calculateBMI } from "../engines";

interface ProfileViewProps {
  onboarding: OnboardingData;
  onUpdateProfile: (updated: OnboardingData) => void;
}

export default function ProfileView({ onboarding, onUpdateProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [age, setAge] = useState<number>(onboarding.age);
  const [height, setHeight] = useState<number>(onboarding.height);
  const [weight, setWeight] = useState<number>(onboarding.weight);
  const [sex, setSex] = useState<"M" | "F" | "Otro">(onboarding.sex);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    const updated: OnboardingData = {
      ...onboarding,
      age,
      height,
      weight,
      sex
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const bmiData = calculateBMI(weight, height);

  // Translate running objective to human readable text
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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center justify-center sm:justify-start gap-2">
          <User className="w-5 h-5 text-neon" />
          Mi Perfil Fisiológico
        </h2>
        <p className="text-xs text-white/50 uppercase font-bold tracking-wider mt-1">
          Gestiona tus datos personales y métricas de rendimiento.
        </p>
      </div>

      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-neon/15 border border-neon/30 text-neon rounded-xl text-xs font-bold text-center uppercase tracking-widest"
        >
          ¡Perfil actualizado con éxito! Los ritmos de entrenamiento se han recalculado.
        </motion.div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <Activity className="w-5 h-5 text-neon" />
            </div>
            <div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estado físico</span>
              <p className="text-sm font-black text-white uppercase tracking-wider">Métricas principales</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white/10 hover:text-neon transition cursor-pointer"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAge(onboarding.age);
                  setHeight(onboarding.height);
                  setWeight(onboarding.weight);
                  setSex(onboarding.sex);
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider hover:text-rose-400 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-neon text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neon/90 transition shadow-lg shadow-neon/15 cursor-pointer"
              >
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Form Inputs / Info Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Edad */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" /> Edad
              </span>
            </div>
            {isEditing ? (
              <input
                type="number"
                min="12"
                max="99"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon font-bold"
              />
            ) : (
              <p className="text-xl font-black text-white">{age} <span className="text-xs text-white/40 font-bold uppercase">Años</span></p>
            )}
          </div>

          {/* Altura */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-white/40" /> Altura
              </span>
            </div>
            {isEditing ? (
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon font-bold"
              />
            ) : (
              <p className="text-xl font-black text-white">{height} <span className="text-xs text-white/40 font-bold uppercase">cm</span></p>
            )}
          </div>

          {/* Peso */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-white/40" /> Peso
              </span>
            </div>
            {isEditing ? (
              <input
                type="number"
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon font-bold"
              />
            ) : (
              <p className="text-xl font-black text-white">{weight} <span className="text-xs text-white/40 font-bold uppercase">kg</span></p>
            )}
          </div>

          {/* Sexo Biológico */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-white/40" /> Sexo Biológico
              </span>
            </div>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-1">
                {(["M", "F", "Otro"] as const).map(s => (
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
                    {s === "M" ? "Masc" : s === "F" ? "Fem" : "Otro"}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xl font-black text-white">
                {sex === "M" ? "Masculino" : sex === "F" ? "Femenino" : "Otro"}
              </p>
            )}
          </div>
        </div>

        {/* Calculated Composition Info */}
        <div className="pt-4 border-t border-white/5">
          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Composición Corporal Calculada</span>
              <p className="text-sm font-black text-white/90">IMC: {bmiData.bmi} <span className="text-xs font-bold text-white/50">({bmiData.category})</span></p>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase text-white/60 tracking-wider">
              Fórmula Estándar
            </div>
          </div>
        </div>
      </div>

      {/* Plan and Goal information */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 pb-2.5 border-b border-white/10">
          <Award className="w-4 h-4 text-neon" />
          Programa y Objetivo
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-white/40 font-bold uppercase tracking-wider text-[9px]">Objetivo del plan:</span>
            <span className="text-neon font-black uppercase tracking-wide">{getObjectiveLabel(onboarding.objective)}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-white/40 font-bold uppercase tracking-wider text-[9px]">Frecuencia seleccionada:</span>
            <span className="text-white font-semibold uppercase tracking-wide">
              {onboarding.frequency === "2_2" && "2 carrera + 2 fuerza"}
              {onboarding.frequency === "3_2" && "3 carrera + 2 fuerza"}
              {onboarding.frequency === "4_2" && "4 carrera + 2 fuerza"}
              {onboarding.frequency === "5_2" && "5 carrera + 2 fuerza"}
            </span>
          </div>

          {onboarding.activeInjury && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl space-y-1 mt-2">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px]">
                <Sparkles className="w-3.5 h-3.5" /> Lesión Activa Reportada
              </div>
              <p className="text-[11px] font-semibold leading-relaxed">
                Zonas con molestias: {onboarding.injuryAreas.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
