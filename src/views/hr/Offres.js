import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar.js";
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

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOffre, setEditOffre] = useState(null);
  const [form, setForm] = useState({ titre: "", description: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOffres = () => {
    setLoading(true);
    api.get("/rh/offres")
      .then(res => setOffres(res.data.offres || []))
      .catch(() => showToast("Erreur chargement offres", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOffres(); }, []);

  const openEdit = (offre) => {
    setEditOffre(offre);
    setForm({ titre: offre.titre, description: offre.description });
    setShowForm(true);
  };

  const openNew = () => {
    setEditOffre(null);
    setForm({ titre: "", description: "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editOffre) {
        await api.put(`/rh/offres/${editOffre._id}`, form);
        showToast("Offre mise à jour");
      } else {
        await api.post("/rh/offres", form);
        showToast("Offre publiée avec succès");
      }
      setShowForm(false);
      setEditOffre(null);
      fetchOffres();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rh/offres/${id}`);
      showToast("Offre supprimée");
      fetchOffres();
    } catch {
      showToast("Erreur suppression", "error");
    } finally {
      setConfirmId(null);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {/* Confirm Delete */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>Supprimer l'offre ?</h3>
            <p style={{ color: "#6b7280", marginBottom: 28 }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: "10px 24px", borderRadius: 10, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={() => handleDelete(confirmId)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Gestion des Offres</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{offres.length} offre{offres.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={openNew} style={{
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}>
              + Publier une offre
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
              <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 20, padding: "36px", maxWidth: 560, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", position: "relative" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ position: "absolute", top: 16, right: 16, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a2340", marginBottom: 24 }}>
                  {editOffre ? "✏️ Modifier l'offre" : "📢 Publier une offre"}
                </h2>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Titre *</label>
                  <input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required style={inputStyle} placeholder="Ex: Développeur Full Stack" />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={5} style={{ ...inputStyle, resize: "vertical" }} placeholder="Décrivez le poste, les missions, les compétences requises..." />
                </div>
                <button type="submit" disabled={formLoading} style={{
                  width: "100%", padding: "12px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}>
                  {formLoading ? "Enregistrement..." : editOffre ? "✓ Mettre à jour" : "📢 Publier"}
                </button>
              </form>
            </div>
          )}

          {/* Offres list */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 120, opacity: 0.5 }} />)}
            </div>
          ) : offres.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p>Aucune offre publiée pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {offres.map(offre => (
                <div key={offre._id} style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 16px rgba(30,60,120,0.07)", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💼</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>{offre.titre}</h3>
                    <p style={{ fontSize: 14, color: "#6b7280", marginTop: 6, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {offre.description}
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                      Publié le {new Date(offre.dateCreation || offre.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => openEdit(offre)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => setConfirmId(offre._id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      🗑️
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