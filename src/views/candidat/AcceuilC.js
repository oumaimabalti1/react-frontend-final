import React from "react";
import CNavbar from "components/Navbars/CNavbar.js";
import NavCard from "components/Cards/NavCards.js";
import { candidatCards } from "components/Cards/PortalCards.js";

export default function AcceuilC() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <CNavbar />
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#164e63 60%,#1e293b 100%)", padding: "64px 24px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(8,145,178,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(6,182,212,0.06)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(8,145,178,0.15)", color: "#67e8f9", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail Candidat
            </span>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
              Bienvenue{user?.nom ? `, ${user.nom}` : ""}
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
              Explorez les opportunités d'emploi, gérez vos candidatures et déposez votre CV en toute simplicité.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: 860, margin: "-32px auto 0", padding: "0 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
            {candidatCards.map(card => <NavCard key={card.to} {...card} />)}
          </div>
        </div>

      </main>
    </>
  );
}