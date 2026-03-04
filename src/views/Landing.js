import React from "react";
import { Link } from "react-router-dom";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import { LogIn, UserPlus, Shield, Users, Briefcase, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <>
      <FreeNavbar />

      <main style={{ minHeight: "100vh", background: "#0f172a" }}>

        {/* HERO */}
        <div style={{
          position: "relative", overflow: "hidden",
          padding: "100px 24px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(59,130,246,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: "rgba(139,92,246,0.05)", filter: "blur(70px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>

            {/* Left — text */}
            <div>
              <span style={{
                display: "inline-block",
                background: "rgba(59,130,246,0.12)", color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 20, padding: "5px 16px",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", marginBottom: 24,
              }}>
                Plateforme RH Complète
              </span>

              <h1 style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 900, color: "#fff",
                margin: "0 0 20px", lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}>
                Simplifiez votre{" "}
                <span style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Gestion RH
                </span>
              </h1>

              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
                Une plateforme unique pour gérer candidats, employés, processus RH et administration en toute sécurité.
              </p>

           
            </div>

            {/* Right — auth card */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.08)",
              borderRadius: 24, padding: "40px 36px",
              backdropFilter: "blur(12px)",
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px", textAlign: "center" }}>
                Accéder à EasyRH
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 32 }}>
                Connectez-vous ou créez votre compte
              </p>

              {/* Login button */}
              <Link to="/auth/login" style={{ textDecoration: "none", display: "block", marginBottom: 14 }}>
                <button style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <LogIn size={18} /> Se connecter
                </button>
              </Link>

              {/* Register button */}
              <Link to="/auth/register" style={{ textDecoration: "none", display: "block", marginBottom: 28 }}>
                <button style={{
                  width: "100%", padding: "14px", borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                >
                  <UserPlus size={18} /> S'inscrire
                </button>
              </Link>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>SÉCURISÉ</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                {[
                  { icon: Shield, label: "Données protégées" },
                  { icon: Users,  label: "Multi-rôles" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                    <Icon size={13} /> {label}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </>
  );
}