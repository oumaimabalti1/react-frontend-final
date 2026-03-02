import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { User, Mail, Shield, Building2, Briefcase, KeyRound, Pencil, Check, X, LogOut } from "lucide-react";
import api from "services/api";
import { logout } from "services/authService";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: toast.type === "error" ? "#ef4444" : "#10b981",
      color: "#fff", borderRadius: 12, padding: "14px 24px",
      fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {toast.type === "error" ? <X size={16} /> : <Check size={16} />} {toast.msg}
    </div>
  );
}

const roleConfig = {
  RH:       { label: "Responsable RH", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  initial: "RH" },
  employee: { label: "Employé",        color: "#10b981", bg: "rgba(16,185,129,0.1)",  initial: "EMP" },
  candidat: { label: "Candidat",       color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  initial: "C" },
  admin:    { label: "Administrateur", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  initial: "AD" },
};

const homeByRole = {
  RH:       "/hr/accueil",
  employee: "/employee/accueil",
  candidat: "/candidat/accueil",
  admin:    "/admin/dashboard",
};

export default function Profile() {
  const history = useHistory();
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);

  // Edit info
  const [editMode, setEditMode]   = useState(false);
  const [form, setForm]           = useState({ name: "", email: "" });
  const [saving, setSaving]       = useState(false);

  // Change password
  const [pwForm, setPwForm]       = useState({ oldpassword: "", newpassword: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError]     = useState("");

  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get("/auth/profile")
      .then(res => {
        setUser(res.data.user);
        setForm({ name: res.data.user.name, email: res.data.user.email });
      })
      .catch(() => showToast("Erreur chargement profil", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      setUser(res.data.user);
      setEditMode(false);
      showToast("Profil mis à jour !");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur mise à jour", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newpassword !== pwForm.confirm) {
      setPwError("Les mots de passe ne correspondent pas");
      return;
    }
    if (pwForm.newpassword.length < 6) {
      setPwError("Le mot de passe doit faire au moins 6 caractères");
      return;
    }
    setPwLoading(true);
    try {
      await api.put("/auth/changepassword", {
        oldpassword: pwForm.oldpassword,
        newpassword: pwForm.newpassword,
      });
      setPwForm({ oldpassword: "", newpassword: "", confirm: "" });
      showToast("Mot de passe changé avec succès !");
    } catch (err) {
      setPwError(err.response?.data?.message || "Erreur changement mot de passe");
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/auth/login");
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

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#94a3b8", fontSize: 16 }}>Chargement...</div>
    </div>
  );

  const role = roleConfig[user?.role] || roleConfig.candidat;
  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || role.initial;

  return (
    <>
      <Toast toast={toast} />

      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        height: 64, display: "flex", alignItems: "center",
        padding: "0 24px", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        <button onClick={() => history.push(homeByRole[user?.role] || "/")} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.6)",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
        >
          ← Retour
        </button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Mon Profil</span>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 13px", borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(239,68,68,0.08)", color: "rgba(255,255,255,0.55)",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.22)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

          {/* Avatar card */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            borderRadius: 20, padding: "36px 32px",
            display: "flex", alignItems: "center", gap: 24,
            marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            flexWrap: "wrap",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: role.bg, border: `2px solid ${role.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: role.color, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>
                {user?.name}
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {user?.email}
              </p>
              <span style={{
                display: "inline-block", marginTop: 10,
                background: role.bg, color: role.color,
                borderRadius: 20, padding: "4px 14px",
                fontSize: 12, fontWeight: 700, border: `1px solid ${role.color}30`,
              }}>
                {role.label}
              </span>
            </div>
          </div>

          {/* Info card */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: "28px 32px",
            boxShadow: "0 2px 16px rgba(30,60,120,0.07)", marginBottom: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <User size={17} color="#3b82f6" /> Informations personnelles
              </h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 8,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  <Pencil size={13} /> Modifier
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditMode(false); setForm({ name: user.name, email: user.email }); }} style={{
                    padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0",
                    background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <X size={13} /> Annuler
                  </button>
                  <button onClick={handleSaveInfo} disabled={saving} style={{
                    padding: "7px 14px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Check size={13} /> {saving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Nom complet</label>
                {editMode ? (
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Votre nom" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
                    <User size={15} color="#94a3b8" />
                    <span style={{ fontSize: 14, color: "#1a2340", fontWeight: 500 }}>{user?.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                {editMode ? (
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="Votre email" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
                    <Mail size={15} color="#94a3b8" />
                    <span style={{ fontSize: 14, color: "#1a2340", fontWeight: 500 }}>{user?.email}</span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label style={labelStyle}>Rôle</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
                  <Shield size={15} color="#94a3b8" />
                  <span style={{ fontSize: 14, color: role.color, fontWeight: 600 }}>{role.label}</span>
                </div>
              </div>

              {/* Entreprise (if exists) */}
              {user?.entrepriseId && (
                <div>
                  <label style={labelStyle}>Entreprise</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
                    <Building2 size={15} color="#94a3b8" />
                    <span style={{ fontSize: 14, color: "#1a2340", fontWeight: 500 }}>{user.entrepriseId?.nom || "—"}</span>
                  </div>
                </div>
              )}

              {/* Département (if exists) */}
              {user?.departement && (
                <div>
                  <label style={labelStyle}>Département</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
                    <Briefcase size={15} color="#94a3b8" />
                    <span style={{ fontSize: 14, color: "#1a2340", fontWeight: 500 }}>{user.departement}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change password card */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: "28px 32px",
            boxShadow: "0 2px 16px rgba(30,60,120,0.07)",
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: "0 0 24px", display: "flex", alignItems: "center", gap: 8 }}>
              <KeyRound size={17} color="#3b82f6" /> Changer le mot de passe
            </h2>

            {pwError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <X size={14} /> {pwError}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Mot de passe actuel *</label>
                  <input type="password" value={pwForm.oldpassword} onChange={e => setPwForm({ ...pwForm, oldpassword: e.target.value })} required style={inputStyle} placeholder="••••••••" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Nouveau mot de passe *</label>
                    <input type="password" value={pwForm.newpassword} onChange={e => setPwForm({ ...pwForm, newpassword: e.target.value })} required style={inputStyle} placeholder="••••••••" />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirmer *</label>
                    <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required style={inputStyle} placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button type="submit" disabled={pwLoading} style={{
                  padding: "11px 28px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                }}>
                  <KeyRound size={15} />
                  {pwLoading ? "Changement..." : "Changer le mot de passe"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </>
  );
}