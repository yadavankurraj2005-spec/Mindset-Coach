import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are an elite sports psychologist and mindset coach with 15+ years of experience helping athletes and fitness enthusiasts break through mental barriers and build lasting consistency.

The user will describe their pattern of starting and stopping their fitness journey. Your job is to give them a deeply personal, psychologically sharp response.

Structure your response in exactly 4 sections with these headers:
**🧠 WHY YOU'RE SELF-SABOTAGING**
**🔑 YOUR IDENTITY-BASED SYSTEM**
**🔄 WHEN YOU MISS A DAY**
**⚡ THE MINDSET SHIFT**

Rules:
- Be direct, warm, and real. No corporate wellness fluff.
- Use simple language — mix of Hindi-English (Hinglish) is preferred. Keep it grounded and relatable.
- Speak like a coach who genuinely cares, not a textbook.
- Give specific, actionable advice — not generic "believe in yourself" type content.
- The identity-based system should be concrete with 2-3 daily actions.
- Keep total response under 400 words.
- No bullet point overload. Mix paragraphs with key points.`;

const questions = [
  {
    id: "pattern",
    label: "Tera pattern kya hai?",
    placeholder: "Jaise: 'Main strong start karta hoon, phir ek bura din aata hai aur sab kuch chhod deta hoon...'",
    icon: "🔁"
  },
  {
    id: "goal",
    label: "Tera main fitness goal kya hai?",
    placeholder: "Jaise: muscle build karna, 10kg lose karna, consistent gym jaana...",
    icon: "🎯"
  },
  {
    id: "trigger",
    label: "Kaunsi cheez normally teri consistency todti hai?",
    placeholder: "Jaise: kaam ka stress, social events, ek missed workout, travel...",
    icon: "💥"
  }
];

export default function MindsetCoach() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ pattern: "", goal: "", trigger: "" });
  const [current, setCurrent] = useState("");
  const [result, setResult] = useState("");
  const resultRef = useRef(null);

  useEffect(() => {
    if (step === 5 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [step]);

  const handleNext = () => {
    const key = questions[step - 1]?.id;
    if (key) setAnswers(prev => ({ ...prev, [key]: current }));
    setCurrent("");
    if (step < 3) setStep(step + 1);
    else submitToAI({ ...answers, [key]: current });
  };

  const submitToAI = async (finalAnswers) => {
    setStep(4);
    const userMessage = `Mera fitness journey pattern:
${finalAnswers.pattern}

Mera main goal: ${finalAnswers.goal}

Jo cheez meri consistency todti hai: ${finalAnswers.trigger}

Please mujhe diagnose karo aur guide karo.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Kuch error aa gaya. Dobara try karo.";
      setResult(text);
      setStep(5);
    } catch (e) {
      setResult("Network error. Please try again.");
      setStep(5);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({ pattern: "", goal: "", trigger: "" });
    setCurrent("");
    setResult("");
  };

  const formatResult = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <div key={i} className="section-header">{line.replace(/\*\*/g, "")}</div>;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="result-line">{line.replace(/\*\*/g, "")}</p>;
    });
  };

  const progress = step > 0 && step < 4 ? (step / 3) * 100 : step >= 4 ? 100 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: #e8e4dc; overflow-x: hidden; }
        .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
        .orb-1 { width: 500px; height: 500px; background: #e85d2f; top: -100px; right: -100px; animation: drift1 12s ease-in-out infinite; }
        .orb-2 { width: 400px; height: 400px; background: #f5a623; bottom: -80px; left: -80px; animation: drift2 15s ease-in-out infinite; }
        .orb-3 { width: 300px; height: 300px; background: #c0392b; top: 50%; left: 50%; animation: drift3 10s ease-in-out infinite; }
        @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes drift3 { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-45%,-55%)} }
        .wrapper { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 20px 16px 60px; }
        .header { text-align: center; margin-bottom: 48px; animation: fadeUp 0.8s ease both; }
        .tag { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #e85d2f; border: 1px solid rgba(232,93,47,0.4); padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
        .main-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 800; line-height: 1.1; color: #f0ebe0; margin-bottom: 12px; }
        .main-title span { color: #e85d2f; }
        .subtitle { font-size: 15px; color: #8a8478; font-weight: 300; max-width: 380px; margin: 0 auto; line-height: 1.6; }
        .card { width: 100%; max-width: 560px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; padding: 32px 28px; backdrop-filter: blur(20px); animation: fadeUp 0.6s ease both; }
        .progress-bar { width: 100%; height: 3px; background: rgba(255,255,255,0.08); border-radius: 4px; margin-bottom: 32px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #e85d2f, #f5a623); border-radius: 4px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
        .q-number { font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #e85d2f; margin-bottom: 8px; }
        .q-icon { font-size: 28px; margin-bottom: 12px; }
        .q-label { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 700; color: #f0ebe0; margin-bottom: 20px; line-height: 1.4; }
        textarea { width: 100%; min-height: 120px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 14px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e8e4dc; resize: none; outline: none; transition: border-color 0.2s; line-height: 1.6; }
        textarea:focus { border-color: rgba(232,93,47,0.6); }
        textarea::placeholder { color: #5a5650; }
        .btn { display: block; width: 100%; margin-top: 20px; padding: 14px; background: linear-gradient(135deg, #e85d2f, #c0392b); color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 20px rgba(232,93,47,0.3); }
        .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,93,47,0.45); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #8a8478; box-shadow: none; margin-top: 12px; font-weight: 500; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: #e8e4dc; box-shadow: none; }
        .intro-icon { font-size: 56px; text-align: center; margin-bottom: 20px; }
        .intro-title { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; text-align: center; color: #f0ebe0; margin-bottom: 12px; }
        .intro-desc { font-size: 14px; color: #8a8478; text-align: center; line-height: 1.7; margin-bottom: 28px; }
        .steps-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .step-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 14px; }
        .step-num { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; color: #e85d2f; width: 24px; height: 24px; background: rgba(232,93,47,0.1); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .step-text { font-size: 13px; color: #a09a90; line-height: 1.4; }
        .loading-center { text-align: center; padding: 20px 0; }
        .spinner { width: 48px; height: 48px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.08); border-top-color: #e85d2f; animation: spin 0.8s linear infinite; margin: 0 auto 24px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #f0ebe0; margin-bottom: 8px; }
        .loading-sub { font-size: 13px; color: #5a5650; }
        .result-card { max-width: 600px; }
        .result-badge { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .badge-dot { width: 10px; height: 10px; border-radius: 50%; background: #e85d2f; box-shadow: 0 0 12px #e85d2f; }
        .badge-text { font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #e85d2f; }
        .section-header { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #e85d2f; margin: 24px 0 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(232,93,47,0.2); }
        .result-line { font-size: 14px; color: #c8c4bc; line-height: 1.75; margin-bottom: 6px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="wrapper">
        <div className="header">
          <div className="tag">Sports Psychology</div>
          <div className="main-title">Mindset &<br /><span>Consistency</span> Coach</div>
          <div className="subtitle">Teri sabse badi problem motivation nahi — system hai. Chalte hain.</div>
        </div>

        {step === 0 && (
          <div className="card">
            <div className="intro-icon">🧠</div>
            <div className="intro-title">Teri consistency kyun toot jaati hai?</div>
            <div className="intro-desc">3 sawaal, 2 minute. Tera pattern samjhenge aur tujhe ek real psychological system denge — sirf motivation nahi.</div>
            <div className="steps-list">
              {[["01","Apna pattern describe kar"],["02","Tera goal batao"],["03","Trigger batao jo sab todta hai"]].map(([n,t]) => (
                <div className="step-item" key={n}>
                  <div className="step-num">{n}</div>
                  <div className="step-text">{t}</div>
                </div>
              ))}
            </div>
            <button className="btn" onClick={() => setStep(1)}>Shuru Karte Hain →</button>
          </div>
        )}

        {step >= 1 && step <= 3 && (
          <div className="card">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="q-number">Sawaal {step} / 3</div>
            <div className="q-icon">{questions[step - 1].icon}</div>
            <div className="q-label">{questions[step - 1].label}</div>
            <textarea
              placeholder={questions[step - 1].placeholder}
              value={current}
              onChange={e => setCurrent(e.target.value)}
            />
            <button className="btn" onClick={handleNext} disabled={current.trim().length < 5}>
              {step < 3 ? "Aage →" : "Analysis Karo ⚡"}
            </button>
            {step > 1 && (
              <button className="btn btn-ghost" onClick={() => { setStep(step - 1); setCurrent(""); }}>← Peeche</button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <div className="loading-center">
              <div className="spinner" />
              <div className="loading-text">Tera pattern analyse ho raha hai...</div>
              <div className="loading-sub">Psychology + Real Science + Tere jawaab 🔬</div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="card result-card" ref={resultRef}>
            <div className="result-badge">
              <div className="badge-dot" />
              <div className="badge-text">Teri Personal Analysis</div>
            </div>
            {formatResult(result)}
            <button className="btn" style={{ marginTop: 32 }} onClick={restart}>Dobara Try Karo 🔁</button>
          </div>
        )}
      </div>
    </>
  );
      }
