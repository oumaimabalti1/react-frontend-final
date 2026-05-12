import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#059669", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  APPROUVE:   { label: "Approuvé",   color: "#059669", bg: "#ecfdf5" },
  REFUSE:     { label: "Refusé",     color: "#ef4444", bg: "#fef2f2" },
};

export default function Conges() {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchConges = () => {
    setLoading(true);
    api.get("/rh/conges").then(res => setConges(res.data.conges || [])).catch(() => showToast("Erreur chargement congés", "error")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchConges(); }, []);

  const handleAction = async (id, action) => {
    setActionId(id + action);
    try {
      await api.put(`/rh/conges/${id}/${action}`);
      showToast(action === "approve" ? "Congé approuvé" : "Congé refusé");
      fetchConges();
    } catch (err) { showToast(err.response?.data?.message || "Erreur", "error"); }
    finally { setActionId(null); }
  };

  const filtered = filter === "ALL" ? conges : conges.filter(c => c.statut === filter);

  return (
    <>
      <Navbar />
      <Toast toast={toast} />
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "48px 24px 60px", position: "relative", overflow: "hidden" }}>
          
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail RH
            </span>
            <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Demandes de Congé</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{conges.length} demande{conges.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total",      value: conges.length,                                       color: "#2563eb", bg: "#eff6ff", icon: Calendar },
              { label: "En attente", value: conges.filter(c => c.statut === "EN_ATTENTE").length, color: "#d97706", bg: "#fffbeb", icon: Clock },
              { label: "Approuvés",  value: conges.filter(c => c.statut === "APPROUVE").length,   color: "#059669", bg: "#ecfdf5", icon: CheckCircle },
              { label: "Refusés",    value: conges.filter(c => c.statut === "REFUSE").length,     color: "#ef4444", bg: "#fef2f2", icon: XCircle },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", borderLeft: `4px solid ${s.color}`, border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {[{ key: "ALL", label: "Toutes" }, { key: "EN_ATTENTE", label: "En attente" }, { key: "APPROUVE", label: "Approuvées" }, { key: "REFUSE", label: "Refusées" }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "8px 18px", borderRadius: 20, border: filter === f.key ? "none" : "1.5px solid #e2e8f0", background: filter === f.key ? "#0f172a" : "#fff", color: filter === f.key ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {f.label} ({f.key === "ALL" ? conges.length : conges.filter(c => c.statut === f.key).length})
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(4).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 110, opacity: 0.5 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "60px 24px", textAlign: "center" }}>
              <Calendar size={40} color="#e2e8f0" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#94a3b8" }}>Aucune demande de congé</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(c => {
                const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
                return (
                  <div key={c._id} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", borderLeft: `3px solid ${statut.color}` }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#d97706", fontSize: 15, flexShrink: 0 }}>
                      {(c.employeId?.name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{c.employeId?.name}</p>
                      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                        {c.employeId?.departement || "—"} · Du {new Date(c.dateDebut).toLocaleDateString("fr-FR")} au {new Date(c.dateFin).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span style={{ background: statut.bg, color: statut.color, borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{statut.label}</span>
                    {c.statut === "EN_ATTENTE" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleAction(c._id, "approve")} disabled={actionId === c._id + "approve"} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#ecfdf5", color: "#059669", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          {actionId === c._id + "approve" ? "..." : "Approuver"}
                        </button>
                        <button onClick={() => handleAction(c._id, "refuse")} disabled={actionId === c._id + "refuse"} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          {actionId === c._id + "refuse" ? "..." : "Refuser"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}