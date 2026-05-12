import React from "react";
import ENavbar from "components/Navbars/ENavbar.js";
import NavCard from "components/Cards/NavCards.js";
import { employeeCards } from "components/Cards/PortalCards.js";

export default function AcceuilE() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <ENavbar />
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        <div style={{ padding: "48px 24px 60px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <span style={{
              display: "inline-block", background: "#f0fdfa", color: "#0891b2",
              border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 16
            }}>Portail Employé</span>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.2 }}>
              Bienvenue{user?.nom ? `, ${user.nom}` : ""}
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
              Gérez vos congés et signalez vos préoccupations directement à votre responsable RH.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 620, margin: "0 auto", padding: "32px 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
            {employeeCards.map(card => <NavCard key={card.to} {...card} />)}
          </div>
        </div>
      </main>
    </>
  );
}