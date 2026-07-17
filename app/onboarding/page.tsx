"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Headphones,
  BookOpen,
  User,
  HelpCircle,
  Users,
  Building2,
  Search,
  Share2,
  UserCheck,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Option = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

type Step = {
  key: string;
  headline: string;
  subtext: string;
  options: Option[];
};

// ─── Step Definitions ─────────────────────────────────────────────────────────

const steps: Step[] = [
  {
    key: "use_case",
    headline: "What are you building your first bot for?",
    subtext: "We'll set up a starting template that fits your use case.",
    options: [
      {
        id: "customer_support",
        label: "Customer Support",
        description: "Answer customer questions from docs & FAQs",
        icon: <Headphones className="w-6 h-6" />,
      },
      {
        id: "internal_kb",
        label: "Internal Knowledge Base",
        description: "Help your team find answers from internal docs",
        icon: <BookOpen className="w-6 h-6" />,
      },
      {
        id: "personal",
        label: "Personal Assistant",
        description: "A personal AI trained on your own content",
        icon: <User className="w-6 h-6" />,
      },
      {
        id: "other",
        label: "Something else",
        description: "I'll configure it myself",
        icon: <HelpCircle className="w-6 h-6" />,
      },
    ],
  },
  {
    key: "team_size",
    headline: "How big is your team?",
    subtext: "Helps us point you toward the right features.",
    options: [
      {
        id: "solo",
        label: "Just me",
        description: "Solo founder or individual creator",
        icon: <User className="w-6 h-6" />,
      },
      {
        id: "small_team",
        label: "Small team",
        description: "2 – 10 people",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "company",
        label: "Company",
        description: "10+ people across departments",
        icon: <Building2 className="w-6 h-6" />,
      },
    ],
  },
  {
    key: "attribution",
    headline: "How did you hear about Redas?",
    subtext: "Just a quick one for us — takes one click.",
    options: [
      {
        id: "search",
        label: "Search / Google",
        description: "Found us while searching online",
        icon: <Search className="w-6 h-6" />,
      },
      {
        id: "social",
        label: "Social media",
        description: "Twitter, LinkedIn, Instagram, etc.",
        icon: <Share2 className="w-6 h-6" />,
      },
      {
        id: "referral",
        label: "Friend or colleague",
        description: "Someone recommended Redas",
        icon: <UserCheck className="w-6 h-6" />,
      },
      {
        id: "other",
        label: "Other",
        description: "A different way",
        icon: <MoreHorizontal className="w-6 h-6" />,
      },
    ],
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 32 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.18 },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, type: "spring" as const, stiffness: 340, damping: 28 },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const step = steps[currentStep];
  const totalSteps = steps.length;
  const isLast = currentStep === totalSteps - 1;

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (!selected) return;

    const newAnswers = { ...answers, [step.key]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      // Persist to sessionStorage and navigate
      sessionStorage.setItem("redas_onboarding", JSON.stringify(newAnswers));
      router.push("/dashboard/create");
      return;
    }

    setDirection(1);
    setSelected(null);
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    setSelected(answers[steps[currentStep - 1].key] ?? null);
    setCurrentStep((s) => s - 1);
  };

  const progressPercent = ((currentStep) / totalSteps) * 100;

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left Panel ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[380px] shrink-0 bg-[#111111] text-white px-10 py-12">
        {/* Logo */}
        <div>
          <img src="/redas_logo.png" className="h-8 object-contain brightness-[10] invert" alt="Redas" />
        </div>

        {/* Steps list */}
        <div className="space-y-8">
          {steps.map((s, i) => {
            const isPast = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <motion.div
                key={s.key}
                animate={{ opacity: isPast ? 0.4 : isCurrent ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4"
              >
                {/* Step indicator */}
                <div
                  className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                    isPast
                      ? "bg-white/20 text-white"
                      : isCurrent
                      ? "bg-white text-black"
                      : "border border-white/20 text-white/40"
                  }`}
                >
                  {isPast ? "✓" : i + 1}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold transition-all duration-300 ${
                      isCurrent ? "text-white" : "text-white/50"
                    }`}
                  >
                    {["Your use case", "Team size", "How you found us"][i]}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5 leading-relaxed">
                    {["Picks your starting template", "Guides feature suggestions", "Marketing attribution only"][i]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom quote */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Why we ask</span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Your answers let us skip the generic empty dashboard and show you a relevant starting point in under 30 seconds.
          </p>
        </div>
      </aside>

      {/* ── Right Panel ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-border">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progressPercent + (100 / totalSteps)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src="/redas_logo.png" className="h-8 object-contain" alt="Redas" />
        </div>

        {/* Step counter */}
        <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-8">
          Step {currentStep + 1} of {totalSteps}
        </p>

        {/* Question + Options */}
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Headline */}
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-bold font-outfit text-foreground leading-tight mb-2">
                  {step.headline}
                </h1>
                <p className="text-muted-foreground text-sm">{step.subtext}</p>
              </div>

              {/* Option Cards */}
              <div className="grid gap-3">
                {step.options.map((opt, i) => {
                  const isSelected = selected === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      id={`onboarding-option-${step.key}-${opt.id}`}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleSelect(opt.id)}
                      className={`group w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-foreground/25 hover:shadow-sm"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground group-hover:bg-muted"
                        }`}
                      >
                        {opt.icon}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-sm transition-colors ${
                            isSelected ? "text-foreground" : "text-foreground/80"
                          }`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{opt.description}</p>
                      </div>

                      {/* Selection indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-10 w-full max-w-xl">
          {currentStep > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}

          <motion.button
            onClick={handleNext}
            disabled={!selected}
            whileTap={{ scale: 0.97 }}
            className="ml-auto flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-95"
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4" />
                Set up my bot
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>

        {/* Skip link */}
        <button
          onClick={() => {
            sessionStorage.setItem("redas_onboarding", JSON.stringify({}));
            router.push("/dashboard/create");
          }}
          className="mt-5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2"
        >
          Skip for now
        </button>
      </main>
    </div>
  );
}
