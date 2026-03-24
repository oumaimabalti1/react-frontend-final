import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { User, Mail, KeyRound, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { register } from "services/authService";
import logo from "assets/img/EASYRH.png";

/* Override browser autofill white background */
const autofillFix = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
    box-shadow: 0 0 0 1000px transparent inset !important;
    -webkit-text-fill-color: #fff !important;
    background-color: transparent !important;
    transition: background-color 9999s ease-in-out 0s;
  }
`;

export default function Register() {
  const history = useHistory();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Les mots de passe ne correspondent pas");
    if (form.password.length < 6) return setError("Le mot de passe doit faire au moins 6 caractères");
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      history.push("/auth/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.12)",
    borderRadius: 12, padding: "12px 16px",
    transition: "border-color 0.15s",
  };
  const inputStyle = {
    flex: 1, background: "transparent", border: "none", outline: "none",
    fontSize: 14, color: "#fff", fontFamily: "inherit",
  };
  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase", letterSpacing: "0.06em",
    display: "block", marginBottom: 7,
  };

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwColors  = ["#e2e8f0", "#ef4444", "#f59e0b", "#10b981"];
  const pwLabels  = ["", "Faible", "Moyen", "Fort"];

  return (
    <>
      <style>{autofillFix}</style>
      <div style={{
        minHeight: "100vh", display: "flex",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Blobs */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "rgba(139,92,246,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(37,99,235,0.1)", filter: "blur(70px)", pointerEvents: "none" }} />

        {/* Form panel */}
        <div style={{
          width: "100%", maxWidth: 480,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto", padding: "40px 24px",
          position: "relative", zIndex: 10,
        }}>
          <div style={{ width: "100%" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <img src={logo} alt="EasyRH" style={{ height: 40, margin: "0 auto 20px", display: "block" }} />
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>Créer un compte</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                Rejoignez EasyRH en tant que candidat
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {error && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                  color: "#fca5a5", fontSize: 13,
                }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Nom complet</label>
                <div style={inputWrap}>
                  <User size={16} color="rgba(255,255,255,0.4)" />
                  <input type="text" placeholder="Votre nom" value={form.name} onChange={e => set("name", e.target.value)} required style={inputStyle} autoComplete="name" />
                  {form.name.length > 2 && <CheckCircle size={15} color="#10b981" />}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email</label>
                <div style={inputWrap}>
                  <Mail size={16} color="rgba(255,255,255,0.4)" />
                  <input type="email" placeholder="vous@exemple.com" value={form.email} onChange={e => set("email", e.target.value)} required style={inputStyle} autoComplete="email" />
                  {form.email.includes("@") && <CheckCircle size={15} color="#10b981" />}
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={inputWrap}>
                  <KeyRound size={16} color="rgba(255,255,255,0.4)" />
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} required style={inputStyle} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0 }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password strength */}
              {form.password.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= pwStrength ? pwColors[pwStrength] : "rgba(255,255,255,0.1)", transition: "background 0.2s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: pwColors[pwStrength], fontWeight: 600 }}>{pwLabels[pwStrength]}</span>
                </div>
              )}

              {/* Confirm password */}
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <div style={inputWrap}>
                  <KeyRound size={16} color="rgba(255,255,255,0.4)" />
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••" value={form.confirm} onChange={e => set("confirm", e.target.value)} required style={inputStyle} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0 }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {form.confirm.length > 0 && form.confirm === form.password && <CheckCircle size={15} color="#10b981" />}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
                transition: "all 0.15s", marginBottom: 20,
              }}>
                <UserPlus size={17} />
                {loading ? "Création..." : "Créer mon compte"}
              </button>

              <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                Déjà un compte ?{" "}
                <Link to="/auth/login" style={{ color: "#60a5fa", fontWeight: 700, textDecoration: "none" }}>
                  Se connecter
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}