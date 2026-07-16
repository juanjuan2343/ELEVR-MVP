import React from "react";
import { TrainingPlan, RunningObjective } from "../types";
import {
  Activity,
  TrendingUp,
  Award,
  ShieldCheck,
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

  const renderBMIWidget = (bmi: number, category: string) => {
    const pct = Math.max(0, Math.min(100, ((bmi - 15) / (35 - 15)) * 100));

    let barColor = "neon-bg";
    if (category === "Sobrepeso") barColor = "bg-amber-500";
    if (category === "Obesidad" || category === "Bajo peso") barColor = "bg-rose-500";

    return (
      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-neon" />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">
            Composición Corporal (IMC)
          </h4>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div className="text-4xl font-black text-white">{bmi}</div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/70">
            {category}
          </div>
        </div>

        <p className="text-xs text-white/50 font-semibold mb-4">
          Calculado en base a tu altura y peso corporal.
        </p>

        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3 text-[9px] text-white/35 font-black uppercase tracking-wider">
          <span>Delgado</span>
          <span>Normal</span>
          <span>Sobrepeso</span>
          <span>Obeso</span>
        </div>
      </div>
    );
  };

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
      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-neon" />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">
            Probabilidad de Éxito
          </h4>
        </div>

        <div className={`inline-flex px-4 py-2 rounded-xl border text-sm font-black uppercase tracking-widest mb-4 ${colorClass}`}>
          {prob}
        </div>

        <p className="text-sm text-white/70 font-semibold leading-relaxed">
          {scoreText}
        </p>

        <p className="text-[11px] text-white/35 font-semibold mt-4 leading-relaxed">
          *Estimación del AI Decision Engine basado en el balance de carga biomecánica y descansos.
        </p>
      </div>
    );
  };

  const getObjectiveFriendlyName = (obj: RunningObjective) => {
    switch (obj) {
      case RunningObjective.PRIMER_10K:
        return "Mi Primer 10K";
      case RunningObjective.MEJORAR_10K:
        return "Mejorar Marca de 10K";
      case RunningObjective.PRIMER_21K:
        return "Mi Primer 21K (Media Maratón)";
      case RunningObjective.MEJORAR_21K:
        return "Mejorar Marca de 21K";
      case RunningObjective.MEJORAR_RITMO:
        return "Aumento de Ritmo & Velocidad";
      case RunningObjective.MEJORAR_RESISTENCIA:
        return "Acondicionamiento y Resistencia";
      default:
        return "Plan de Running Adaptativo";
    }
  };

  const getFrequencyLabel = () => {
    if (plan.frequency === "2_2") return "2+2";
    if (plan.frequency === "3_2") return "3+2";
    if (plan.frequency === "4_2") return "4+2";
    return "5+2";
  };

  const zoneItems = [
    {
      label: "Rodaje Regenerativo",
      value: zones.regenerative,
      desc: "Para asimilar carga y recuperación activa tras series fuertes."
    },
    {
      label: "Rodaje Suave (Z2)",
      value: zones.suave,
      desc: "Zona de base aeróbica principal. Ideal para tus tiradas largas."
    },
    {
      label: "Rodaje Controlado",
      value: zones.controlado,
      desc: "Ritmo de crucero alegre. Desarrolla resistencia muscular."
    },
    {
      label: "Tempo / Umbral",
      value: zones.tempo,
      desc: "Mejora el aclaramiento de lactato para correr rápido por más tiempo."
    },
    {
      label: "Series Largas (800-2000m)",
      value: zones.seriesLargas,
      desc: "Estímulo directo sobre tu consumo máximo de oxígeno (VO2Max)."
    },
    {
      label: "Series Cortas (200-400m)",
      value: zones.seriesCortas,
      desc: "Mejora reclutamiento rápido, velocidad pura y eficiencia de zancada."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-neon text-xs font-black uppercase tracking-widest mb-3">
              <Zap className="w-4 h-4" />
              Plan Generado por Master Brain
            </div>

            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              {getObjectiveFriendlyName(plan.objective)}
            </h3>

            <p className="text-sm text-white/55 font-semibold max-w-2xl mt-3 leading-relaxed">
              Este panel reúne tu diagnóstico de rendimiento inicial y zonas de ritmo metabólico calculadas. El plan adaptará cada día tus entrenamientos en base a tu fatiga.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[220px]">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Calendar className="w-4 h-4 text-neon mb-2" />
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Duración</p>
              <p className="text-lg font-black text-white">{plan.durationWeeks} Semanas</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Layers className="w-4 h-4 text-neon mb-2" />
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Frecuencia</p>
              <p className="text-lg font-black text-white">{getFrequencyLabel()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-5 border border-white/10 lg:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-neon" />
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              Diagnóstico del Corredor
            </h4>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
                Nivel Estimado
              </p>
              <p className="text-xl font-black text-white">
                {initialDiagnostic.levelEstimated}
              </p>
            </div>

            <div className="bg-neon/10 border border-neon/20 rounded-xl p-4">
              <p className="text-[10px] text-neon font-black uppercase tracking-widest mb-1">
                Limitante Principal
              </p>
              <p className="text-xl font-black text-white">
                {initialDiagnostic.mainLimitant}
              </p>
              <p className="text-xs text-white/55 font-semibold mt-2 leading-relaxed">
                El plan priorizará el estímulo que solucione esta limitación para evitar estancamientos.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">
                Fortalezas
              </p>
              <ul className="space-y-1">
                {initialDiagnostic.strengths.map((item, idx) => (
                  <li key={idx} className="text-xs text-white/65 font-semibold flex gap-2">
                    <span className="text-neon">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">
                Puntos a Vigilar
              </p>
              <ul className="space-y-1">
                {initialDiagnostic.weaknesses.map((item, idx) => (
                  <li key={idx} className="text-xs text-white/65 font-semibold flex gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeInjury && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">
                    Molestia Activa
                  </p>
                </div>
                <p className="text-xs text-white/70 font-semibold">
                  Zonas: {injuryAreas.join(", ")}
                </p>
                <p className="text-xs text-white/45 font-semibold mt-2 leading-relaxed">
                  El motor bloqueará entrenamientos pesados en estas zonas si se reporta dolor agudo hoy.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderBMIWidget(initialDiagnostic.bmi, initialDiagnostic.bmiCategory)}
            {renderSuccessProbWidget(initialDiagnostic.successProbability)}
          </div>

          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-neon" />
              <h4 className="text-xs font-black uppercase tracking-widest text-white">
                Zonas de Ritmo Calculadas
              </h4>
            </div>

            <p className="text-sm text-white/60 font-semibold leading-relaxed mb-5">
              Cálculos fisiológicos automáticos basados en tu ritmo actual de carrera de{" "}
              <span className="text-neon font-black">{zones.paceActual}</span>.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
                Pace de referencia
              </p>
              <p className="text-2xl font-black text-neon">{zones.paceActual}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {zoneItems.filter(item => item.value).map(item => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs font-black uppercase tracking-widest text-white">
                      {item.label}
                    </p>
                    <span className="text-[11px] text-neon font-black whitespace-nowrap">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-xs text-white/45 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-neon" />
                <p className="text-xs font-black uppercase tracking-widest text-white">
                  Glosario de Esfuerzos RPE
                </p>
              </div>

              <div className="space-y-2 text-xs text-white/55 font-semibold leading-relaxed">
                <p>🟢 RPE 2-4: {zones.rpeDescription?.easy}</p>
                <p>🟡 RPE 5-6: {zones.rpeDescription?.aerobic}</p>
                <p>🟠 RPE 7-8: {zones.rpeDescription?.tempo}</p>
                <p>🔴 RPE 9-10: {zones.rpeDescription?.series}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-neon" />
              <h4 className="text-xs font-black uppercase tracking-widest text-white">
                Nota
              </h4>
            </div>
            <p className="text-xs text-white/45 font-semibold leading-relaxed">
              El predictor de marcas estimadas se ha movido a la pestaña Perfil para que el Diagnóstico quede más limpio y centrado en el análisis inicial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
