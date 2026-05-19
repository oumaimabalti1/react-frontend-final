import React, { useState, useEffect } from "react";
import { Calendar, Palmtree, CheckCircle, Clock, XCircle, Plus, X, AlertTriangle } from "lucide-react";
import ENavbar from "components/Navbars/ENavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#059669", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  APPROUVE:   { label: "Approuvé",   color: "#059669", bg: "#ecfdf5" },
  REFUSE:     { label: "Refusé",     color: "#ef4444", bg: "#fef2f2" },
};

function StatCard({ label, value, color, bg, icon: Icon }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", borderLeft: `4px solid ${color}`, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Annuler ce congé ?</h3>
        <p style={{ color: "#64748b", marginBottom: 32 }}>Cette action est irréversible.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 11, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Garder</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            {loading ? "Annulation..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CongeCard({ c, onCancel }) {
  const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
  const debut = new Date(c.dateDebut).toLocaleDateString("fr-FR");
  const fin = new Date(c.dateFin).toLocaleDateString("fr-FR");
  const jours = Math.ceil((new Date(c.dateFin) - new Date(c.dateDebut)) / (1000 * 60 * 60 * 24));
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", borderLeft: `4px solid ${statut.color}`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: statut.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Palmtree size={20} color={statut.color} />
      </div>
      <div style={{ flex: 1, minWidth: 150 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Du {debut} au {fin}</p>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          <span style={{ fontWeight: 600 }}>{jours} jour{jours > 1 ? "s" : ""}</span> · Demandé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <span style={{ background: statut.bg, color: statut.color, borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{statut.label}</span>
      {c.statut === "EN_ATTENTE" && (
        <button onClick={() => onCancel(c._id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <X size={13} /> Annuler
        </button>
      )}
    </div>
  );
}

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

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const fetchConges = () => { setLoading(true); api.get("/employee/conges").then(res => setConges(res.data.conges || [])).catch(() => showToast("Erreur chargement congés", "error")).finally(() => setLoading(false)); };
  useEffect(() => { fetchConges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try { await api.post("/employee/conges", form); showToast("Demande de congé envoyée !"); setForm({ dateDebut: "", dateFin: "" }); setShowForm(false); fetchConges(); }
    catch (err) { setFormError(err.response?.data?.message || "Erreur lors de la demande"); }
    finally { setFormLoading(false); }
  };

  const handleCancel = async (id) => {
    setCancelingId(id);
    try { await api.delete(`/employee/conges/${id}`); showToast("Congé annulé"); fetchConges(); }
    catch (err) { showToast(err.response?.data?.message || "Erreur annulation", "error"); }
    finally { setCancelingId(null); setConfirmId(null); }
  };

  return (
    <>
      <ENavbar />
      <Toast toast={toast} />
      {confirmId && <ConfirmModal onConfirm={() => handleCancel(confirmId)} onCancel={() => setConfirmId(null)} loading={!!cancelingId} />}

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>
        {/* Hero - light */}
        <div style={{ padding: "48px 24px 60px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ display: "inline-block", background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Portail Employé</span>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Mes Congés</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{conges.length} demande{conges.length !== 1 ? "s" : ""} au total</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }} style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b6d7df,#0e7490)", color: showForm ? "#475569" : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: showForm ? "none" : "0 2px 8px rgba(8,145,178,0.3)" }}>
              {showForm ? <><X size={15} /> Annuler</> : <><Plus size={15} /> Nouvelle demande</>}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total" value={conges.length} bg="#f0fdfa" icon={Calendar} />
            <StatCard label="Approuvés" value={conges.filter(c => c.statut === "APPROUVE").length} bg="#ecfdf5" icon={CheckCircle} />
            <StatCard label="En attente" value={conges.filter(c => c.statut === "EN_ATTENTE").length} bg="#fffbeb" icon={Clock} />
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", border: "1px solid #f1f5f9", marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Palmtree size={18} color="#0891b2" /> Nouvelle demande de congé
              </h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><XCircle size={14} /> {formError}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>Date de début *</label>
                    <input type="date" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", background: "#fafafa", boxSizing: "border-box" }} min={new Date().toISOString().split("T")[0]} onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>Date de fin *</label>
                    <input type="date" value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", background: "#fafafa", boxSizing: "border-box" }} min={form.dateDebut || new Date().toISOString().split("T")[0]} onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "#059669", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(5,150,105,0.3)" }}>
                    <CheckCircle size={15} /> {formLoading ? "Envoi..." : "Envoyer la demande"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 90, border: "1px solid #f1f5f9" }} />)}
            </div>
          ) : conges.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "64px 24px", textAlign: "center", border: "1px solid #f1f5f9" }}>
              <Palmtree size={40} color="#94a3b8" style={{ marginBottom: 16 }} />
              <p style={{ color: "#0f172a", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Aucune demande de congé</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Cliquez sur "Nouvelle demande" pour commencer</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {conges.map(c => <CongeCard key={c._id} c={c} onCancel={setConfirmId} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}