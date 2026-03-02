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
  APPROUVE:   { label: "Approuvé",   color: "#059669", bg: "#ecfdf5" },
  REFUSE:     { label: "Refusé",     color: "#ef4444", bg: "#fef2f2" },
};

export default function Conge() {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dateDebut: "", dateFin: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchConges = () => {
    setLoading(true);
    api.get("/employee/conges")
      .then(res => setConges(res.data.conges || []))
      .catch(() => showToast("Erreur chargement congés", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchConges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("/employee/conges", form);
      showToast("Demande de congé envoyée !");
      setForm({ dateDebut: "", dateFin: "" });
      setShowForm(false);
      fetchConges();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de la demande");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setCancelingId(id);
    try {
      await api.delete(`/employee/conges/${id}`);
      showToast("Congé annulé");
      fetchConges();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur annulation", "error");
    } finally {
      setCancelingId(null);
      setConfirmId(null);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 };

  // Stats
  const total = conges.length;
  const approuves = conges.filter(c => c.statut === "APPROUVE").length;
  const enAttente = conges.filter(c => c.statut === "EN_ATTENTE").length;

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {/* Confirm Cancel Modal */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>Annuler ce congé ?</h3>
            <p style={{ color: "#6b7280", marginBottom: 28 }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: "10px 24px", borderRadius: 10, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Garder</button>
              <button onClick={() => handleCancel(confirmId)} disabled={!!cancelingId} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                {cancelingId ? "Annulation..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Mes Congés</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Gérez vos demandes de congé</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }} style={{
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: showForm ? "#e2e8f0" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: showForm ? "#374151" : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: showForm ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
            }}>
              {showForm ? "✕ Annuler" : "+ Nouvelle demande"}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total", value: total, color: "#2563eb", bg: "#eff6ff", icon: "📋" },
              { label: "Approuvés", value: approuves, color: "#059669", bg: "#ecfdf5", icon: "✅" },
              { label: "En attente", value: enAttente, color: "#d97706", bg: "#fffbeb", icon: "⏳" },
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
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a2340", marginBottom: 20 }}>🏖️ Nouvelle demande de congé</h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                  ❌ {formError}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Date de début *</label>
                  <input type="date" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required style={inputStyle} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label style={labelStyle}>Date de fin *</label>
                  <input type="date" value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} required style={inputStyle} min={form.dateDebut || new Date().toISOString().split("T")[0]} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #059669, #047857)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  {formLoading ? "Envoi..." : "✓ Envoyer la demande"}
                </button>
              </div>
            </form>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 14, height: 90, opacity: 0.5 }} />)}
            </div>
          ) : conges.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏖️</div>
              <p>Aucune demande de congé</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {conges.map(c => {
                const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
                const debut = new Date(c.dateDebut).toLocaleDateString("fr-FR");
                const fin = new Date(c.dateFin).toLocaleDateString("fr-FR");
                const jours = Math.ceil((new Date(c.dateFin) - new Date(c.dateDebut)) / (1000 * 60 * 60 * 24));
                return (
                  <div key={c._id} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(30,60,120,0.07)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏖️</div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>Du {debut} au {fin}</p>
                      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{jours} jour{jours > 1 ? "s" : ""} · Demandé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                      {statut.label}
                    </span>
                    {c.statut === "EN_ATTENTE" && (
                      <button onClick={() => setConfirmId(c._id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        Annuler
                      </button>
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