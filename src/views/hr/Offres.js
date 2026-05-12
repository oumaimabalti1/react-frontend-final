import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar.js";
import { Briefcase, Plus, X, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#059669", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOffre, setEditOffre] = useState(null);
  const [form, setForm] = useState({ titre: "", description: "", domaine: "Autre" });
  const [formLoading, setFormLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchOffres = () => {
    setLoading(true);
    api.get("/rh/offres").then(res => setOffres(res.data.offres || [])).catch(() => showToast("Erreur chargement offres", "error")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOffres(); }, []);

  const openEdit = (offre) => { setEditOffre(offre); setForm({ titre: offre.titre, description: offre.description, domaine: offre.domaine || "Autre" }); setShowForm(true); };
  const openNew  = () => { setEditOffre(null); setForm({ titre: "", description: "", domaine: "Autre" }); setAiPrompt(""); setShowForm(true); };

 const generateWithAI = async () => {
    if (!form.titre.trim()) { showToast("Entrez d'abord un titre", "error"); return; }
    setAiLoading(true);
    try {
      const res = await api.post('/rh/offres/generate-description', {
        titre: form.titre,
        domaine: form.domaine
      });
      setForm(f => ({ ...f, description: res.data.description }));
      showToast("Description générée avec succès !");
    } catch { showToast("Erreur génération IA", "error"); }
    finally { setAiLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true);
     console.log("FORM DATA:", form); 
    try {
      if (editOffre) { await api.put(`/rh/offres/${editOffre._id}`, form); showToast("Offre mise à jour"); }
      else { await api.post("/rh/offres", form); showToast("Offre publiée avec succès"); }
      setShowForm(false); setEditOffre(null); fetchOffres();
    } catch (err) { showToast(err.response?.data?.message || "Erreur", "error"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/rh/offres/${id}`); showToast("Offre supprimée"); fetchOffres(); }
    catch { showToast("Erreur suppression", "error"); }
    finally { setConfirmId(null); }
  };

  const input = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", background: "#f8fafc", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {/* Delete confirm modal */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <AlertTriangle size={28} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Supprimer l'offre ?</h3>
            <p style={{ color: "#6b7280", marginBottom: 32 }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setConfirmId(null)} style={{ flex: 1, padding: 11, borderRadius: 10, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={() => handleDelete(confirmId)} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", width: "100%", maxWidth: 560, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: 14, right: 14, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} color="#64748b" />
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
              {editOffre ? "Modifier l'offre" : "Publier une offre"}
            </h2>
           
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>Titre *</label><input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required style={input} placeholder="Ex: Développeur Full Stack" /></div>
<div style={{ marginBottom: 16 }}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
    <label style={{ ...labelStyle, marginBottom: 0 }}>Description *</label>
    <button type="button" onClick={generateWithAI} disabled={aiLoading || !form.titre.trim()} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: aiLoading ? "#94a3b8" : "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: aiLoading || !form.titre.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
      {aiLoading ? "Génération..." : " Générer "}
    </button>
  </div>
  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={5} style={{ ...input, resize: "vertical" }} placeholder="Décrivez le poste ou cliquez sur 'Générer'..." />
</div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Domaine *</label>
                <select value={form.domaine} onChange={e => setForm({ ...form, domaine: e.target.value })} required style={input}>
                  {["Informatique","Marketing","Finance","RH","Commercial","Juridique","Ingénierie","Design","Communication","Autre"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" disabled={formLoading} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#0891b2", boxShadow: "0 2px 8px rgba(8,145,178,0.3)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: formLoading ? "not-allowed" : "pointer" }}>
                {formLoading ? "Enregistrement..." : editOffre ? "Mettre à jour" : "Publier l'offre"}
              </button>
            </form>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "48px 24px 60px", position: "relative", overflow: "hidden" }}>
          
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail RH
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Gestion des Offres</h1>
                <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{offres.length} offre{offres.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={openNew} style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "#0891b2", boxShadow: "0 2px 8px rgba(8,145,178,0.3)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={15} /> Publier une offre
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 120, opacity: 0.5 }} />)}
            </div>
          ) : offres.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "64px 24px", textAlign: "center" }}>
              <Briefcase size={40} color="#e2e8f0" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#94a3b8", fontSize: 15 }}>Aucune offre publiée pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {offres.map(offre => (
                <div key={offre._id} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", borderLeft: "3px solid #2563eb" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(37,99,235,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Briefcase size={20} color="#2563eb" />
                  </div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{offre.titre}</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{offre.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      {offre.domaine && <span style={{ background: "#ecfeff", color: "#0891b2", borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{offre.domaine}</span>}
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Publié le {new Date(offre.dateCreation || offre.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => openEdit(offre)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Edit2 size={13} /> Modifier
                    </button>
                    <button onClick={() => setConfirmId(offre._id)} style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}