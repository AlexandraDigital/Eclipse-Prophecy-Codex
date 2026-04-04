import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;

const styles = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root { height: 100%; }

  .app {
    min-height: 100vh;
    background: #0d0b08;
    background-image:
      radial-gradient(ellipse at 20% 10%, rgba(120, 80, 20, 0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 90%, rgba(60, 30, 10, 0.25) 0%, transparent 55%);
    font-family: 'Crimson Pro', Georgia, serif;
    color: #e8d5b0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  /* ── SETUP SCREEN ── */
  .setup {
    max-width: 520px;
    width: 100%;
    animation: fadeUp 0.8s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .title-wrap { text-align: center; margin-bottom: 36px; }

  .title {
    font-family: 'Cinzel Decorative', serif;
    font-size: clamp(1.4rem, 5vw, 2.2rem);
    color: #d4a84b;
    letter-spacing: 0.04em;
    text-shadow: 0 0 40px rgba(212, 168, 75, 0.35);
    line-height: 1.2;
  }

  .subtitle {
    margin-top: 10px;
    font-size: 1.05rem;
    color: #9a8060;
    font-style: italic;
    letter-spacing: 0.02em;
  }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 28px 0 24px;
    color: #6a5535;
    font-size: 0.8rem; letter-spacing: 0.15em;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1;
    height: 1px; background: linear-gradient(90deg, transparent, #6a5535, transparent);
  }

  .field { margin-bottom: 18px; }

  label {
    display: block;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9a8060;
    margin-bottom: 7px;
  }

  input, textarea, select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212, 168, 75, 0.2);
    border-radius: 4px;
    color: #e8d5b0;
    font-family: 'Crimson Pro', serif;
    font-size: 1rem;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: rgba(212, 168, 75, 0.55);
    background: rgba(255,255,255,0.07);
  }
  input::placeholder, textarea::placeholder { color: #5a4a30; }

  textarea { resize: vertical; min-height: 90px; line-height: 1.5; }

  select option { background: #1a1510; }

  .preset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
    margin-top: 10px;
  }

  .preset-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212, 168, 75, 0.15);
    border-radius: 4px;
    color: #b09060;
    font-family: 'Crimson Pro', serif;
    font-size: 0.9rem;
    padding: 8px 10px;
    cursor: pointer;
    text-align: left;
    transition: all 0.18s;
    display: flex; align-items: center; gap: 7px;
  }
  .preset-btn:hover {
    background: rgba(212, 168, 75, 0.1);
    border-color: rgba(212, 168, 75, 0.4);
    color: #d4a84b;
  }
  .preset-btn.active {
    background: rgba(212, 168, 75, 0.14);
    border-color: #d4a84b;
    color: #d4a84b;
  }

  .begin-btn {
    width: 100%;
    margin-top: 28px;
    padding: 14px;
    background: linear-gradient(135deg, #b8852a, #d4a84b);
    border: none;
    border-radius: 4px;
    color: #1a1208;
    font-family: 'Cinzel Decorative', serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 24px rgba(212, 168, 75, 0.25);
  }
  .begin-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(212, 168, 75, 0.4);
  }
  .begin-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── CHAT SCREEN ── */
  .chat-wrap {
    width: 100%;
    max-width: 680px;
    height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
    animation: fadeUp 0.5s ease both;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(212, 168, 75, 0.15);
    background: rgba(0,0,0,0.3);
    border-radius: 6px 6px 0 0;
    backdrop-filter: blur(6px);
  }

  .char-badge {
    display: flex; align-items: center; gap: 12px;
  }

  .char-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7a5020, #d4a84b);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    border: 2px solid rgba(212, 168, 75, 0.4);
    flex-shrink: 0;
  }

  .char-info { line-height: 1.3; }
  .char-name { font-size: 1rem; font-weight: 600; color: #d4a84b; }
  .char-type { font-size: 0.8rem; color: #8a7050; font-style: italic; }

  .reset-btn {
    background: none;
    border: 1px solid rgba(212, 168, 75, 0.2);
    border-radius: 4px;
    color: #8a7050;
    font-family: 'Crimson Pro', serif;
    font-size: 0.82rem;
    padding: 5px 12px;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.18s;
  }
  .reset-btn:hover { border-color: #d4a84b; color: #d4a84b; }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgba(0,0,0,0.2);
    scrollbar-width: thin;
    scrollbar-color: #4a3820 transparent;
  }

  .msg {
    max-width: 88%;
    animation: msgIn 0.3s ease both;
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg.user { align-self: flex-end; }
  .msg.ai   { align-self: flex-start; }
  .msg.narrator { align-self: center; max-width: 95%; }

  .msg-sender {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 5px;
    opacity: 0.7;
  }
  .msg.user .msg-sender  { text-align: right; color: #d4a84b; }
  .msg.ai .msg-sender    { color: #80b090; }
  .msg.narrator .msg-sender { text-align: center; color: #9080a0; }

  .msg-bubble {
    padding: 11px 15px;
    border-radius: 4px;
    font-size: 1.02rem;
    line-height: 1.65;
  }

  .msg.user .msg-bubble {
    background: rgba(180, 130, 40, 0.18);
    border: 1px solid rgba(212, 168, 75, 0.3);
    border-bottom-right-radius: 1px;
    color: #e8d5b0;
  }

  .msg.ai .msg-bubble {
    background: rgba(30, 60, 40, 0.3);
    border: 1px solid rgba(100, 180, 120, 0.2);
    border-bottom-left-radius: 1px;
    color: #c8e0cc;
  }

  .msg.narrator .msg-bubble {
    background: rgba(40, 20, 60, 0.3);
    border: 1px solid rgba(140, 100, 180, 0.2);
    color: #c0b0d8;
    text-align: center;
    font-style: italic;
  }

  .typing-indicator {
    display: flex; align-items: center; gap: 5px;
    padding: 12px 15px;
    background: rgba(30, 60, 40, 0.3);
    border: 1px solid rgba(100, 180, 120, 0.2);
    border-radius: 4px;
    border-bottom-left-radius: 1px;
    max-width: 80px;
    align-self: flex-start;
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #80b090;
    animation: bounce 1.1s infinite ease-in-out;
  }
  .dot:nth-child(2) { animation-delay: 0.18s; }
  .dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .chat-input-area {
    padding: 14px 18px;
    border-top: 1px solid rgba(212, 168, 75, 0.15);
    background: rgba(0,0,0,0.3);
    border-radius: 0 0 6px 6px;
    backdrop-filter: blur(6px);
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .chat-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(212, 168, 75, 0.2);
    border-radius: 4px;
    color: #e8d5b0;
    font-family: 'Crimson Pro', serif;
    font-size: 1rem;
    padding: 10px 14px;
    outline: none;
    resize: none;
    max-height: 120px;
    line-height: 1.5;
    transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: rgba(212, 168, 75, 0.5); }
  .chat-input::placeholder { color: #5a4a30; }

  .send-btn {
    background: linear-gradient(135deg, #7a5020, #b8852a);
    border: none;
    border-radius: 4px;
    color: #1a1208;
    width: 44px; height: 44px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    transition: all 0.18s;
    box-shadow: 0 2px 12px rgba(212, 168, 75, 0.2);
  }
  .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 18px rgba(212, 168, 75, 0.35); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .hint { font-size: 0.72rem; color: #5a4a30; margin-top: 6px; text-align: center; letter-spacing: 0.05em; }
`;

const PRESETS = [
  { emoji: "🧙", label: "Wizard", type: "Mage" },
  { emoji: "🗡️", label: "Knight", type: "Warrior" },
  { emoji: "🦸", label: "Hero", type: "Champion" },
  { emoji: "🧛", label: "Vampire", type: "Undead" },
  { emoji: "🧝", label: "Elf", type: "Ranger" },
  { emoji: "🤖", label: "Android", type: "AI Being" },
  { emoji: "🧙‍♀️", label: "Witch", type: "Sorceress" },
  { emoji: "🐉", label: "Dragon", type: "Wyrm" },
  { emoji: "👻", label: "Ghost", type: "Spirit" },
  { emoji: "🧝‍♀️", label: "Fairy", type: "Fey" },
  { emoji: "🕵️", label: "Detective", type: "Sleuth" },
  { emoji: "🧜", label: "Mermaid", type: "Sea Folk" },
];

export default function App() {
  const [phase, setPhase] = useState("setup");
  const [charName, setCharName] = useState("");
  const [charType, setCharType] = useState("");
  const [charDesc, setCharDesc] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [world, setWorld] = useState("fantasy");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function applyPreset(p) {
    setSelectedPreset(p.label);
    setCharName(p.label);
    setCharType(p.type);
  }

  async function startGame() {
    const name = charName.trim() || "Unknown";
    const type = charType.trim() || "Adventurer";
    const desc = charDesc.trim();

    const intro = {
      role: "narrator",
      sender: "The World",
      text: `The story begins... ${name} the ${type} enters a world full of mystery and possibility. What will you do?`,
    };
    setMessages([intro]);
    setPhase("chat");

    setLoading(true);
    try {
      const systemPrompt = `You are an immersive interactive storytelling AI. The player's character is:
Name: ${name}
Type: ${type}
Description: ${desc || "A wandering soul with an unknown past."}
World: ${world}

You play ALL other characters and narrate the world. Keep responses vivid and engaging (2-4 paragraphs max). Speak as other characters directly and describe the scene. Address the player's character by name occasionally. React to what they say and do. Make the story dramatic, immersive, and fun. If they speak as their character, respond in kind. Always leave a hook or choice at the end to keep the story moving.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            { role: "user", content: `I am ${name}, a ${type}. ${desc ? desc + " " : ""}I step into this world for the first time. Set the scene and give me a compelling opening moment.` }
          ],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "The adventure begins...";
      setMessages(prev => [...prev, { role: "ai", sender: "World", text }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", sender: "World", text: "The adventure begins in darkness... (couldn't reach the storyteller)" }]);
    }
    setLoading(false);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", sender: charName || "You", text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const name = charName.trim() || "Unknown";
      const type = charType.trim() || "Adventurer";
      const desc = charDesc.trim();

      const systemPrompt = `You are an immersive interactive storytelling AI. The player's character is:
Name: ${name}
Type: ${type}
Description: ${desc || "A wandering soul with an unknown past."}
World: ${world}

You play ALL other characters and narrate the world. Keep responses vivid and engaging (2-4 paragraphs max). Speak as other characters directly and describe the scene. Address the player's character by name occasionally. React to what they say and do. Make the story dramatic, immersive, and fun. Always leave a hook or choice at the end.`;

      const history = messages
        .filter(m => m.role !== "narrator")
        .map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...history, { role: "user", content: text }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "...";
      setMessages(prev => [...prev, { role: "ai", sender: "World", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", sender: "World", text: "The world falls silent for a moment..." }]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const canStart = charName.trim().length > 0;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {phase === "setup" ? (
          <div className="setup">
            <div className="title-wrap">
              <div className="title">Chronicle</div>
              <div className="subtitle">Become anyone. Live any story.</div>
            </div>

            <div className="field">
              <label>Choose a Preset</label>
              <div className="preset-grid">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    className={`preset-btn${selectedPreset === p.label ? " active" : ""}`}
                    onClick={() => applyPreset(p)}
                  >
                    <span>{p.emoji}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider">or create your own</div>

            <div className="field">
              <label>Character Name *</label>
              <input
                value={charName}
                onChange={e => setCharName(e.target.value)}
                placeholder="e.g. Kira, Morthos, The Wanderer..."
              />
            </div>

            <div className="field">
              <label>Character Type</label>
              <input
                value={charType}
                onChange={e => setCharType(e.target.value)}
                placeholder="e.g. Rogue, Scientist, Demon Lord..."
              />
            </div>

            <div className="field">
              <label>Backstory / Description</label>
              <textarea
                value={charDesc}
                onChange={e => setCharDesc(e.target.value)}
                placeholder="Describe your character's history, personality, abilities, or goals..."
              />
            </div>

            <div className="field">
              <label>World Setting</label>
              <select value={world} onChange={e => setWorld(e.target.value)}>
                <option value="fantasy">High Fantasy</option>
                <option value="sci-fi">Science Fiction</option>
                <option value="horror">Dark Horror</option>
                <option value="mystery">Victorian Mystery</option>
                <option value="post-apocalyptic">Post-Apocalyptic</option>
                <option value="mythology">Ancient Mythology</option>
                <option value="modern">Modern Day</option>
                <option value="pirates">Age of Pirates</option>
              </select>
            </div>

            <button className="begin-btn" onClick={startGame} disabled={!canStart}>
              Begin the Story
            </button>
          </div>
        ) : (
          <div className="chat-wrap">
            <div className="chat-header">
              <div className="char-badge">
                <div className="char-avatar">
                  {selectedPreset
                    ? PRESETS.find(p => p.label === selectedPreset)?.emoji || "⚔️"
                    : (charName[0] || "?").toUpperCase()}
                </div>
                <div className="char-info">
                  <div className="char-name">{charName || "Adventurer"}</div>
                  <div className="char-type">{charType || "Unknown"} · {world}</div>
                </div>
              </div>
              <button className="reset-btn" onClick={() => { setPhase("setup"); setMessages([]); }}>
                New Story
              </button>
            </div>

            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <div className="msg-sender">{m.sender}</div>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="typing-indicator">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea
                ref={textareaRef}
                className="chat-input"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Speak or act as ${charName || "your character"}...`}
                disabled={loading}
              />
              <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
                ➤
              </button>
            </div>
            <div className="hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        )}
      </div>
    </>
  );
}
