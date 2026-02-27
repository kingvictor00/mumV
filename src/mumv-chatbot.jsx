import { useState, useRef, useEffect } from "react";

const SYSTEM = `You are MumV, Optimum expert. Answer precisely.
Refer users to official docs if unsure..
## About MumV
- Your name is MumV. When asked your name, say "I'm MumV, your guide to all things Optimum and beyond."
## Deep Knowledge About Optimum
### What is Optimum?
Optimum is the world's first high-performance memory infrastructure for any blockchain. It is building the fastest decentralized internet protocol for Web3, starting with a high-throughput, low-latency networking protocol that permissionlessly integrates with any blockchain.
### Core Technology: RLNC (Random Linear Network Coding)
- RLNC is an advanced form of erasure coding that transforms data into smaller chunks, encoding them into random linear combinations before transmission.
- It significantly improves network efficiency and fault tolerance — data can be reconstructed even if some pieces are lost.
- RLNC was developed through pioneering research at MIT. MIT professor Muriel Médard is recognized as a co-inventor.
- Optimum uses RLNC to supercharge blockchain data propagation — encoding transactions, blocks, and data blobs into efficient, resilient packets.
### Products
**mump2p (mump2p Protocol)**
- A high-performance pub-sub protocol that dramatically reduces latency and optimizes delivery of transactions, blocks, and data blobs.
- Boosts network speed and scalability, maximizes validator rewards.
- Seamlessly integrates with existing node setups through a simple API call.
- More robust, scalable, and efficient blockchain ecosystem.
        **Optimum DeRAM**
- DeRAM = Decentralized Random Access Memory
- A decentralized RAM layer ensuring Atomicity, Consistency, and Durability (ACD).
- Gives applications real-time read/write access to blockchain state.
- Enables fast, cheap storage and access.
- Unlocks latency-sensitive onchain use cases: trading, gaming, AI, social and more.
- Status: Coming soon.
### Flexnodes
- Optimum is a decentralized network of Flexnodes that can be run by anyone.
- Flexnodes permissionlessly connect to any blockchain.
- They use RLNC to supercharge data propagation, access and storage.
### Funding & Recognition
- MIT-incubated startup.
- Raised $11M seed round (reported by CoinDesk, April 2025).
- Featured in Blockworks, CoinDesk, Decrypt and other major crypto media.
### Key Supporters / Partners
- Everstake (Bohdan Opryshko, COO)
- Kiln (Thomas de Phuoc, COO & Co-Founder)
- EBunker (Allen Ding, Founder)
- P2P.org (Alex Loktev, CRO)
- InfStones (Zili Zhao, Co-Founder & Head of Business Development)
- Luganodes (Anuj Shankar, CEO)
### Team / Founders
- **Prof. Muriel Médard** — Co-Founder & CEO. MIT professor and co-inventor of RLNC. Pioneer behind Optimum's core technology with 15+ years of research in network coding.
- **Dr. Kishori Konwar** — Co-Founder & CTO. Expert in distributed systems and coding theory.
- **Prof. Nancy Lynch** — Advisor. Renowned for work on Byzantine Fault Tolerance. Former MIT NEC Chair of Software Science and Engineering.
- The project is MIT-incubated and rooted in deep academic research from Harvard and MIT.
### Investors & Backers
Optimum raised **$11M in a Seed Round** (April 2025), led by **1kx**, with participation from:
Robot Ventures, Finality Capital, Spartan, CMT Digital, SNZ, Triton Capital, Big Brain, CMS, Longhash, NGC, Animoca Brands, GSR, Caladan, Reforge, and others.
Optimum also completed an **Angel Round** in February 2025 before the seed.
### CryptoRank Profile
- Tracked on CryptoRank: https://cryptorank.io/price/optimum
- Categorized under **Blockchain Infrastructure**.
- Live Airdrop Ambassador Program — content creators, community members, regional leaders can apply. Selected ambassadors receive a monthly stipend and early product access.
- Airdrop page: https://cryptorank.io/drophunting/optimum-activity768
### Official Links
- CryptoRank: https://cryptorank.io/price/optimum
- Website: https://www.getoptimum.xyz/
- Docs: https://docs.getoptimum.xyz/
- Twitter/X: https://x.com/get_optimum
- Blog: https://mirror.xyz/0xBfAC4db6d990A6cF9842f437345c447B18EbeF73
- Validator Signup: https://tally.so/r/wAyD8y
- Discord: https://discord.gg/getoptimum
### Problem Optimum Solves
Blockchain throughput is bottlenecked by how fast data can move across the network. Optimum removes this bottleneck using RLNC — the fastest and most efficient erasure code for decentralized networking.
## General Knowledge
Beyond Optimum, you are a broadly knowledgeable assistant covering blockchain, Web3, DeFi, staking, validators, MEV, programming, science, history, writing, and more.
## Guidelines
- Be factual and concise. Never hallucinate about Optimum.
- If unsure about Optimum specifics, direct users to official sources.
- You have web search — use it for very recent Optimum news.`;

// ── Markdown renderer ───────────────────────
function renderMarkdown(text) {
  return text
    .split("\n")
    .map(line => {
      const isH = /^#{1,3}\s/.test(line);
      const html = line
        .replace(/^#{1,3}\s*/, "")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        || "&nbsp;";
      return `<p${isH ? ' class="mdh"' : line === "" ? ' class="mdbr"' : ""}>${html}</p>`;
    })
    .join("");
}
const SEARCH_TRIGGERS = [
  "latest","recent","news","update","today","new","announce",
  "blog","post","tweet","mirror","article","launch","release",
  "price","token","airdrop","testnet","mainnet","roadmap",
  "when","currently","right now","this week","this month"
];
export default function MumVChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm **MumV** — your guide to all things Optimum and beyond. Ask me anything about Optimum's technology, products, or anything else you're curious about.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

const sendMessage = async () => {
  const text = input.trim();
  if (!text || loading) return;

  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;

  const history = [...messages, { role: "user", content: text }];
  setMessages(history);
  setInput("");
  if (inputRef.current) inputRef.current.style.height = "46px";

  setLoading(true);
  setMessages(prev => [...prev, { role: "assistant", content: "" }]);

  try {
    // Step 1 — check if query needs live search
    const needsSearch = SEARCH_TRIGGERS.some(t => text.toLowerCase().includes(t));
    let searchContext = "";

    if (needsSearch) {
      try {
        const searchRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        });
        const searchData = await searchRes.json();
        if (searchData.results) {
          searchContext = `\n\n## Live Web Search Results\n${searchData.results}`;
        }
      } catch (e) {
        // search failed silently — Groq will still answer from training
      }
    }

    // Step 2 — call Groq with optional search context injected
    const systemWithContext = SYSTEM + searchContext;
    const apiKey = import.meta.env.VITE_GROQ_KEY;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          messages: [
            { role: "system", content: systemWithContext },
            ...history.map(({ role, content }) => ({ role, content })),
          ],
          stream: true,
        }),
      }
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: accumulated
                };
                return updated;
              });
            }
          } catch (err) {}
        }
      }
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: "Something went wrong. Please try again."
        };
        return updated;
      });
    }
  }

  setLoading(false);
  inputRef.current?.focus();
};

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overscroll-behavior: none;           /* Kill page bounce / pull-to-refresh */
          overscroll-behavior-y: none;
          background: #080808;
          font-family: 'Instrument Sans', sans-serif;
        }

        .shell {
          display: flex;
          flex-direction: column;
          height: 100dvh;                      /* Use dynamic viewport height for mobile */
          min-height: 100dvh;
          max-width: 760px;
          margin: 0 auto;
          background: linear-gradient(155deg, #121212 0%, #090909 55%, #121212 100%);
          position: relative;
          overflow: hidden;
          touch-action: manipulation;          /* Better touch feel */
        }

        .shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          z-index: 0;
        }

        header {
          position: relative;
          z-index: 10;
          padding: 20px 16px 12px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
          flex-shrink: 0;
        }

        .logo {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          letter-spacing: 0.14em;
          background: linear-gradient(130deg, #fff 20%, #777 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          margin-top: 4px;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.27);
          font-family: 'DM Mono', monospace;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 1;
          -webkit-overflow-scrolling: touch;   /* Smooth momentum scrolling on iOS */
          overscroll-behavior-y: contain;      /* Prevent bounce & chaining */
          overscroll-behavior-x: none;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.07) transparent;
        }

        .messages::-webkit-scrollbar { width: 3px; }
        .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

        .row { display: flex; flex-direction: column; }
        .row.user { align-items: flex-end; }
        .row.assistant { align-items: flex-start; }

        .lbl {
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
          margin-bottom: 4px;
          color: rgba(255,255,255,0.22);
        }

        .bubble {
          max-width: 90%;
          padding: 12px 16px;
          border-radius: 3px;
          font-size: 0.88rem;
          line-height: 1.65;
          animation: up 0.2s ease both;
        }

        @keyframes up {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bubble.user {
          background: rgba(255,255,255,0.94);
          color: #0c0c0c;
          border-top-right-radius: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .bubble.assistant {
          background: rgba(255,255,255,0.038);
          border: 1px solid rgba(255,255,255,0.075);
          color: rgba(255,255,255,0.86);
          border-top-left-radius: 0;
        }

        .bubble.assistant p { margin: 0; }
        .bubble.assistant p + p { margin-top: 6px; }
        .bubble.assistant .mdbr { height: 3px; }
        .bubble.assistant .mdh { font-weight: 600; color: rgba(255,255,255,0.94); margin-top: 8px; font-size: 0.9rem; }

        .bubble strong { color: rgba(255,255,255,0.94); font-weight: 600; }
        .bubble.user strong { color: #0c0c0c; }

        .bubble code {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          background: rgba(255,255,255,0.07);
          padding: 1px 4px;
          border-radius: 2px;
          color: rgba(255,255,255,0.72);
        }

        .bubble.user code { background: rgba(0,0,0,0.09); color: #222; }

        .bubble a { color: rgba(255,255,255,0.5); text-decoration: underline; text-underline-offset: 3px; }
        .bubble.user a { color: #333; }

        .dots {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255,255,255,0.038);
          border: 1px solid rgba(255,255,255,0.075);
          border-top-left-radius: 0;
          border-radius: 3px;
          width: fit-content;
          animation: up 0.2s ease both;
        }

        .dot {
          width: 5px; height: 5px;
          background: rgba(255,255,255,0.38);
          border-radius: 50%;
          animation: throb 1.1s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.18s; }
        .dot:nth-child(3) { animation-delay: 0.36s; }

        @keyframes throb {
          0%,80%,100% { opacity: 0.28; transform: scale(0.82); }
          40% { opacity: 1; transform: scale(1); }
        }

        footer {
          position: relative;
          z-index: 10;
          padding: 12px 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.055);
          background: linear-gradient(0deg, rgba(255,255,255,0.025) 0%, transparent 100%);
          flex-shrink: 0;
        }

        .input-row { display: flex; gap: 8px; align-items: flex-end; }

        textarea {
          flex: 1;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 3px;
          color: rgba(255,255,255,0.88);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 0.88rem;
          line-height: 1.5;
          padding: 10px 12px;
          resize: none;
          outline: none;
          min-height: 46px;
          max-height: 136px;
          transition: border-color 0.12s, background 0.12s;
        }

        textarea::placeholder { color: rgba(255,255,255,0.18); }

        textarea:focus {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.065);
        }

        .send {
          height: 46px; width: 46px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.88);
          border: none;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s, transform 0.12s;
        }

        .send:hover:not(:disabled) { background: #fff; transform: scale(1.05); }
        .send:disabled { opacity: 0.28; cursor: not-allowed; }

        .send svg { width: 17px; height: 17px; color: #0a0a0a; }

        .hint {
          margin-top: 6px;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.17);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          text-align: center;
        }

        @media (max-width: 480px) {
          .bubble { max-width: 92%; padding: 11px 14px; font-size: 0.86rem; }
          header { padding: 16px 12px 10px; }
          .logo { font-size: 1.9rem; }
          footer { padding: 10px 12px 14px; }
        }
      `}</style>

      <div className="shell">
        <header>
          <div className="logo">MumV</div>
          <div className="tagline">Built by vicTOR (@kingingveek)</div>
        </header>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className="lbl">{m.role === "user" ? "You" : "MumV"}</div>
              {m.role === "user" ? (
                <div className="bubble user">{m.content}</div>
              ) : (
                <div
                  className="bubble assistant"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                />
              )}
            </div>
          ))}

          {loading && messages[messages.length - 1].content === "" && (
            <div className="row assistant">
              <div className="lbl">MumV</div>
              <div className="dots">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <footer>
          <div className="input-row">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={handleInput}
              placeholder="Ask about Optimum or anything else…"
              disabled={loading}
            />
            <button
              className="send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div className="hint">Click send · Enter for new line</div>
        </footer>
      </div>
    </>
  );
}
