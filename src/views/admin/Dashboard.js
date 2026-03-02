import React, { useState, useEffect } from "react";
import Sidebar from "components/Sidebar/Sidebar.js";
import DNavbar from "components/Navbars/DNavbar.js";
import api from "services/api";

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "28px 24px",
      boxShadow: "0 2px 16px rgba(30,60,120,0.07)",
      borderLeft: `5px solid ${color}`,
      display: "flex", alignItems: "center", gap: 18,
      transition: "transform 0.18s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{
        width: 54, height: 54, borderRadius: 14,
        background: bg, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 26,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#1a2340", lineHeight: 1 }}>
          {value ?? <span style={{ color: "#ccc", fontSize: 20 }}>—</span>}
        </div>
        <div style={{ fontSize: 13, color: "#7a8aaa", marginTop: 4, fontWeight: 500 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/statistiques")
      .then(res => setStats(res.data.statistiques))
      .catch(() => setError("Erreur chargement des statistiques"))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Entreprises", value: stats?.entreprises, icon: "🏢", color: "#2563eb", bg: "#eff6ff" },
    { label: "Responsables RH", value: stats?.rh, icon: "👔", color: "#0891b2", bg: "#ecfeff" },
    { label: "Employés", value: stats?.employees, icon: "👥", color: "#059669", bg: "#ecfdf5" },
    { label: "Candidats", value: stats?.candidats, icon: "📋", color: "#d97706", bg: "#fffbeb" },
    { label: "Total Utilisateurs", value: stats?.totalUsers, icon: "🌐", color: "#7c3aed", bg: "#f5f3ff" },
  ];

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: 240, minHeight: "100vh", background: "#f8fafc" }}>
        <DNavbar />
        <div style={{ padding: "40px 36px" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>
              Vue d'ensemble
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
              Statistiques globales de la plateforme EasyRH
            </p>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              borderRadius: 12, padding: "14px 20px", color: "#dc2626",
              marginBottom: 24, fontSize: 14,
            }}>
              ❌ {error}
            </div>
          )}

          {/* Stats Grid */}
          {loading ? (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 16, height: 110,
                  opacity: 0.5,
                }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}>
              {cards.map((c, i) => <StatCard key={i} {...c} />)}
            </div>
          )}

          {/* Summary box */}
          {stats && (
            <div style={{
              marginTop: 40, background: "#fff", borderRadius: 16,
              padding: "28px 32px", boxShadow: "0 2px 16px rgba(30,60,120,0.07)",
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 20 }}>
                📊 Répartition des utilisateurs
              </h2>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[
                  { label: "RH", value: stats.rh, color: "#0891b2", total: stats.totalUsers },
                  { label: "Employés", value: stats.employees, color: "#059669", total: stats.totalUsers },
                  { label: "Candidats", value: stats.candidats, color: "#d97706", total: stats.totalUsers },
                ].map(item => {
                  const pct = stats.totalUsers ? Math.round((item.value / stats.totalUsers) * 100) : 0;
                  return (
                    <div key={item.label} style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.label}</span>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>{pct}%</span>
                      </div>
                      <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
                        <div style={{
                          width: `${pct}%`, height: "100%",
                          background: item.color, borderRadius: 99,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                        {item.value} utilisateur{item.value !== 1 ? "s" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}