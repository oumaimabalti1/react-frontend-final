import React from "react";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import { ShieldCheck, Layers, Zap, CheckCircle } from "lucide-react";

const reasons = [
  {
    icon: Layers,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    title: "Conçu pour la Simplicité & l'Efficacité",
    desc: "Notre plateforme est dotée d'une interface épurée et de workflows intuitifs, permettant aux utilisateurs de se concentrer sur ce qui compte vraiment : les personnes et la performance.",
  },
  {
    icon: CheckCircle,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    title: "Adapté aux Besoins RH Modernes",
    desc: "Du recrutement à la gestion des candidats, notre solution est conçue pour s'adapter aux défis RH du monde réel.",
  },
  {
    icon: ShieldCheck,
    color: "#059669",
    bg: "rgba(5,150,105,0.1)",
    title: "Sécurisé & Fiable",
    desc: "La sécurité des données n'est pas une option, c'est une nécessité. Nous appliquons les meilleures pratiques pour garantir que vos informations restent protégées, confidentielles et toujours accessibles.",
  },
  {
    icon: Zap,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    title: "Technologie Axée sur la Performance",
    desc: "Propulsé par des technologies web modernes, notre plateforme offre des temps de chargement rapides, une navigation fluide et une haute fiabilité sur tous les appareils.",
  },
];

export default function Whyus() {
  return (
    <>
      <FreeNavbar />

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 60%, #1e293b 100%)",
          padding: "80px 24px 100px",
          position: "relative", overflow: "hidden", textAlign: "center",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(59,130,246,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(59,130,246,0.15)", color: "#60a5fa",
              borderRadius: 20, padding: "5px 16px", fontSize: 12,
              fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 20,
            }}>
              Notre valeur ajoutée
            </span>
            <h1 style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 900, color: "#fff", margin: "0 0 20px", lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}>
              Pourquoi Choisir{" "}
              <span style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                EasyRH ?
              </span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
              Une plateforme RH pensée pour simplifier votre quotidien, sécuriser vos données et booster votre performance.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: 1000, margin: "-40px auto 0", padding: "0 24px 80px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {reasons.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} style={{
                background: "#fff", borderRadius: 20, padding: "32px 28px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(30,60,120,0.07)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,60,120,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,60,120,0.07)"; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: bg, display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: 20,
                }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a2340", margin: "0 0 12px", lineHeight: 1.3 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}