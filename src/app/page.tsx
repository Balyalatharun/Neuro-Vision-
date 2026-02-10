import Link from "next/link";
import { ArrowRight, Brain, Activity, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background text-foreground">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />

      <main className="z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-8">
        {/* Hero Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            AI-Driven Mental Health Analysis
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          NEUROVISION
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light">
          Early risk detection through conversational AI and facial emotion analysis.
          <span className="block mt-2 text-sm md:text-base opacity-75">
            Non-diagnostic decision support system.
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/auth/register"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 bg-white/5 px-8 font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Login
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
          <FeatureCard
            icon={<Brain className="w-6 h-6 text-primary" />}
            title="Conversational AI"
            description="Empathetic, context-aware dialogue analysis to detect early signs of distress."
          />
          <FeatureCard
            icon={<Activity className="w-6 h-6 text-secondary" />}
            title="Emotion Recognition"
            description="Privacy-focused facial analysis to validate emotional states."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            title="Private & Secure"
            description="Your facial data is processed locally directly (or ephemerally) and never stored as raw video."
          />
        </div>
      </main>

      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        © 2024 NeuroVision System. For Academic & Research Use Only. Not a Medical Device.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl text-left hover:border-primary/50 transition-colors">
      <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
