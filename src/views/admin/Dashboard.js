import React, { useState, useEffect } from "react";
import { Building2, UserCog, Users, ClipboardList, Globe } from "lucide-react";
import Sidebar from "components/Sidebar/Sidebar.js";
import DNavbar from "components/Navbars/DNavbar.js";
import api from "services/api";

function StatCard({ label, value, icon: Icon, color, bg }) {
  const maxVal = 50;
  const pct = value ? Math.min((value / maxVal) * 100, 100) : 0;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "28px 24px",
      border: "1px solid #f1f5f9",
      display: "flex", alignItems: "center", gap: 20,
      transition: "transform 0.15s"
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* Donut circle */}
      <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 40 40)" style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon size={22} color={color} />
        </div>
      </div>

      {/* Text */}
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
          {value ?? "—"}
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{value} utilisateur{value !== 1 ? "s" : ""}</div>
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
    { label: "Entreprises",        value: stats?.entreprises, icon: Building2,     color: "#0891b2", bg: "#f0fdfa" },
    { label: "Responsables RH",    value: stats?.rh,          icon: UserCog,       color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Employés",           value: stats?.employees,   icon: Users,         color: "#059669", bg: "#ecfdf5" },
    { label: "Candidats",          value: stats?.candidats,   icon: ClipboardList, color: "#ea580c", bg: "#fff7ed" },
    { label: "Total Utilisateurs", value: stats?.totalUsers,  icon: Globe,         color: "#2563eb", bg: "#eff6ff" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />

      <div style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        <DNavbar />

        <div style={{ padding: "36px 36px" }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <span style={{
              display: "inline-block", background: "#f0fdfa", color: "#0891b2",
              border: "1px solid #99f6e4", borderRadius: 8, padding: "4px 12px",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 12
            }}>Tableau de bord</span>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Vue d'ensemble</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>Statistiques globales de la plateforme EasyRH</p>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 12, padding: "14px 20px", color: "#dc2626",
              marginBottom: 24, fontSize: 14
            }}>
              {error}
            </div>
          )}

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 16, height: 110, border: "1px solid #f1f5f9" }} />
                ))
              : cards.map((c, i) => <StatCard key={i} {...c} />)
            }
          </div>

          {/* Progress bars */}
          {stats && (
            <div style={{
              marginTop: 32, background: "#fff", borderRadius: 16,
              padding: "28px 32px", border: "1px solid #f1f5f9"
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>Répartition des utilisateurs</h2>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <ProgressBar label="RH"        value={stats.rh}        total={stats.totalUsers} color="#0891b2" />
                <ProgressBar label="Employés"  value={stats.employees}  total={stats.totalUsers} color="#059669" />
                <ProgressBar label="Candidats" value={stats.candidats}  total={stats.totalUsers} color="#ea580c" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}