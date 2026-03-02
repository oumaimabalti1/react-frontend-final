import React from "react";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import { Lightbulb, Users, Target, TrendingUp } from "lucide-react";

const drives = [
  { icon: Lightbulb, label: "L'innovation au cœur du recrutement" },
  { icon: Users,     label: "Une expérience utilisateur fluide pour tous" },
  { icon: Target,    label: "Des recrutements plus intelligents, de meilleures décisions" },
  { icon: TrendingUp,label: "Des carrières qui évoluent, des équipes qui réussissent" },
];

export default function Aboutus() {
  return (
    <>
      <FreeNavbar />

      <main style={{ minHeight: "100vh", background: "#0f172a" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
          padding: "80px 24px 60px",
          position: "relative", overflow: "hidden", textAlign: "center",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.07)", filter: "blur(70px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(59,130,246,0.05)", filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(99,102,241,0.15)", color: "#818cf8",
              borderRadius: 20, padding: "5px 16px", fontSize: 12,
              fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 20,
            }}>
              Notre histoire
            </span>
            <h1 style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 900, color: "#fff", margin: "0 0 20px", lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}>
              À Propos de{" "}
              <span style={{
                background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                EasyRH
              </span>
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Main card */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: "40px",
            marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 20px" }}>
              Nous sommes plus qu'une simple plateforme
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Nous sommes un pont entre les talents et les opportunités.",
                "Conçue pour un monde numérique en constante évolution, notre plateforme transforme la façon dont les entreprises recrutent et dont les candidats construisent leur carrière.",
                "Nous combinons technologie intelligente et expérience intuitive pour rendre le recrutement plus simple, plus rapide et plus humain.",
                "Pour les entreprises, nous offrons des outils puissants pour attirer, évaluer et recruter les bons talents en toute confiance.",
              ].map((text, i) => (
                <p key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* What drives us */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: "40px",
            marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 28px" }}>
              Ce qui nous anime :
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {drives.map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 16, padding: "18px 20px",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "rgba(99,102,241,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={18} color="#818cf8" />
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          }}>
            {[
              { value: "4",    label: "Types d'utilisateurs", color: "#3b82f6" },
              { value: "100%", label: "Sécurisé",             color: "#059669" },
              { value: "∞",    label: "Possibilités",         color: "#8b5cf6" },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1.5px solid rgba(255,255,255,0.08)",
                borderRadius: 20, padding: "28px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}