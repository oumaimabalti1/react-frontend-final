import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import api from "services/api";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Bonjour ! Je suis l'assistant EasyRH. Posez-moi vos questions sur les offres d'emploi !" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await api.post("/candidat/chatbot", { question });
      setMessages(prev => [...prev, { role: "bot", text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Désolé, une erreur est survenue. Réessayez !" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        width: 56, height: 56, borderRadius: "50%", border: "none",
        background: "linear-gradient(135deg, #b6d7df, #6d28d9)",
        color: "#fff", cursor: "pointer",
        boxShadow: "0 4px 20px rgba(109,40,217,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.target.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.target.style.transform = "scale(1)"}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      width: 380, height: 520, borderRadius: 20,
      background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #b6d7df, #6d28d9)",
        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bot size={22} color="#fff" />
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>Assistant EasyRH</p>
           
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{
          background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8,
          width: 30, height: 30, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <X size={16} color="#fff" />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: 12,
        background: "#f8fafc",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", gap: 8,
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: msg.role === "user" ? "rgba(139,92,246,0.12)" : "rgba(8,145,178,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {msg.role === "user" ? <User size={14} color="#8b5cf6" /> : <Bot size={14} color="#0891b2" />}
            </div>
            <div style={{
              maxWidth: "75%", padding: "10px 14px", borderRadius: 14,
              background: msg.role === "user" ? "#8b5cf6" : "#fff",
              color: msg.role === "user" ? "#fff" : "#374151",
              fontSize: 13, lineHeight: 1.6,
              boxShadow: msg.role === "bot" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              whiteSpace: "pre-line",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(8,145,178,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={14} color="#0891b2" />
            </div>
            <div style={{
              padding: "10px 14px", borderRadius: 14, background: "#fff",
              fontSize: 13, color: "#94a3b8",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              Recherche en cours...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid #e2e8f0",
        display: "flex", gap: 8, background: "#fff",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            border: "1.5px solid #e2e8f0", fontSize: 13,
            outline: "none", background: "#f8fafc",
            fontFamily: "inherit",
          }}
        />
        <button onClick={handleSend} disabled={!input.trim() || loading} style={{
          width: 40, height: 40, borderRadius: 10, border: "none",
          background: !input.trim() ? "#e2e8f0" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          color: !input.trim() ? "#94a3b8" : "#fff",
          cursor: !input.trim() ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}