import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import { Mail, User, MessageSquare, Send, CheckCircle, MapPin, Phone, Clock } from "lucide-react";

const SERVICE_ID  = "service_b74zo2l";
const TEMPLATE_ID = "template_q0k5i75";
const PUBLIC_KEY  = "rgyNAzNtpPY3CNt_H";

export default function ContactUs() {
  const formRef = useRef();
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12,
    border: "1.5px solid #e2e8f0", background: "#fafafa", color: "#0f172a",
    fontSize: 14, outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s"
  };

  return (
    <>
      <FreeNavbar />
      <main style={{ minHeight: "100vh", background: "#ffffff" }}>

        {/* Hero — left aligned */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <span style={{
            display: "inline-block", background: "#f0fdfa", color: "#0891b2",
            border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 16
          }}>
            Contact
          </span>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "#0f172a", margin: "0 0 16px", lineHeight: 1.1 }}>
            Contactez-<span style={{ color: "#0891b2" }}>nous</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 500, lineHeight: 1.7, margin: 0 }}>
            Une question, une suggestion ? Notre équipe vous répond dans les plus brefs délais.
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 40, alignItems: "start" }}>

            {/* Left — infos */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Informations</h2>

              {[
                { icon: Mail,   label: "Email",     value: "baltioumaima1@gmail.com" },
                { icon: Phone,  label: "Téléphone", value: "+216 00 000 000" },
                { icon: MapPin, label: "Adresse",   value: "Tunis, Tunisie" },
                { icon: Clock,  label: "Horaires",  value: "Lun–Ven, 9h–18h" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 14, marginBottom: 16,
                  padding: "16px 20px", borderRadius: 14,
                  background: "#fafafa", border: "1px solid #f1f5f9"
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "#f0fdfa", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon size={16} color="#0891b2" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>{label}</p>
                    <p style={{ fontSize: 14, color: "#334155", margin: 0, fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — form */}
            <div style={{
              background: "#fafafa", border: "1px solid #e2e8f0",
              borderRadius: 20, padding: "36px 32px"
            }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "#f0fdf4", display: "flex",
                    alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
                  }}>
                    <CheckCircle size={36} color="#059669" />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Message envoyé !</h3>
                  <p style={{ color: "#64748b", marginBottom: 28 }}>Nous vous répondrons dans les plus brefs délais.</p>
                  <button onClick={() => setSent(false)} style={{
                    padding: "11px 28px", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    background: "white", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: 14
                  }}>Envoyer un autre message</button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 28 }}>Envoyer un message</h2>
                  <form ref={formRef} onSubmit={handleSubmit}>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Nom complet *</label>
                      <div style={{ position: "relative" }}>
                        <User size={15} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          name="name" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required placeholder="Votre nom"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "#0891b2"}
                          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Email *</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={15} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          name="email" type="email" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required placeholder="votre@email.com"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "#0891b2"}
                          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Message *</label>
                      <div style={{ position: "relative" }}>
                        <MessageSquare size={15} color="#94a3b8" style={{ position: "absolute", left: 14, top: 14 }} />
                        <textarea
                          name="message" value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          required rows={5} placeholder="Décrivez votre demande..."
                          style={{
                            ...inputStyle, padding: "12px 14px 12px 42px",
                            resize: "vertical", fontFamily: "inherit"
                          }}
                          onFocus={e => e.target.style.borderColor = "#0891b2"}
                          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                    </div>

                    {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</p>}

                    <button type="submit" disabled={loading} style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none",
                      background: loading ? "#e2e8f0" : "#0891b2",
                      color: loading ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 15,
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: loading ? "none" : "0 4px 16px rgba(8,145,178,0.3)",
                      transition: "all 0.2s"
                    }}>
                      <Send size={16} />
                      {loading ? "Envoi en cours..." : "Envoyer le message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}