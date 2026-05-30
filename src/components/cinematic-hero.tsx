"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CloudRain,
  Eye,
  MapPinned,
  Radar,
  ShieldCheck,
  Zap,
} from "lucide-react";

type CinematicHeroProps = {
  onEnter: () => void;
};

const flow = ["Near Miss", "Anomaly", "Prediction", "Prevention"];
const auditFactors = [
  { label: "hard braking", value: 31, color: "from-red-500 to-rose-300" },
  { label: "rain intensity", value: 22, color: "from-cyan-500 to-sky-200" },
  { label: "poor lighting", value: 17, color: "from-violet-500 to-fuchsia-200" },
  { label: "road stress", value: 13, color: "from-amber-500 to-yellow-200" },
];
const forecast = [28, 38, 57, 74, 92, 81, 66, 48];
const expansionCities = [
  { name: "Delhi NCR", x: 48, y: 18 },
  { name: "Mumbai", x: 30, y: 58 },
  { name: "Pune", x: 37, y: 65 },
  { name: "Hyderabad", x: 56, y: 66 },
  { name: "Bengaluru", x: 51, y: 82 },
  { name: "Chennai", x: 66, y: 86 },
];

export function CinematicHero({ onEnter }: CinematicHeroProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#03060b] text-white">
      <section className="relative flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-10">
        <HeroAtmosphere />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.24em] text-cyan-100">
              <Radar className="size-3.5" />
              Predictive city intelligence online
            </div>
            <h1 className="max-w-5xl font-heading text-6xl font-semibold leading-[0.95] tracking-[-0.02em] text-white sm:text-7xl lg:text-8xl">
              RoadLens AI
            </h1>
            <div className="mt-7">
              <p className="font-heading text-3xl font-semibold text-cyan-100 sm:text-4xl">
                Predictive Road Intelligence
              </p>
              <p className="mt-3 max-w-xl font-mono text-sm uppercase tracking-[0.22em] text-slate-300">
                Detecting invisible road danger before accidents happen.
              </p>
            </div>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Built on collective braking memory, anomaly detection, explainable AI,
              and temporal risk forecasting for smart-city road safety teams.
            </p>
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onEnter}
              className="mt-9 inline-flex h-13 items-center gap-3 rounded-md border border-cyan-200/30 bg-cyan-200 px-5 font-heading text-base font-semibold text-slate-950 shadow-[0_0_40px_rgba(125,211,252,0.28)] transition hover:bg-white"
            >
              Enter Intelligence System
              <ArrowRight className="size-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative min-h-[520px] overflow-hidden rounded-lg border border-cyan-100/15 bg-slate-950/50 shadow-[0_0_90px_rgba(14,165,233,0.18)] backdrop-blur"
          >
            <div className="absolute inset-0 telemetry-grid opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(248,113,113,0.24),transparent_24%),radial-gradient(circle_at_65%_60%,rgba(56,189,248,0.22),transparent_28%)]" />
            <CityGridVisual />
          </motion.div>
        </div>
      </section>

      <InsightSection />
      <BrakingMemorySection />
      <ChaosForecastSection />
      <ExplainableAiSection />
      <ImpactAndExpansionSection />

      <section className="relative px-4 py-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200">
            Smart-city command layer ready
          </p>
          <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.02em] sm:text-6xl">
            Enter Intelligence System
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Move from narrative to live operational intelligence: map anomalies, risk
            windows, audit trails, and authority triage.
          </p>
          <button
            type="button"
            onClick={onEnter}
            className="mt-9 inline-flex h-13 items-center gap-3 rounded-md border border-cyan-200/30 bg-white px-5 font-heading text-base font-semibold text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.16)] transition hover:bg-cyan-100"
          >
            Enter Intelligence System
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>
    </main>
  );
}

function ImpactAndExpansionSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="rounded-lg border border-cyan-100/15 bg-slate-950/70 p-6 shadow-[0_0_60px_rgba(14,165,233,0.08)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200">
            Why it matters
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.01em] text-white sm:text-4xl">
            Road danger becomes behaviorally visible before it becomes statistically fatal.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            A 2-minute earlier intervention can prevent cascading collisions, emergency
            delays, and infrastructure stress escalation.
          </p>
          <p className="mt-6 border-t border-cyan-100/10 pt-5 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
            Philosophy: Roads should not require fatalities before being classified as dangerous.
          </p>
        </div>

        <div className="relative h-[360px] overflow-hidden rounded-lg border border-cyan-100/15 bg-slate-950/70 p-5">
          <div className="absolute inset-0 telemetry-grid opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_72%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_38%_30%,rgba(248,113,113,0.12),transparent_28%)]" />
          <div className="relative h-full rounded-lg border border-cyan-100/10 bg-black/20">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Subtle India urban corridor expansion network"
            >
              <path
                d="M50 15 C42 25 34 35 30 58 C38 64 47 70 51 82 C57 76 61 70 56 66 C62 72 67 78 66 86"
                fill="none"
                stroke="rgba(125, 211, 252, 0.18)"
                strokeWidth="0.7"
              />
              <path
                d="M48 18 L56 66 L66 86 M30 58 L37 65 L51 82 M56 66 L37 65"
                fill="none"
                stroke="rgba(248, 113, 113, 0.22)"
                strokeDasharray="2 3"
                strokeWidth="0.45"
              />
            </svg>
            {expansionCities.map((city, index) => (
              <div
                key={city.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <span
                  className="india-node block size-3 rounded-full border border-cyan-100/70 bg-cyan-200 shadow-[0_0_22px_rgba(125,211,252,0.55)]"
                  style={{ animationDelay: `${index * 0.28}s` }}
                />
                <span className="mt-2 block whitespace-nowrap rounded-md border border-cyan-100/10 bg-black/45 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-100">
                  {city.name}
                </span>
              </div>
            ))}
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-cyan-100/10 bg-black/45 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100">
              <MapPinned className="size-3.5" />
              Indian corridor network
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(248,113,113,0.2),transparent_28%),radial-gradient(circle_at_30%_80%,rgba(168,85,247,0.18),transparent_30%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(125,211,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="scanlines absolute inset-0" />
      {Array.from({ length: 14 }).map((_, index) => (
        <span
          key={index}
          className="hero-node absolute rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-[0_0_24px_rgba(125,211,252,0.25)]"
          style={{
            left: `${8 + ((index * 19) % 82)}%`,
            top: `${12 + ((index * 29) % 72)}%`,
            width: `${10 + (index % 4) * 5}px`,
            height: `${10 + (index % 4) * 5}px`,
            animationDelay: `${index * 0.24}s`,
          }}
        />
      ))}
    </div>
  );
}

function CityGridVisual() {
  return (
    <div className="absolute inset-0 p-6">
      <div className="relative h-full rounded-lg border border-cyan-100/10 bg-black/20">
        {["12%", "32%", "55%", "74%"].map((top, index) => (
          <motion.div
            key={top}
            className="absolute left-8 right-8 h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
            style={{ top }}
            animate={{ opacity: [0.2, 0.9, 0.2], x: [-20, 20, -20] }}
            transition={{ duration: 3 + index * 0.35, repeat: Infinity }}
          />
        ))}
        {["16%", "38%", "62%", "84%"].map((left, index) => (
          <motion.div
            key={left}
            className="absolute bottom-8 top-8 w-1 rounded-full bg-gradient-to-b from-transparent via-red-300 to-transparent"
            style={{ left }}
            animate={{ opacity: [0.15, 0.75, 0.15], y: [-18, 18, -18] }}
            transition={{ duration: 3.3 + index * 0.3, repeat: Infinity }}
          />
        ))}
        <div className="absolute left-[48%] top-[42%] size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/30 bg-red-500/10 shadow-[0_0_60px_rgba(248,113,113,0.32)]" />
        <div className="absolute left-[48%] top-[42%] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.75)]" />
        <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
          <MiniTelemetry icon={Zap} label="brake memory" value="94" />
          <MiniTelemetry icon={CloudRain} label="rain risk" value="76" />
          <MiniTelemetry icon={Eye} label="visibility" value="mod" />
        </div>
      </div>
    </div>
  );
}

function InsightSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Core insight"
          title="Reactive systems wait for accidents. RoadLens AI reads the near-miss pattern first."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <FlowCard title="Traditional systems" items={["Accident", "Response"]} muted />
          <FlowCard title="RoadLens AI" items={flow} />
        </div>
      </div>
    </section>
  );
}

function BrakingMemorySection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <SectionTitle
          eyebrow="Collective Braking Memory"
          title="Danger emerges behaviorally before it becomes statistically visible."
        />
        <div className="relative h-[420px] overflow-hidden rounded-lg border border-red-300/15 bg-slate-950/70 p-6">
          <div className="absolute inset-0 telemetry-grid opacity-35" />
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="absolute rounded-full border border-red-300/30 bg-red-500/10 shadow-[0_0_36px_rgba(248,113,113,0.25)]"
              style={{
                left: `${18 + index * 14}%`,
                top: `${28 + ((index * 17) % 44)}%`,
                width: `${52 + index * 12}px`,
                height: `${52 + index * 12}px`,
              }}
              animate={{ scale: [0.75, 1.28, 0.75], opacity: [0.85, 0.18, 0.85] }}
              transition={{ duration: 2.1, delay: index * 0.24, repeat: Infinity }}
            />
          ))}
          <div className="absolute bottom-6 left-6 right-6 grid gap-2">
            {["hard braking cluster", "swerve anomaly", "near-miss emergence"].map((item) => (
              <div key={item} className="rounded-md border border-slate-700/70 bg-black/35 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-red-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChaosForecastSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Chaos Window Forecasting"
          title="Risk spike expected between 4:30 PM and 5:15 PM."
        />
        <div className="mt-10 rounded-lg border border-cyan-100/15 bg-slate-950/70 p-6">
          <div className="flex h-72 items-end gap-3">
            {forecast.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 20 }}
                  whileInView={{ height: `${value * 2.2}px` }}
                  viewport={{ once: true }}
                  className="w-full rounded-t-md bg-gradient-to-t from-red-500 via-amber-300 to-cyan-200 shadow-[0_0_28px_rgba(56,189,248,0.2)]"
                />
                <span className="font-mono text-xs text-slate-500">{`${14 + index}:00`}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {["rain escalation", "traffic density", "visibility reduction", "risk spike"].map((item) => (
              <div key={item} className="rounded-md border border-cyan-100/10 bg-cyan-200/10 px-3 py-3 text-sm text-cyan-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExplainableAiSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionTitle
          eyebrow="Explainable AI"
          title="Transparent risk scoring for public safety governance."
        />
        <div className="rounded-lg border border-cyan-100/15 bg-slate-950/70 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-heading text-2xl font-semibold">Risk Score: 82%</p>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">audit confidence 91%</p>
            </div>
            <ShieldCheck className="size-8 text-cyan-200" />
          </div>
          <div className="space-y-4">
            {auditFactors.map((factor) => (
              <div key={factor.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="capitalize text-slate-200">{factor.label}</span>
                  <span className="text-slate-400">+{factor.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${factor.value * 2.4}%` }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full bg-gradient-to-r ${factor.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200">{eyebrow}</p>
      <h2 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.02em] text-white sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function FlowCard({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${muted ? "border-slate-700/70 bg-slate-950/45" : "border-cyan-100/15 bg-cyan-200/10"}`}>
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <span className="rounded-md border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-100">
              {item}
            </span>
            {index < items.length - 1 ? <ArrowRight className="size-5 text-cyan-200" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniTelemetry({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-cyan-100/10 bg-black/45 p-3">
      <div className="flex items-center gap-2 text-cyan-100">
        <Icon className="size-4" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="mt-2 font-heading text-2xl font-semibold">{value}</div>
    </div>
  );
}
