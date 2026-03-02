import React, { useState, useEffect } from "react";
import Sidebar from "components/Sidebar/Sidebar.js";
import DNavbar from "components/Navbars/DNavbar.js";
import api from "services/api";

const emptyForm = {
  nomEntreprise: "", emailEntreprise: "", secteur: "",
  nomRH: "", emailRH: "", passwordRH: "",
};

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

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEntreprises = () => {
    setLoading(true);
    api.get("/admin/entreprises")
      .then(res => setEntreprises(res.data.entreprises || []))
      .catch(() => showToast("Erreur chargement entreprises", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntreprises(); }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/admin/entreprises/${id}`);
      showToast("Entreprise supprimée avec succès");
      fetchEntreprises();
    } catch {
      showToast("Erreur lors de la suppression", "error");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("/admin/entreprise-rh", form);
      showToast("Entreprise et compte RH créés avec succès");
      setForm(emptyForm);
      setShowForm(false);
      fetchEntreprises();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setFormLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340",
    outline: "none", background: "#f8fafc", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", marginBottom: 6,
  };

  return (
    <>
      <Sidebar />
      <Toast toast={toast} />

      {/* Confirm Delete Modal */}
      {confirmId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "36px 40px",
            maxWidth: 400, width: "90%", textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>
              Confirmer la suppression
            </h3>
            <p style={{ color: "#6b7280", marginBottom: 28, lineHeight: 1.6 }}>
              Cette action supprimera l'entreprise et <strong>tous ses utilisateurs associés</strong>. Irréversible.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{
                padding: "10px 24px", borderRadius: 10, border: "2px solid #e5e7eb",
                background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer",
              }}>
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmId)} disabled={!!deletingId} style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer",
              }}>
                {deletingId ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginLeft: 240, minHeight: "100vh", background: "#f8fafc" }}>
        <DNavbar />
        <div style={{ padding: "40px 36px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>
                Gestion des Entreprises
              </h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
                {entreprises.length} entreprise{entreprises.length !== 1 ? "s" : ""} enregistrée{entreprises.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); setFormError(""); }}
              style={{
                padding: "11px 22px", borderRadius: 12, border: "none",
                background: showForm ? "#e2e8f0" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: showForm ? "#374151" : "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: showForm ? "none" : "0 4px 14px rgba(59,130,246,0.35)",
                transition: "all 0.2s",
              }}
            >
              {showForm ? "✕ Annuler" : "+ Nouvelle Entreprise"}
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <form onSubmit={handleCreate} style={{
              background: "#fff", borderRadius: 20, padding: "32px",
              boxShadow: "0 2px 20px rgba(30,60,120,0.08)", marginBottom: 32,
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a2340", marginBottom: 24 }}>
                🏢 Créer une entreprise + compte RH
              </h2>

              {formError && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fca5a5",
                  borderRadius: 10, padding: "12px 16px", color: "#dc2626",
                  fontSize: 13, marginBottom: 20,
                }}>
                  ❌ {formError}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Entreprise */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                    Informations de l'entreprise
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Nom de l'entreprise *</label>
                  <input name="nomEntreprise" value={form.nomEntreprise} onChange={handleFormChange} required style={inputStyle} placeholder="Ex: TechCorp" />
                </div>
                <div>
                  <label style={labelStyle}>Email de l'entreprise *</label>
                  <input name="emailEntreprise" type="email" value={form.emailEntreprise} onChange={handleFormChange} required style={inputStyle} placeholder="contact@techcorp.com" />
                </div>
                <div>
                  <label style={labelStyle}>Secteur *</label>
                  <input name="secteur" value={form.secteur} onChange={handleFormChange} required style={inputStyle} placeholder="Ex: Informatique" />
                </div>

                {/* RH */}
                <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                    Compte Responsable RH
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Nom du RH *</label>
                  <input name="nomRH" value={form.nomRH} onChange={handleFormChange} required style={inputStyle} placeholder="Ex: Marie Dupont" />
                </div>
                <div>
                  <label style={labelStyle}>Email du RH *</label>
                  <input name="emailRH" type="email" value={form.emailRH} onChange={handleFormChange} required style={inputStyle} placeholder="marie@techcorp.com" />
                </div>
                <div>
                  <label style={labelStyle}>Mot de passe RH *</label>
                  <input name="passwordRH" type="password" value={form.passwordRH} onChange={handleFormChange} required style={inputStyle} placeholder="••••••••" />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
                <button type="submit" disabled={formLoading} style={{
                  padding: "12px 32px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(5,150,105,0.35)",
                }}>
                  {formLoading ? "Création..." : "✓ Créer l'entreprise"}
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div style={{
            background: "#fff", borderRadius: 20,
            boxShadow: "0 2px 20px rgba(30,60,120,0.07)", overflow: "hidden",
          }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>
                Liste des entreprises
              </h2>
              <button onClick={fetchEntreprises} style={{
                padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0",
                background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                🔄 Actualiser
              </button>
            </div>

            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Chargement...</div>
            ) : entreprises.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
                Aucune entreprise enregistrée
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Entreprise", "Email", "Secteur", "Action"].map(h => (
                      <th key={h} style={{
                        padding: "12px 24px", textAlign: "left",
                        fontSize: 11, fontWeight: 700, color: "#6b7280",
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        borderBottom: "1px solid #f0f2f8",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entreprises.map((ent, i) => (
                    <tr key={ent._id}
                      style={{ borderBottom: i < entreprises.length - 1 ? "1px solid #f0f2f8" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "#eff6ff", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontWeight: 700, color: "#2563eb", fontSize: 15,
                          }}>
                            {(ent.name || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#1a2340" }}>{ent.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "#6b7280", fontSize: 14 }}>{ent.email}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{
                          background: "#ecfeff", color: "#0891b2",
                          borderRadius: 20, padding: "4px 12px",
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {ent.secteur || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <button
                          onClick={() => setConfirmId(ent._id)}
                          style={{
                            padding: "7px 16px", borderRadius: 8, border: "none",
                            background: "#fef2f2", color: "#ef4444",
                            fontWeight: 600, fontSize: 13, cursor: "pointer",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                          onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
                        >
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
}