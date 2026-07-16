import React from "react";
import { TrainingPlan, RunningObjective } from "../types";
import { 
  Activity, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  User, 
  Info, 
  Zap, 
  ShieldAlert,
  Flame,
  Calendar,
  Layers
} from "lucide-react";

interface DashboardProps {
  plan: TrainingPlan;
  activeInjury: boolean;
  injuryAreas: string[];
}

export default function Dashboard({ plan, activeInjury, injuryAreas }: DashboardProps) {
  const { initialDiagnostic, zones } = plan;

  // Render a progress bar for BMI
  const renderBMIWidget = (bmi: number, category: string) => {
    // Normal range is 18.5 - 24.9. Min display 15, Max display 35
    const pct = Math.max(0, Math.min(100, ((bmi - 15) / (35 - 15)) * 100));
    
    let barColor = "neon-bg";
    if (category === "Sobrepeso") barColor = "bg-amber-500";
    if (category === "Obesidad" || category === "Bajo peso") barColor = "bg-rose-500";

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
        <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-neon" />
          Composición Corporal (IMC)
        </h4>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-white">{bmi}</span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
            category === "Normal" 
              ? "bg-neon/10 text-neon" 
              : category === "Sobrepeso" 
                ? "bg-amber-500/10 text-amber-400" 
                : "bg-rose-500/10 text-rose-400"
          }`}>
            {category}
          </span>
        </div>
        <p className="text-xs text-white/40 mb-4 font-semibold">Calculado en base a tu altura y peso corporal.</p>
        
        {/* Visual Line Slider */}
        <div className="relative w-full h-2 bg-white/10 rounded-full mb-2">
          {/* Ranges markers */}
          <div className="absolute left-[17.5%] top-0 bottom-0 w-0.5 bg-white/20" /> {/* 18.5 marker */}
          <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-white/20" /> {/* 25 marker */}
          <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-white/20" /> {/* 30 marker */}
          
          <div 
            className={`absolute top-0 bottom-0 rounded-full ${barColor}`} 
            style={{ width: `${pct}%` }} 
          />
        </div>
        <div className="flex justify-between text-[9px] font-bold uppercase text-white/30 tracking-wider">
          <span>Delgado</span>
          <span>Normal (18.5)</span>
          <span>Sobrepeso (25)</span>
          <span>Obeso (30)</span>
        </div>
      </div>
    );
  };

  // Success Probability Indicator
  const renderSuccessProbWidget = (prob: string) => {
    let colorClass = "text-neon bg-neon/10 border-neon/20";
    let scoreText = "Excelente balance de disponibilidad, peso y perfil preventivo.";

    if (prob === "Alta") {
      colorClass = "text-neon bg-neon/10 border-neon/20";
      scoreText = "Muy buen perfil. Mantén la consistencia para asimilar cargas.";
    } else if (prob === "Media") {
      colorClass = "text-amber-400 bg-amber-500/10 border-amber-500/20";
      scoreText = "Rendimiento condicionado por molestias reportadas o peso.";
    } else if (prob === "Baja") {
      colorClass = "text-rose-400 bg-rose-500/10 border-rose-500/20";
      scoreText = "Riesgo de lesión alto. Sigue estrictamente las alertas del Readiness.";
    }

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-neon" />
          Probabilidad de Éxito
        </h4>
        <div className="flex items-center gap-3 mb-2">
          <div className={`px-3 py-1.5 rounded-xl border text-lg font-black uppercase tracking-wider ${colorClass}`}>
            {prob}
          </div>
          <p className="text-xs text-white/80 font-semibold leading-relaxed">
            {scoreText}
          </p>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed border-t border-white/10 pt-2.5 mt-2">
          *Estimación del <span className="text-white/50">AI Decision Engine</span> basado en el balance de carga biomecánica y descansos.
        </div>
      </div>
    );
  };

  // Human Objective Friendly Title
  const getObjectiveFriendlyName = (obj: RunningObjective) => {
    switch (obj) {
      case RunningObjective.PRIMER_10K: return "Mi Primer 10K";
      case RunningObjective.MEJORAR_10K: return "Mejorar Marca de 10K";
      case RunningObjective.PRIMER_21K: return "Mi Primer 21K (Media Maratón)";
      case RunningObjective.MEJORAR_21K: return "Mejorar Marca de 21K";
      case RunningObjective.MEJORAR_RITMO: return "Aumento de Ritmo & Velocidad";
      case RunningObjective.MEJORAR_RESISTENCIA: return "Acondicionamiento y Resistencia";
      default: return "Plan de Running Adaptativo";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-neon/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-neon/10 text-neon text-[9px] font-black uppercase tracking-widest">
            Plan Generado por Master Brain
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {getObjectiveFriendlyName(plan.objective)}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-semibold max-w-xl">
            Este panel reúne tu diagnóstico de rendimiento inicial y zonas de ritmo metabólico calculadas. 
            El plan adaptará cada día tus entrenamientos en base a tu fatiga.
          </p>
        </div>
        <div className="flex gap-4 border-l border-white/10 pl-6 h-full py-2">
          <div className="text-left">
            <span className="text-white/40 text-[9px] block uppercase font-black tracking-widest">Duración</span>
            <span className="text-2xl font-black text-neon">{plan.durationWeeks} <span className="text-xs text-white/40">Semanas</span></span>
          </div>
          <div className="text-left">
            <span className="text-white/40 text-[9px] block uppercase font-black tracking-widest">Frecuencia</span>
            <span className="text-2xl font-black text-white">{plan.frequency === "2_2" ? "2+2" : plan.frequency === "3_2" ? "3+2" : plan.frequency === "4_2" ? "4+2" : "5+2"}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Diagnóstico Column 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/10">
            <Activity className="w-4 h-4 text-neon" />
            Diagnóstico del Corredor
          </h3>
          
          <div className="space-y-1.5">
            <span className="text-white/40 text-[9px] block uppercase font-black tracking-widest">Nivel Estimado</span>
            <span className="text-lg font-black text-white">{initialDiagnostic.levelEstimated}</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-white/40 text-[9px] block uppercase font-black tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              Limitante Principal
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg w-fit block">
              {initialDiagnostic.mainLimitant}
            </span>
            <p className="text-xs text-white/60 font-semibold leading-relaxed pt-1">
              El plan priorizará el estímulo que solucione esta limitación para evitar estancamientos.
            </p>
          </div>

          {activeInjury && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block">Molestia Activa</span>
              <span className="text-xs font-black text-slate-200 capitalize tracking-wider">
                Zonas: {injuryAreas.join(", ")}
              </span>
              <p className="text-[10px] text-white/50 font-semibold pt-1 leading-relaxed">
                El motor bloqueará entrenamientos pesados en estas zonas si se reporta dolor agudo hoy.
              </p>
            </div>
          )}
        </div>

        {/* BMI & Success Column 2 */}
        <div className="space-y-6">
          {renderBMIWidget(initialDiagnostic.bmi, initialDiagnostic.bmiCategory)}
          {renderSuccessProbWidget(initialDiagnostic.successProbability)}
        </div>

        {/* Predictor of Marks Column 3 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/10">
            <TrendingUp className="w-4 h-4 text-neon" />
            Predictor de Marcas Estimadas
          </h3>
          <p className="text-xs text-white/60 font-semibold leading-relaxed mb-2">
            Estimaciones calculadas mediante la fórmula de fatiga aeróbica de Riegel en base a tus datos de onboarding:
          </p>

          <div className="space-y-3">
            {[
              { label: "Distancia 5K", value: initialDiagnostic.estimatedPaces["5K"] || "24:30" },
              { label: "Distancia 10K", value: initialDiagnostic.estimatedPaces["10K"] || "51:00" },
              { label: "Media Maratón (21.1K)", value: initialDiagnostic.estimatedPaces["21K"] || "01:54:30" },
              { label: "Maratón Completa (42.2K)", value: initialDiagnostic.estimatedPaces["42K"] || "04:05:00" },
            ].map(x => (
              <div key={x.label} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0">
                <span className="text-xs text-white/60 font-semibold">{x.label}</span>
                <span className="text-xs font-mono font-black text-neon bg-white/5 px-2.5 py-0.5 rounded-md">{x.value}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-2 text-[10px] text-white/40 leading-relaxed font-semibold font-semibold">
            <Info className="w-4 h-4 text-neon shrink-0 mt-0.5" />
            <span>Estas marcas asumen que completas el plan entrenando de forma consistente y asimilando las descargas.</span>
          </div>
        </div>
      </div>

      {/* Training Paces / Metabolic Zones */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-neon animate-pulse" />
              Zonas de Ritmo Calculadas
            </h3>
            <p className="text-xs text-white/60 font-semibold">
              Cálculos fisiológicos automáticos basados en tu ritmo actual de carrera de: <strong className="text-white">{zones.paceActual}</strong>.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
            Pace de referencia: {zones.paceActual}
          </div>
        </div>

        {/* Zones Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {zones.regenerative && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block">Rodaje Regenerativo</span>
              <span className="text-lg font-mono font-black text-white">{zones.regenerative}</span>
              <p className="text-[10px] text-white/50 font-semibold leading-tight pt-1">Para asimilar carga y recuperación activa tras series fuertes.</p>
            </div>
          )}

          {zones.suave && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[9px] font-black text-neon uppercase tracking-widest block">Rodaje Suave (Z2)</span>
              <span className="text-lg font-mono font-black text-white">{zones.suave}</span>
              <p className="text-[10px] text-white/50 font-semibold leading-tight pt-1">Zona de base aeróbica principal. Ideal para tus tiradas largas.</p>
            </div>
          )}

          {zones.controlado && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block">Rodaje Controlado</span>
              <span className="text-lg font-mono font-black text-white">{zones.controlado}</span>
              <p className="text-[10px] text-white/50 font-semibold leading-tight pt-1">Ritmo de crucero alegre. Desarrolla resistencia muscular.</p>
            </div>
          )}

          {zones.tempo && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Tempo / Umbral</span>
              <span className="text-lg font-mono font-black text-white">{zones.tempo}</span>
              <p className="text-[10px] text-white/50 font-semibold leading-tight pt-1">Mejora el aclaramiento de lactato para correr rápido por más tiempo.</p>
            </div>
          )}

          {zones.seriesLargas && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">Series Largas (800-2000m)</span>
              <span className="text-lg font-mono font-black text-white">{zones.seriesLargas}</span>
              <p className="text-[10px] text-white/50 font-semibold leading-tight pt-1">Estímulo directo sobre tu consumo máximo de oxígeno (VO2Max).</p>
            </div>
          )}

          {zones.seriesCortas && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block">Series Cortas (200-400m)</span>
              <span className="text-lg font-mono font-black text-white">{zones.seriesCortas}</span>
              <p className="text-[10px] text-white/50 font-semibold leading-tight pt-1">Mejora reclutamiento rápido, velocidad pura y eficiencia de zancada.</p>
            </div>
          )}

          <div className="bg-neon/5 p-4 rounded-xl border border-neon/20 col-span-1 sm:col-span-2 space-y-2">
            <span className="text-[9px] font-black text-neon uppercase tracking-widest block">Glosario de Esfuerzos RPE</span>
            <div className="space-y-1.5 text-[11px] text-white/80 font-semibold">
              <p>🟢 <strong className="text-white">RPE 2-4:</strong> {zones.rpeDescription?.easy}</p>
              <p>🟡 <strong className="text-white">RPE 5-6:</strong> {zones.rpeDescription?.aerobic}</p>
              <p>🟠 <strong className="text-white">RPE 7-8:</strong> {zones.rpeDescription?.tempo}</p>
              <p>🔴 <strong className="text-white">RPE 9-10:</strong> {zones.rpeDescription?.series}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
