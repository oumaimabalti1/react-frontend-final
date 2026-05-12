import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { User, Mail, KeyRound, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle, Shield, BrainCircuit } from "lucide-react";
import { register } from "services/authService";
import logo from "assets/img/EASYRH.png";

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

  const inputStyle = {
    flex: 1, background: "transparent", border: "none", outline: "none",
    fontSize: 14, color: "#0f172a", fontFamily: "inherit",
  };

  const inputWrap = {
    display: "flex", alignItems: "center", gap: 10,
    border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 16px",
    background: "#fafafa", transition: "border-color 0.15s"
  };

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwColors  = ["#e2e8f0", "#ef4444", "#f59e0b", "#10b981"];
  const pwLabels  = ["", "Faible", "Moyen", "Fort"];

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* Left — branding panel */}
      <div style={{
        flex: 1, background: "linear-gradient(160deg, #0e7490, #0891b2, #06b6d4)",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "relative", textAlign: "center", maxWidth: 360 }}>
          <img src={logo} alt="EasyRH" style={{ height: 44, marginBottom: 32, filter: "brightness(10)" }} />
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Rejoignez EasyRH
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40 }}>
            Créez votre compte candidat et accédez à des offres d'emploi avec scoring IA automatique.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 48px", background: "#ffffff", overflowY: "auto"
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Créer un compte</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 28px" }}>
            Rejoignez EasyRH en tant que candidat
          </p>

          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                color: "#dc2626", fontSize: 13
              }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Nom complet</label>
              <div style={inputWrap}
                onFocus={e => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <User size={16} color="#94a3b8" />
                <input type="text" placeholder="Votre nom" value={form.name} onChange={e => set("name", e.target.value)} required style={inputStyle} autoComplete="name" />
                {form.name.length > 2 && <CheckCircle size={15} color="#10b981" />}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Email</label>
              <div style={inputWrap}
                onFocus={e => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <Mail size={16} color="#94a3b8" />
                <input type="email" placeholder="vous@exemple.com" value={form.email} onChange={e => set("email", e.target.value)} required style={inputStyle} autoComplete="email" />
                {form.email.includes("@") && <CheckCircle size={15} color="#10b981" />}
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Mot de passe</label>
              <div style={inputWrap}
                onFocus={e => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <KeyRound size={16} color="#94a3b8" />
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} required style={inputStyle} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= pwStrength ? pwColors[pwStrength] : "#e2e8f0", transition: "background 0.2s" }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: pwColors[pwStrength], fontWeight: 600 }}>{pwLabels[pwStrength]}</span>
              </div>
            )}

            {/* Confirm password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Confirmer le mot de passe</label>
              <div style={inputWrap}
                onFocus={e => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <KeyRound size={16} color="#94a3b8" />
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••" value={form.confirm} onChange={e => set("confirm", e.target.value)} required style={inputStyle} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {form.confirm.length > 0 && form.confirm === form.password && <CheckCircle size={15} color="#10b981" />}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: loading ? "#e2e8f0" : "#0891b2",
              color: loading ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: loading ? "none" : "0 4px 16px rgba(8,145,178,0.3)",
              transition: "all 0.15s", marginBottom: 24
            }}>
              <UserPlus size={17} />
              {loading ? "Création..." : "Créer mon compte"}
            </button>

            <p style={{ textAlign: "center", fontSize: 14, color: "#94a3b8", margin: 0 }}>
              Déjà un compte ?{" "}
              <Link to="/auth/login" style={{ color: "#0891b2", fontWeight: 700, textDecoration: "none" }}>
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}