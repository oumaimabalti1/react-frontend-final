import React, { useState, useEffect } from "react";
import { Megaphone, CheckCircle, Clock, XCircle, Plus, X, ChevronDown, ChevronUp, Send, AlertCircle } from "lucide-react";
import ENavbar from "components/Navbars/ENavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  TRAITEE:    { label: "Traitée",    color: "#059669", bg: "#ecfdf5" },
};

function StatCard({ label, value, color, bg, icon: Icon }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 16px rgba(30,60,120,0.06)", borderTop: `3px solid ${color}`, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function PlainteCard({ p, expanded, onToggle }) {
  const statut = statutConfig[p.statut] || { label: p.statut, color: "#6b7280", bg: "#f1f5f9" };
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(30,60,120,0.06)", borderLeft: `3px solid ${statut.color}` }}>
      {/* Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Megaphone size={20} color="#ef4444" />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>{p.sujet}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Envoyée le {new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
        <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{statut.label}</span>
        <button onClick={onToggle} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          {expanded ? <><ChevronUp size={14} /> Masquer</> : <><ChevronDown size={14} /> Voir</>}
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "20px 24px", background: "#fafbfc", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e8edf5" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Votre message</p>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{p.message}</p>
          </div>

          {p.reponse ? (
            <div style={{ background: "#ecfdf5", borderRadius: 12, padding: "14px 16px", border: "1px solid #86efac", display: "flex", gap: 10 }}>
              <CheckCircle size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Réponse du RH</p>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{p.reponse}</p>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fffbeb", borderRadius: 12, padding: "12px 16px", border: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={14} color="#92400e" />
              <p style={{ fontSize: 13, color: "#92400e", margin: 0, fontWeight: 500 }}>En attente de réponse du RH...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

export default function PlaintesEmployee() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [plaintes, setPlaintes]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ sujet: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState("");
  const [toast, setToast]             = useState(null);
  const [expanded, setExpanded]       = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchPlaintes = () => {
    setLoading(true);
    api.get("/employee/plaintes").then(res => setPlaintes(res.data.plaintes || [])).catch(() => showToast("Erreur chargement plaintes", "error")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlaintes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try {
      await api.post("/employee/plaintes", { ...form, employeId: user._id });
      showToast("Plainte envoyée avec succès");
      setForm({ sujet: "", message: "" }); setShowForm(false); fetchPlaintes();
    } catch (err) { setFormError(err.response?.data?.message || "Erreur lors de l'envoi"); }
    finally { setFormLoading(false); }
  };

  return (
    <>
      <ENavbar />
      <Toast toast={toast} />

      <main style={{ minHeight: "100vh", background: "#f1f5f9", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Mes Plaintes</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Signalez un problème à votre RH</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }}
              style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: showForm ? "#e2e8f0" : "linear-gradient(135deg,#ef4444,#dc2626)", color: showForm ? "#374151" : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: showForm ? "none" : "0 4px 14px rgba(239,68,68,0.3)" }}>
              {showForm ? <><X size={15} /> Annuler</> : <><Plus size={15} /> Nouvelle plainte</>}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
            <StatCard label="Total"      value={plaintes.length}                                    color="#7c3aed" bg="rgba(124,58,237,0.08)" icon={Megaphone} />
            <StatCard label="En attente" value={plaintes.filter(p => p.statut === "EN_ATTENTE").length} color="#d97706" bg="#fffbeb"               icon={Clock} />
            <StatCard label="Traitées"   value={plaintes.filter(p => p.statut === "TRAITEE").length}    color="#059669" bg="#ecfdf5"               icon={CheckCircle} />
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 4px 24px rgba(30,60,120,0.08)", marginBottom: 28, border: "1px solid #e8edf5" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Megaphone size={17} color="#ef4444" /> Nouvelle plainte
              </h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertCircle size={14} /> {formError}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Sujet *</label>
                  <input value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} required style={inputStyle} placeholder="Ex: Problème de planning, Conditions de travail..." />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Décrivez votre problème en détail..." />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}>
                    <Send size={15} /> {formLoading ? "Envoi..." : "Envoyer la plainte"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 72, opacity: 0.5 }} />)}
            </div>
          ) : plaintes.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "64px 24px", textAlign: "center", boxShadow: "0 2px 16px rgba(30,60,120,0.06)" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Megaphone size={26} color="#ef4444" />
              </div>
              <p style={{ color: "#1a2340", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Aucune plainte soumise</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Cliquez sur "Nouvelle plainte" pour signaler un problème</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {plaintes.map(p => (
                <PlainteCard key={p._id} p={p} expanded={expanded === p._id} onToggle={() => setExpanded(expanded === p._id ? null : p._id)} />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}