import React, { useState, useEffect } from "react";
import { Megaphone, CheckCircle, Clock, XCircle, Plus, X, ChevronDown, ChevronUp, Send, AlertCircle } from "lucide-react";
import ENavbar from "components/Navbars/ENavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#059669", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  TRAITEE:    { label: "Traitée",    color: "#059669", bg: "#ecfdf5" },
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

function PlainteCard({ p, expanded, onToggle }) {
  const statut = statutConfig[p.statut] || { label: p.statut, color: "#6b7280", bg: "#f1f5f9" };
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f1f5f9", borderLeft: `4px solid ${statut.color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Megaphone size={20} color="#ef4444" />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{p.sujet}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Envoyée le {new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
        <span style={{ background: statut.bg, color: statut.color, borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{statut.label}</span>
        <button onClick={onToggle} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          {expanded ? <><ChevronUp size={14} /> Masquer</> : <><ChevronDown size={14} /> Voir</>}
        </button>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "20px 24px", background: "#fafafa", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Votre message</p>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>{p.message}</p>
          </div>
          {p.reponse ? (
            <div style={{ background: "#ecfdf5", borderRadius: 12, padding: "14px 16px", border: "1px solid #bbf7d0", display: "flex", gap: 10 }}>
              <CheckCircle size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Réponse du RH</p>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>{p.reponse}</p>
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

export default function PlaintesEmployee() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [plaintes, setPlaintes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sujet: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const fetchPlaintes = () => { setLoading(true); api.get("/employee/plaintes").then(res => setPlaintes(res.data.plaintes || [])).catch(() => showToast("Erreur chargement plaintes", "error")).finally(() => setLoading(false)); };
  useEffect(() => { fetchPlaintes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try { await api.post("/employee/plaintes", { ...form, employeId: user._id }); showToast("Plainte envoyée avec succès"); setForm({ sujet: "", message: "" }); setShowForm(false); fetchPlaintes(); }
    catch (err) { setFormError(err.response?.data?.message || "Erreur lors de l'envoi"); }
    finally { setFormLoading(false); }
  };

  return (
    <>
      <ENavbar />
      <Toast toast={toast} />

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>
        {/* Hero - light */}
        <div style={{ padding: "48px 24px 60px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ display: "inline-block", background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Portail Employé</span>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Mes Plaintes</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>Signalez un problème à votre RH</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }} style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b6d7df,#0e7490)", color: showForm ? "#475569" : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: showForm ? "none" : "0 2px 8px rgba(239,68,68,0.3)" }}>
              {showForm ? <><X size={15} /> Annuler</> : <><Plus size={15} /> Nouvelle plainte</>}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total" value={plaintes.length} color="#0891b2" bg="#f0fdfa" icon={Megaphone} />
            <StatCard label="En attente" value={plaintes.filter(p => p.statut === "EN_ATTENTE").length} color="#d97706" bg="#fffbeb" icon={Clock} />
            <StatCard label="Traitées" value={plaintes.filter(p => p.statut === "TRAITEE").length} color="#059669" bg="#ecfdf5" icon={CheckCircle} />
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", border: "1px solid #f1f5f9", marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Megaphone size={17} color="#ef4444" /> Nouvelle plainte
              </h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={14} /> {formError}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>Sujet *</label>
                  <input value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} required placeholder="Ex: Problème de planning..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", background: "#fafafa", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>Description *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={4} placeholder="Décrivez votre problème en détail..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", background: "#fafafa", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(239,68,68,0.3)" }}>
                    <Send size={15} /> {formLoading ? "Envoi..." : "Envoyer la plainte"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 72, border: "1px solid #f1f5f9" }} />)}
            </div>
          ) : plaintes.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "64px 24px", textAlign: "center", border: "1px solid #f1f5f9" }}>
              <Megaphone size={40} color="#94a3b8" style={{ marginBottom: 16 }} />
              <p style={{ color: "#0f172a", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Aucune plainte soumise</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Cliquez sur "Nouvelle plainte" pour signaler un problème</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {plaintes.map(p => <PlainteCard key={p._id} p={p} expanded={expanded === p._id} onToggle={() => setExpanded(expanded === p._id ? null : p._id)} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}