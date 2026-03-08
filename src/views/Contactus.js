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

  return (
    <>
      <FreeNavbar />
      <main style={{ minHeight: "100vh", background: "#0f172a" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          padding: "80px 24px 60px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(59,130,246,0.07)", filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.06)", filter: "blur(70px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <span style={{
              display: "inline-block", background: "rgba(59,130,246,0.12)", color: "#60a5fa",
              border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "5px 16px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20
            }}>Contact</span>
            <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              Contactez-<span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>nous</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
              Une question, une suggestion ? Notre équipe vous répond dans les plus brefs délais.
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 40, alignItems: "start" }}>

            {/* Left — infos */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Informations</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 32, lineHeight: 1.6 }}>
                Nous sommes disponibles pour répondre à toutes vos questions.
              </p>

              {[
                { icon: Mail,    label: "Email",    value: "baltioumaima1@gmail.com" },
                { icon: Phone,   label: "Téléphone", value: "+216 XX XXX XXX" },
                { icon: MapPin,  label: "Adresse",  value: "Tunis, Tunisie" },
                { icon: Clock,   label: "Horaires", value: "Lun–Ven, 9h–18h" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24,
                  padding: "16px 20px", borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)"
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color="#60a5fa" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{label}</p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — form */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.08)",
              borderRadius: 24, padding: "40px 36px",
              backdropFilter: "blur(12px)"
            }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <CheckCircle size={36} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Message envoyé !</h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>Nous vous répondrons dans les plus brefs délais.</p>
                  <button onClick={() => setSent(false)} style={{
                    padding: "11px 28px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14
                  }}>Envoyer un autre message</button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 28 }}>Envoyer un message</h2>
                  <form ref={formRef} onSubmit={handleSubmit}>

                    {/* Nom */}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Nom complet *</label>
                      <div style={{ position: "relative" }}>
                        <User size={15} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          name="name"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                          placeholder="Votre nom"
                          style={{
                            width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
                            border: "1.5px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.06)", color: "#fff",
                            fontSize: 14, outline: "none", boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Email *</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={15} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required
                          placeholder="votre@email.com"
                          style={{
                            width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
                            border: "1.5px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.06)", color: "#fff",
                            fontSize: 14, outline: "none", boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Message *</label>
                      <div style={{ position: "relative" }}>
                        <MessageSquare size={15} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 14, top: 14 }} />
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          required
                          rows={5}
                          placeholder="Décrivez votre demande..."
                          style={{
                            width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
                            border: "1.5px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.06)", color: "#fff",
                            fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box",
                            fontFamily: "inherit"
                          }}
                        />
                      </div>
                    </div>

                    {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{error}</p>}

                    <button type="submit" disabled={loading} style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none",
                      background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#2563eb,#7c3aed)",
                      color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.4)",
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