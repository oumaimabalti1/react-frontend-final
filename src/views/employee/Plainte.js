import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/ENavbar.js";
import api from "services/api";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: toast.type === "error" ? "#ef4444" : "#10b981",
      color: "#fff", borderRadius: 12, padding: "14px 24px",
      fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    }}>
      {toast.type === "error" ? "❌" : "✅"} {toast.msg}
    </div>
  );
}

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  TRAITEE:    { label: "Traitée",    color: "#059669", bg: "#ecfdf5" },
};

export default function PlaintesEmployee() {
  const [plaintes, setPlaintes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sujet: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPlaintes = () => {
    setLoading(true);
    api.get("/employee/plaintes")
      .then(res => setPlaintes(res.data.plaintes || []))
      .catch(() => showToast("Erreur chargement plaintes", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlaintes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("/employee/plaintes", form);
      showToast("Plainte envoyée avec succès");
      setForm({ sujet: "", message: "" });
      setShowForm(false);
      fetchPlaintes();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setFormLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 };

  const enAttente = plaintes.filter(p => p.statut === "EN_ATTENTE").length;
  const traitees = plaintes.filter(p => p.statut === "TRAITEE").length;

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Mes Plaintes</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Signalez un problème à votre RH</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }} style={{
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: showForm ? "#e2e8f0" : "linear-gradient(135deg, #ef4444, #dc2626)",
              color: showForm ? "#374151" : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: showForm ? "none" : "0 4px 14px rgba(239,68,68,0.3)",
            }}>
              {showForm ? "✕ Annuler" : "+ Nouvelle plainte"}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total", value: plaintes.length, color: "#2563eb", bg: "#eff6ff", icon: "📋" },
              { label: "En attente", value: enAttente, color: "#d97706", bg: "#fffbeb", icon: "⏳" },
              { label: "Traitées", value: traitees, color: "#059669", bg: "#ecfdf5", icon: "✅" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 2px 12px rgba(30,60,120,0.07)", borderLeft: `4px solid ${s.color}`, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#1a2340" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 2px 20px rgba(30,60,120,0.08)", marginBottom: 28 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a2340", marginBottom: 20 }}>📢 Nouvelle plainte</h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                  ❌ {formError}
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Sujet *</label>
                <input value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} required style={inputStyle} placeholder="Ex: Problème de planning, Harcèlement, Conditions de travail..." />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Décrivez votre problème en détail..." />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  {formLoading ? "Envoi..." : "📨 Envoyer la plainte"}
                </button>
              </div>
            </form>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 14, height: 100, opacity: 0.5 }} />)}
            </div>
          ) : plaintes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p>Aucune plainte soumise</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {plaintes.map(p => {
                const statut = statutConfig[p.statut] || { label: p.statut, color: "#6b7280", bg: "#f1f5f9" };
                const isExpanded = expanded === p._id;
                return (
                  <div key={p._id} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(30,60,120,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📢</div>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>{p.sujet}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Envoyée le {new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                        {statut.label}
                      </span>
                      <button onClick={() => setExpanded(isExpanded ? null : p._id)} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        {isExpanded ? "Masquer" : "Voir"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", marginBottom: p.reponse ? 12 : 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Votre message :</p>
                          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{p.message}</p>
                        </div>
                        {p.reponse && (
                          <div style={{ background: "#ecfdf5", borderRadius: 10, padding: "14px 16px", border: "1px solid #86efac" }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#059669", marginBottom: 6 }}>✅ Réponse du RH :</p>
                            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{p.reponse}</p>
                          </div>
                        )}
                        {!p.reponse && p.statut === "EN_ATTENTE" && (
                          <div style={{ background: "#fffbeb", borderRadius: 10, padding: "12px 16px", border: "1px solid #fde68a" }}>
                            <p style={{ fontSize: 13, color: "#92400e", margin: 0 }}>⏳ En attente de réponse du RH...</p>
                          </div>
                        )}
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