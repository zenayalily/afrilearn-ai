import { useState, useRef, useEffect } from "react";

const COUNTRIES = [
  "Kenya", "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania",
  "Ethiopia", "Rwanda", "Zambia", "Zimbabwe", "Cameroon", "Senegal",
  "Côte d'Ivoire", "Egypt", "Morocco", "Other"
];

const SUBJECTS = {
  primary: ["Mathematics", "English", "Science", "Social Studies", "Kiswahili", "Creative Arts", "Religious Education"],
  secondary: ["Mathematics", "English", "Biology", "Chemistry", "Physics", "History", "Geography", "Kiswahili", "Business Studies", "Computer Studies", "Literature", "Agriculture"]
};

const MODES = [
  { id: "ask", label: "Ask a Question", icon: "💬", desc: "Get help on any topic" },
  { id: "exam", label: "Exam Practice", icon: "📝", desc: "Practice with exam questions" },
  { id: "homework", label: "Homework Help", icon: "📚", desc: "Step-by-step explanations" },
];

const SYSTEM_PROMPT = `You are AfriLearn AI, an educational assistant built specifically for African students across the continent. You understand African education systems including Kenya CBC and 8-4-4, Nigeria WAEC and NECO, Ghana WASSCE, South Africa CAPS and Matric, Uganda UNEB, Tanzania NECTA, and other African countries. Your role is to answer academic questions clearly using African context and examples, generate exam-style practice questions relevant to African curricula, provide step-by-step homework help, use local examples such as African cities, rivers, currencies, and historical figures when explaining concepts, be encouraging warm and culturally aware, and always adapt your language and examples to be relevant to African students.`;

export default function AfriLearnAI() {
  const [screen, setScreen] = useState("home");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (overrideMsg) => {
    const userText = overrideMsg || input.trim();
    if (!userText) return;
    const userMsg = { role: "user", content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT + ` Student context: Country: ${country}, Level: ${level}, Subject: ${subject}, Mode: ${mode}.`,
          messages: newMessages
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I could not get a response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const startChat = () => {
    if (!country || !level || !subject || !mode) return;
    setMessages([]);
    setScreen("chat");
    const welcome = { role: "assistant", content: `Hello! I am AfriLearn AI, your personal tutor for ${subject}. I am here to help you as a student in ${country}. What would you like help with today?` };
    setMessages([welcome]);
  };

  const fmt = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  if (screen === "home") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0a,#1a1a0a)", fontFamily:"Georgia,serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ textAlign:"center", maxWidth:"500px" }}>
        <div style={{ width:"80px", height:"80px", borderRadius:"20px", background:"linear-gradient(135deg,#f5a623,#e8442a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"38px", margin:"0 auto 20px", boxShadow:"0 0 40px rgba(245,166,35,0.4)" }}>🌍</div>
        <h1 style={{ fontSize:"42px", color:"#fff", margin:"0 0 8px" }}>AfriLearn AI</h1>
        <p style={{ color:"#f5a623", fontStyle:"italic", marginBottom:"12px" }}>Elimu kwa Waafrika Wote</p>
        <p style={{ color:"rgba(255,255,255,0.6)", marginBottom:"40px", lineHeight:"1.7" }}>The first AI tutor built for African students. Supporting curricula from Kenya to Nigeria, Ghana to South Africa.</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"40px" }}>
          {[["🎓","African Curricula","CBC, WAEC, CAPS"],["🤖","AI-Powered","Smart instant answers"],["🌐","All Africa","50+ countries"]].map(([icon,title,desc]) => (
            <div key={title} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"16px 8px", border:"1px solid rgba(245,166,35,0.2)" }}>
              <div style={{ fontSize:"24px", marginBottom:"6px" }}>{icon}</div>
              <div style={{ color:"#fff", fontSize:"12px", fontWeight:"bold", marginBottom:"4px" }}>{title}</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px" }}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen("setup")} style={{ background:"linear-gradient(135deg,#f5a623,#e8442a)", color:"#fff", border:"none", borderRadius:"14px", padding:"16px 40px", fontSize:"16px", fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif" }}>Start Learning →</button>
      </div>
    </div>
  );

  if (screen === "setup") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0a,#1a1a0a)", fontFamily:"Georgia,serif", padding:"40px 20px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ maxWidth:"520px", width:"100%" }}>
        <button onClick={() => setScreen("home")} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"14px", marginBottom:"20px", padding:0 }}>← Back</button>
        <h2 style={{ color:"#fff", fontSize:"26px", marginBottom:"6px" }}>Set Up Your Profile</h2>
        <p style={{ color:"rgba(255,255,255,0.5)", marginBottom:"32px" }}>Personalize your learning experience</p>

        <div style={{ marginBottom:"24px" }}>
          <label style={{ color:"#f5a623", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"10px" }}>Your Country</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => setCountry(c)} style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"13px", cursor:"pointer", border: country===c ? "2px solid #f5a623" : "2px solid rgba(255,255,255,0.1)", background: country===c ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.05)", color: country===c ? "#f5a623" : "rgba(255,255,255,0.7)", fontFamily:"Georgia,serif" }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"24px" }}>
          <label style={{ color:"#f5a623", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"10px" }}>Education Level</label>
          <div style={{ display:"flex", gap:"10px" }}>
            {[{id:"primary",label:"Primary School",sub:"Class 1–8"},{id:"secondary",label:"Secondary School",sub:"Form 1–4"}].map(l => (
              <button key={l.id} onClick={() => { setLevel(l.id); setSubject(""); }} style={{ flex:1, padding:"14px", borderRadius:"14px", cursor:"pointer", textAlign:"left", border: level===l.id ? "2px solid #f5a623" : "2px solid rgba(255,255,255,0.1)", background: level===l.id ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.05)", color:"#fff", fontFamily:"Georgia,serif" }}>
                <div style={{ fontWeight:"bold", marginBottom:"4px" }}>{l.label}</div>
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>{l.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {level && (
          <div style={{ marginBottom:"24px" }}>
            <label style={{ color:"#f5a623", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"10px" }}>Subject</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
              {SUBJECTS[level].map(s => (
                <button key={s} onClick={() => setSubject(s)} style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"13px", cursor:"pointer", border: subject===s ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.1)", background: subject===s ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)", color: subject===s ? "#22c55e" : "rgba(255,255,255,0.7)", fontFamily:"Georgia,serif" }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom:"32px" }}>
          <label style={{ color:"#f5a623", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"10px" }}>How can I help?</label>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ width:"100%", marginBottom:"8px", padding:"14px 16px", borderRadius:"14px", cursor:"pointer", textAlign:"left", border: mode===m.id ? "2px solid #f5a623" : "2px solid rgba(255,255,255,0.1)", background: mode===m.id ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.05)", color:"#fff", fontFamily:"Georgia,serif", display:"flex", alignItems:"center", gap:"14px" }}>
              <span style={{ fontSize:"22px" }}>{m.icon}</span>
              <div><div style={{ fontWeight:"bold" }}>{m.label}</div><div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>{m.desc}</div></div>
              {mode===m.id && <span style={{ marginLeft:"auto", color:"#f5a623" }}>✓</span>}
            </button>
          ))}
        </div>

        <button onClick={startChat} disabled={!country||!level||!subject||!mode} style={{ width:"100%", padding:"16px", borderRadius:"14px", fontSize:"15px", fontWeight:"bold", cursor: country&&level&&subject&&mode ? "pointer" : "not-allowed", border:"none", fontFamily:"Georgia,serif", background: country&&level&&subject&&mode ? "linear-gradient(135deg,#f5a623,#e8442a)" : "rgba(255,255,255,0.1)", color: country&&level&&subject&&mode ? "#fff" : "rgba(255,255,255,0.3)" }}>Start Session →</button>
      </div>
    </div>
  );

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#0d0d0d", fontFamily:"Georgia,serif" }}>
      <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.1)", background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", gap:"12px" }}>
        <button onClick={() => setScreen("setup")} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", borderRadius:"8px", padding:"6px 12px", cursor:"pointer", fontSize:"13px" }}>← Back</button>
        <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg,#f5a623,#e8442a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>🌍</div>
        <div>
          <div style={{ color:"#fff", fontWeight:"bold", fontSize:"14px" }}>AfriLearn AI</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px" }}>{subject} · {country}</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:"16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start" }}>
            {msg.role==="assistant" && <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#f5a623,#e8442a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", marginRight:"8px", flexShrink:0, marginTop:"4px" }}>🌍</div>}
            <div style={{ maxWidth:"78%", padding:"12px 16px", borderRadius: msg.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role==="user" ? "linear-gradient(135deg,#f5a623,#e8442a)" : "rgba(255,255,255,0.07)", color:"#fff", fontSize:"14px", lineHeight:"1.7", border: msg.role==="assistant" ? "1px solid rgba(255,255,255,0.1)" : "none" }} dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#f5a623,#e8442a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🌍</div>
            <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:"18px", padding:"12px 16px", display:"flex", gap:"5px" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#f5a623", animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding:"14px 16px", borderTop:"1px solid rgba(255,255,255,0.1)", background:"rgba(0,0,0,0.8)", display:"flex", gap:"8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()} placeholder={`Ask about ${subject}...`} style={{ flex:1, padding:"12px 16px", borderRadius:"12px", fontSize:"14px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", outline:"none", fontFamily:"Georgia,serif" }} />
        <button onClick={() => sendMessage()} disabled={loading||!input.trim()} style={{ padding:"12px 16px", borderRadius:"12px", border:"none", background: input.trim()&&!loading ? "linear-gradient(135deg,#f5a623,#e8442a)" : "rgba(255,255,255,0.1)", color:"#fff", cursor: input.trim()&&!loading ? "pointer" : "not-allowed", fontSize:"16px" }}>→</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-5px);opacity:1}} input::placeholder{color:rgba(255,255,255,0.3)}`}</style>
    </div>
  );
}
