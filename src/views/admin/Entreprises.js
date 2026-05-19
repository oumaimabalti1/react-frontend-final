import React, { useState, useEffect } from "react";
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle, Plus, X } from "lucide-react";
import Sidebar from "components/Sidebar/Sidebar.js";
import DNavbar from "components/Navbars/DNavbar.js";
import api from "services/api";

const emptyForm = { nomEntreprise: "", emailEntreprise: "", secteur: "", nomRH: "", emailRH: "", passwordRH: "" };

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: isError ? "#fef2f2" : "#f0fdf4",
      border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`,
      color: isError ? "#dc2626" : "#059669",
      borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center", gap: 8
    }}>
      {isError ? <XCircle size={16} /> : <CheckCircle size={16} />} {toast.msg}
    </div>
  );
}

function ConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
      zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "36px 40px",
        maxWidth: 400, width: "90%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: "#fef2f2",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <AlertTriangle size={26} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Confirmer la suppression</h3>
        <p style={{ color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
          Cette action supprimera l'entreprise et <strong>tous ses utilisateurs associés</strong>. Irréversible.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "10px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer"
          }}>Annuler</button>
          <button onClick={onConfirm} disabled={loading} style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer"
          }}>
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label style={{
        fontSize: 13, fontWeight: 600, color: "#64748b",
        display: "block", marginBottom: 6
      }}>{label} *</label>
      <input name={name} type={type} value={value} onChange={onChange} required placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 10,
          border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
          outline: "none", background: "#fafafa", boxSizing: "border-box",
          transition: "border-color 0.15s"
        }}
        onFocus={e => e.target.style.borderColor = "#0891b2"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );
}

function SectionLabel({ color, children }) {
  return (
    <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
      <p style={{
        fontSize: 12, fontWeight: 700, color,
        textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: 12, borderBottom: "1px solid #f1f5f9", paddingBottom: 8
      }}>{children}</p>
    </div>
  );
}

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [confirmId, setConfirmId]     = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

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
    try { await api.delete(`/admin/entreprises/${id}`); showToast("Entreprise supprimée avec succès"); fetchEntreprises(); }
    catch { showToast("Erreur lors de la suppression", "error"); }
    finally { setDeletingId(null); setConfirmId(null); }
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try {
      await api.post("/admin/entreprise-rh", form);
      showToast("Entreprise et compte RH créés avec succès");
      setForm(emptyForm); setShowForm(false); fetchEntreprises();
    } catch (err) { setFormError(err.response?.data?.message || "Erreur lors de la création"); }
    finally { setFormLoading(false); }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <Toast toast={toast} />
      {confirmId && <ConfirmModal onConfirm={() => handleDelete(confirmId)} onCancel={() => setConfirmId(null)} loading={!!deletingId} />}

      <div style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        <DNavbar />

        <div style={{ padding: "36px 36px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <span style={{
                display: "inline-block", background: "#f0fdfa", color: "#0891b2",
                border: "1px solid #99f6e4", borderRadius: 8, padding: "4px 12px",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", marginBottom: 12
              }}>Gestion</span>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Entreprises</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
                {entreprises.length} entreprise{entreprises.length !== 1 ? "s" : ""} enregistrée{entreprises.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }}
              style={{
                padding: "11px 22px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#b6d7df,#0e7490)",
                color: showForm ? "#475569" : "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: showForm ? "none" : "0 2px 8px rgba(8,145,178,0.3)"
              }}>
              {showForm ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Nouvelle Entreprise</>}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleCreate} style={{
              background: "#fff", borderRadius: 16, padding: 32,
              border: "1px solid #f1f5f9", marginBottom: 28
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>Créer une entreprise + compte RH</h2>

              {formError && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: 10, padding: "12px 16px", color: "#dc2626",
                  fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8
                }}>
                  <XCircle size={14} /> {formError}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <SectionLabel color="#0891b2">Informations de l'entreprise</SectionLabel>
                <FormField label="Nom de l'entreprise" name="nomEntreprise" value={form.nomEntreprise} onChange={onChange} placeholder="Ex: TechCorp" />
                <FormField label="Email de l'entreprise" name="emailEntreprise" type="email" value={form.emailEntreprise} onChange={onChange} placeholder="contact@techcorp.com" />
                <FormField label="Secteur" name="secteur" value={form.secteur} onChange={onChange} placeholder="Ex: Informatique" />

                <SectionLabel color="#059669">Compte Responsable RH</SectionLabel>
                <FormField label="Nom du RH" name="nomRH" value={form.nomRH} onChange={onChange} placeholder="Nom du responsable" />
                <FormField label="Email du RH" name="emailRH" type="email" value={form.emailRH} onChange={onChange} placeholder="rh@company.com" />
                <FormField label="Mot de passe RH" name="passwordRH" type="password" value={form.passwordRH} onChange={onChange} placeholder="••••••••" />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
                <button type="submit" disabled={formLoading}
                  style={{
                    padding: "12px 32px", borderRadius: 12, border: "none",
                    background: "#059669", color: "#fff", fontWeight: 700,
                    fontSize: 14, cursor: "pointer", display: "flex",
                    alignItems: "center", gap: 8,
                    boxShadow: "0 2px 8px rgba(5,150,105,0.3)"
                  }}>
                  <CheckCircle size={16} /> {formLoading ? "Création..." : "Créer l'entreprise"}
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #f1f5f9", overflow: "hidden"
          }}>
            <div style={{
              padding: "18px 28px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Liste des entreprises</h2>
              <button onClick={fetchEntreprises}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                }}>
                <RefreshCw size={14} /> Actualiser
              </button>
            </div>

            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Chargement...</div>
            ) : entreprises.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Aucune entreprise enregistrée</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Entreprise", "Email", "Secteur", "Action"].map(h => (
                      <th key={h} style={{
                        padding: "12px 24px", textAlign: "left", fontSize: 11,
                        fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
                        letterSpacing: "0.06em", borderBottom: "1px solid #f1f5f9"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entreprises.map((ent, i) => (
                    <tr key={ent._id}
                      style={{ borderBottom: i < entreprises.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "#f0fdfa", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontWeight: 700, color: "#0891b2", fontSize: 15
                          }}>
                            {(ent.name || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>{ent.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "#64748b", fontSize: 14 }}>{ent.email}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{
                          background: "#f0fdfa", color: "#0891b2",
                          borderRadius: 8, padding: "4px 12px",
                          fontSize: 12, fontWeight: 600
                        }}>{ent.secteur || "—"}</span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <button onClick={() => setConfirmId(ent._id)}
                          style={{
                            padding: "7px 16px", borderRadius: 8, border: "none",
                            background: "#fef2f2", color: "#ef4444",
                            fontWeight: 600, fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                          <Trash2 size={13} /> Supprimer
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
    </div>
  );
}