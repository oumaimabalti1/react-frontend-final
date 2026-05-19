import React from "react";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import { Lightbulb, Users, Target, TrendingUp } from "lucide-react";

const drives = [
  { icon: Lightbulb,  label: "L'innovation au cœur du recrutement", color: "#0891b2" },
  { icon: Users,      label: "Une expérience utilisateur fluide pour tous", color: "#7c3aed" },
  { icon: Target,     label: "Des recrutements plus intelligents, de meilleures décisions", color: "#059669" },
  { icon: TrendingUp, label: "Des carrières qui évoluent, des équipes qui réussissent", color: "#ea580c" },
];

export default function Aboutus() {
  return (
    <>
      <FreeNavbar />

      <main style={{ minHeight: "100vh", background: "#ffffff" }}>

        {/* Hero — left aligned */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "#0f172a", margin: "0 0 16px", lineHeight: 1.1 }}>
            À Propos de <span style={{ color: "#0891b2" }}>EasyRH</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            Nous sommes un pont entre les talents et les opportunités.
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, marginBottom: 48 }}>

            {/* Left — main text */}
            <div style={{
              background: "#fafafa", border: "1px solid #f1f5f9",
              borderRadius: 20, padding: "36px 32px"
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>
                Nous sommes plus qu'une simple plateforme
              </h2>
              {[
                "Conçue pour un monde numérique en constante évolution, notre plateforme transforme la façon dont les entreprises recrutent et dont les candidats construisent leur carrière.",
                "Nous combinons technologie intelligente et expérience intuitive pour rendre le recrutement plus simple, plus rapide et plus humain.",
                "Pour les entreprises, nous offrons des outils puissants pour attirer, évaluer et recruter les bons talents en toute confiance.",
                "Notre plateforme intègre 3 fonctionnalités d'intelligence artificielle pour automatiser les tâches répétitives et offrir une expérience moderne."
              ].map((text, i) => (
                <p key={i} style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, margin: "0 0 12px" }}>
                  {text}
                </p>
              ))}
            </div>

            {/* Right — stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { value: "5",    label: "Types d'utilisateurs", color: "#0891b2" },
                { value: "3",    label: "Fonctionnalités IA",   color: "#7c3aed" },
                { value: "100%", label: "Sécurisé",             color: "#059669" },
                { value: "∞",    label: "Possibilités",         color: "#ea580c" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#fafafa", border: "1px solid #f1f5f9",
                  borderRadius: 16, padding: "24px 28px",
                  display: "flex", alignItems: "center", gap: 20
                }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: s.color, minWidth: 60 }}>{s.value}</div>
                  <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What drives us — horizontal cards with left border */}
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>
            Ce qui nous anime
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {drives.map(({ icon: Icon, label, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "20px 24px", borderRadius: 14,
                background: "#fafafa", borderLeft: `4px solid ${color}`,
                transition: "transform 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: `${color}10`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={20} color={color} />
                </div>
                <p style={{ fontSize: 14, color: "#334155", margin: 0, fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}