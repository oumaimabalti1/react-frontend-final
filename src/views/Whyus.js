import React from "react";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import { ShieldCheck, Layers, Zap, CheckCircle } from "lucide-react";

const reasons = [
  {
    icon: Layers, color: "#0891b2", num: "01",
    title: "Conçu pour la Simplicité & l'Efficacité",
    desc: "Notre plateforme est dotée d'une interface épurée et de workflows intuitifs, permettant aux utilisateurs de se concentrer sur ce qui compte vraiment : les personnes et la performance.",
  },
  {
    icon: CheckCircle, color: "#7c3aed", num: "02",
    title: "Adapté aux Besoins RH Modernes",
    desc: "Du recrutement à la gestion des candidats, notre solution est conçue pour s'adapter aux défis RH du monde réel avec 3 fonctionnalités d'intelligence artificielle.",
  },
  {
    icon: ShieldCheck, color: "#059669", num: "03",
    title: "Sécurisé & Fiable",
    desc: "La sécurité des données n'est pas une option. Nous utilisons JWT, bcrypt et le RBAC pour garantir que vos informations restent protégées et confidentielles.",
  },
  {
    icon: Zap, color: "#ea580c", num: "04",
    title: "Technologie Axée sur la Performance",
    desc: "Propulsé par le stack MERN (MongoDB, Express, React, Node.js) avec un microservice Python pour le chatbot RAG, offrant rapidité et fiabilité.",
  },
];

export default function Whyus() {
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
            Notre valeur ajoutée
          </span>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "#0f172a", margin: "0 0 16px", lineHeight: 1.1 }}>
            Pourquoi Choisir <span style={{ color: "#0891b2" }}>EasyRH ?</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            Une plateforme RH pensée pour simplifier votre quotidien, sécuriser vos données et booster votre performance.
          </p>
        </div>

        {/* Cards — timeline style */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px 80px" }}>
          {reasons.map(({ icon: Icon, color, num, title, desc }, i) => (
            <div key={title} style={{
              display: "flex", gap: 24, marginBottom: i < reasons.length - 1 ? 0 : 0,
              position: "relative"
            }}>
              {/* Timeline line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 50, flexShrink: 0 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${color}10`, border: `2px solid ${color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800, color: color, flexShrink: 0
                }}>
                  {num}
                </div>
                {i < reasons.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "#e2e8f0", minHeight: 40 }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1, padding: "12px 28px 36px", borderRadius: 16,
                background: "#fafafa", border: "1px solid #f1f5f9",
                marginBottom: 16, transition: "transform 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Icon size={20} color={color} />
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3>
                </div>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}