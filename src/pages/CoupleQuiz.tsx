import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const questions = [
  {
    q: "Shaadi ka budget kaun handle karega? 💸",
    options: ["Main karunga/karungi, full control", "Mummy-Papa sambhal lenge 🙏", "Koi planner dhundho yaar", "Budget? Kya budget? YOLO!"],
    category: "planning"
  },
  {
    q: "Baraat mein entry kaisi hogi? 🐴",
    options: ["Full Govinda mode — naachte hue", "Ghodi pe baith ke royal entry", "Vintage car mein swag se", "Seedha mandap, no drama please"],
    category: "personality"
  },
  {
    q: "Sangeet mein kaun jeetega? 💃🕺",
    options: ["Humara side — rehearsals done!", "Unka side — they're filmy af", "Dono milke ek performance karenge", "Koi nahi, DJ pe free dance"],
    category: "personality"
  },
  {
    q: "Shaadi ka khana kaisa hoga? 🍽️",
    options: ["20 counter minimum, full spread", "Biryani aur paneer hai toh kaafi", "Street food stalls — pani puri counter must!", "Diet food bhi rakhna, aunty log bolenge"],
    category: "style"
  },
  {
    q: "Guest list mein kitne log? 😰",
    options: ["500+ — Papa ka 'chhota sa function'", "200 tak rok lenge somehow", "50 log bas, intimate vibes", "Elope karke photo bhej denge 📸"],
    category: "planning"
  },
  {
    q: "Honeymoon ka plan kiska hai? ✈️",
    options: ["Maldives/Bali — Instagram worthy!", "Goa chalte hain, budget mein rahega", "Manali/Shimla — desi romance", "Honeymoon baad mein, pehle neend lo 😴"],
    category: "style"
  },
  {
    q: "Mehendi lagwaoge ya skip? 🌿",
    options: ["Dulha-dulhan dono full haath-pair", "Sirf dulhan, dulha shy hai", "Mehendi + cocktail same night!", "Skip — seedha shaadi karo yaar"],
    category: "style"
  },
  {
    q: "Shaadi stress handle kaise? 😤",
    options: ["Ladte hain, phir chai pe settle", "Ek chup, ek shaant — cold war mode", "Stress eating — mithai khatam!", "Planner hai na, uska kaam hai 😎"],
    category: "personality"
  },
  {
    q: "Joota churai mein kitna maangoge? 👠",
    options: ["₹51,000 minimum — non-negotiable", "₹11,000 se start, negotiation karenge", "Joota waapas nahi karenge 😈", "Ye sab drama nahi chahiye"],
    category: "personality"
  },
  {
    q: "Shaadi ke baad pehla kaam? 🏠",
    options: ["Instagram pe photos daalenge", "Saare gifts kholenge", "FINALLY so jaayenge 💤", "Leftover khana khaayenge"],
    category: "personality"
  }
];

const personalityTypes = [
  { type: "Shaadi Ke CEO", emoji: "👑", range: [85, 100], desc: "Tum dono ki shaadi mein sab kuch planned hai — vendor se lekar paan ke patte tak. Budget? Bas ek number hai. Tumhari shaadi legend hogi, bhai log!", color: "from-amber-500 to-yellow-400" },
  { type: "Chill Couple Goals", emoji: "🌴", range: [70, 84], desc: "No drama, only karma! Tum log ka vibe hai — accha khana, accha music, aur baaki sab chill. Aunties bhi bolenge 'kya couple hai yaar!'", color: "from-teal-500 to-cyan-400" },
  { type: "Insta-Perfect Planners", emoji: "✨", range: [55, 69], desc: "Moodboard ready, Pinterest boards saved, colour palette decided. Tum log plan karte ho toh NASA bhi inspire hota hai. Shaadi stunning hogi!", color: "from-pink-500 to-rose-400" },
  { type: "Bollywood Romantics", emoji: "🎬", range: [40, 54], desc: "Tumhari love story ko background music chahiye! Grand entry, filmy dances, aur aankhon mein aansu wali vidaai. Shah Rukh bhi clap karega!", color: "from-red-500 to-orange-400" },
  { type: "Jugaadu Jodi", emoji: "🔥", range: [0, 39], desc: "Rules? Kya rules? Tum log apni shaadi apne style mein karoge. Chahe destination ho ya terrace, tumhara scene alag hai. Respect! 🫡", color: "from-purple-500 to-violet-400" },
];

function getPersonality(score: number) {
  return personalityTypes.find(p => score >= p.range[0] && score <= p.range[1]) || personalityTypes[4];
}

export default function CoupleQuiz() {
  const [step, setStep] = useState<"names" | "quiz" | "result">("names");
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [personality, setPersonality] = useState(personalityTypes[0]);
  const [shareId, setShareId] = useState("");
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (!partner1.trim() || !partner2.trim()) {
      toast.error("Enter both names to start!");
      return;
    }
    setStep("quiz");
  };

  const handleAnswer = async (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate score
      const rawScore = newAnswers.reduce((sum, a, i) => {
        // Simple scoring: matching answers = more compatibility
        const weight = [25, 20, 15, 10][a] || 10;
        return sum + weight;
      }, 0);
      const finalScore = Math.min(Math.max(Math.round((rawScore / (questions.length * 25)) * 100), 35), 98);
      const pers = getPersonality(finalScore);
      setScore(finalScore);
      setPersonality(pers);
      setStep("result");

      // Save to database
      setSaving(true);
      const sid = Math.random().toString(36).substring(2, 10).toUpperCase();
      setShareId(sid);
      try {
        await supabase.from("couple_quiz_results").insert({
          partner1_name: partner1,
          partner2_name: partner2,
          answers: newAnswers as any,
          score: finalScore,
          personality_type: pers.type,
          personality_description: pers.desc,
          share_id: sid,
        });
      } catch (e) {
        console.error("Failed to save quiz result", e);
      }
      setSaving(false);
    }
  };

  const generateShareImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, "#be185d");
    grad.addColorStop(0.5, "#e11d48");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative circles
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(200, 200, 300, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(880, 880, 250, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px 'Inter Tight', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Wedding Compatibility Score", 540, 140);

    // Score circle
    ctx.beginPath();
    ctx.arc(540, 400, 180, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(540, 400, 160, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 120px 'Inter Tight', sans-serif";
    ctx.fillText(`${score}%`, 540, 430);

    // Names
    ctx.font = "bold 48px 'Inter Tight', sans-serif";
    ctx.fillText(`${partner1} & ${partner2}`, 540, 650);

    // Personality
    ctx.font = "36px 'Inter Tight', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(`"${personality.type}" ${personality.emoji}`, 540, 730);

    // Description (word wrap)
    ctx.font = "24px 'Inter', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    const words = personality.desc.split(" ");
    let line = "";
    let y = 810;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > 900) {
        ctx.fillText(line.trim(), 540, y);
        line = word + " ";
        y += 32;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), 540, y);

    // Branding
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "22px 'Inter', sans-serif";
    ctx.fillText("karloshaadi.com/couple-quiz", 540, 1040);

    // Download
    const link = document.createElement("a");
    link.download = `wedding-compatibility-${partner1}-${partner2}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [score, partner1, partner2, personality]);

  const shareToWhatsApp = () => {
    const url = `${window.location.origin}/couple-quiz?result=${shareId}`;
    const text = `${partner1} & ${partner2} got ${score}% Wedding Compatibility! We're "${personality.type}" ${personality.emoji}\n\nTake the quiz: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const progress = step === "quiz" ? ((currentQ + 1) / questions.length) * 100 : step === "result" ? 100 : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEO title="Wedding Compatibility Quiz | Karlo Shaadi" description="Take the fun couples quiz and find your wedding compatibility score! Share with friends and family." />
      <canvas ref={canvasRef} className="hidden" />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress bar */}
        {step !== "names" && (
          <div className="mb-8">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {step === "quiz" ? `Question ${currentQ + 1} of ${questions.length}` : "Complete!"}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Names */}
          {step === "names" && (
            <motion.div
              key="names"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Heart className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-primary text-sm font-semibold">Couple Quiz</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                  Wedding<br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Compatibility Score</span>
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  10 fun questions to discover your couple personality type. No signup needed — share the result!
                </p>
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block text-left">Partner 1</label>
                  <Input
                    placeholder="e.g. Priya"
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block text-left">Partner 2</label>
                  <Input
                    placeholder="e.g. Rahul"
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <Button onClick={handleStartQuiz} size="lg" className="w-full rounded-full h-12 mt-4">
                  Start the Quiz <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Free • No signup • Takes 2 minutes
              </p>
            </motion.div>
          )}

          {/* STEP 2: Questions */}
          {step === "quiz" && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-2">
                <span className="text-5xl mb-4 block">
                  {["💍", "🏰", "💃", "💰", "🪔", "📋", "🍽️", "🎨", "😤", "🎶"][currentQ]}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold">
                  {questions[currentQ].q}
                </h2>
              </div>

              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-all duration-200 text-sm sm:text-base font-medium"
                  >
                    <span className="text-muted-foreground mr-3">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Result */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              {/* Score Ring */}
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                  <motion.circle
                    cx="100" cy="100" r="85" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 85}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="font-display text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {score}%
                  </motion.span>
                  <span className="text-xs text-muted-foreground">Compatible</span>
                </div>
              </div>

              {/* Names */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                {partner1} <span className="text-primary">&</span> {partner2}
              </h2>

              {/* Personality Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${personality.color} text-white`}
              >
                <span className="text-2xl mr-2">{personality.emoji}</span>
                <span className="font-bold text-lg">{personality.type}</span>
              </motion.div>

              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                {personality.desc}
              </p>

              {/* Share Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={shareToWhatsApp} size="lg" className="rounded-full bg-green-600 hover:bg-green-700">
                  <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
                <Button onClick={generateShareImage} size="lg" variant="outline" className="rounded-full">
                  Download Result Card
                </Button>
              </div>

              {/* Retry */}
              <Button
                variant="ghost"
                onClick={() => { setStep("names"); setCurrentQ(0); setAnswers([]); setPartner1(""); setPartner2(""); }}
                className="text-muted-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Take Again
              </Button>

              {/* CTA */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <p className="font-semibold mb-2">Now plan your dream wedding together!</p>
                <Button onClick={() => navigate("/plan-wizard")} className="rounded-full">
                  <Sparkles className="mr-2 h-4 w-4" /> Get Your 2-Minute Wedding Plan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
