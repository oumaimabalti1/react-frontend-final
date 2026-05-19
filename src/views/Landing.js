import React from "react";
import { Link } from "react-router-dom";
import FreeNavbar from "components/Navbars/FreeNavbar.js";
import {
  LogIn,
  UserPlus,
  Shield,
  Users,
  Briefcase,
  Bot,
  FileSearch,
  Sparkles,
} from "lucide-react";

export default function Landing() {
  return (
    <>
      <FreeNavbar />

      <main style={{ minHeight: "100vh", background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 32px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 80,
            alignItems: "center",
            minHeight: "85vh",
          }}
        >
          {/* Left — text + features */}
          <div>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 16px",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Simplifiez votre{" "}
              <span style={{ color: "#0891b2" }}>Gestion RH</span>
            </h1>

            <p
              style={{
                fontSize: 16,
                color: "#64748b",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              Une plateforme unique pour gérer candidats, employés, processus RH
              et administration en toute sécurité.
            </p>

            {/* IA badges */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 40,
              }}
            >
              {[
                { icon: Sparkles, label: "Génération IA", color: "#7c3aed" },
                { icon: FileSearch, label: "Scoring ATS", color: "#0891b2" },
                { icon: Bot, label: "Chatbot RAG", color: "#059669" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: `${color}08`,
                    border: `1px solid ${color}20`,
                    fontSize: 13,
                    fontWeight: 600,
                    color: color,
                  }}
                >
                  <Icon size={14} /> {label}
                </div>
              ))}
            </div>

            {/* Trust */}
          </div>

          {/* Right — auth card */}
          <div
            style={{
              background: "#fafafa",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: "40px 36px",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 6px",
                textAlign: "center",
              }}
            >
              Accéder à EasyRH
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Connectez-vous ou créez votre compte
            </p>

            <Link
              to="/auth/login"
              style={{
                textDecoration: "none",
                display: "block",
                marginBottom: 12,
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg,#b6d7df,#0e7490)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(8,145,178,0.3)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <LogIn size={18} /> Se connecter
              </button>
            </Link>

            <Link
              to="/auth/register"
              style={{
                textDecoration: "none",
                display: "block",
                marginBottom: 28,
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0891b2";
                  e.currentTarget.style.color = "#0891b2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                <UserPlus size={18} /> S'inscrire
              </button>
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Sécurisé
              </span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
              {[
                { icon: Shield, label: "JWT + bcrypt" },
                { icon: Briefcase, label: "Multi-tenant" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#94a3b8",
                    fontSize: 12,
                  }}
                >
                  <Icon size={13} /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
