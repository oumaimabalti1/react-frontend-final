import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Mail, KeyRound, LogIn, Eye, EyeOff, AlertCircle, Shield, BrainCircuit } from "lucide-react";
import { login } from "services/authService";
import logo from "assets/img/EASYRH.png";

export default function Login() {
  const history = useHistory();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(credentials);
      const role = data.user.role;
      if (role === "RH")           history.push("/hr/accueilH");
      else if (role === "employee") history.push("/employee/accueilE");
      else if (role === "candidat") history.push("/candidat/accueil");
      else if (role === "admin")    history.push("/admin/dashboard");
      else history.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    flex: 1, background: "transparent", border: "none", outline: "none",
    fontSize: 14, color: "#0f172a", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* Left — branding panel */}
      <div style={{
        flex: 1, background: "linear-gradient(135deg,#b6d7df,#0e7490)",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden"
      }}>
       
        

        <div style={{ position: "relative", textAlign: "center", maxWidth: 360 }}>
          <img src={logo} alt="EasyRH" style={{ height: 44, marginBottom: 32, filter: "brightness(10)" }} />
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Bienvenue sur EasyRH
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40 }}>
            La plateforme RH intelligente qui simplifie le recrutement, les congés et les plaintes.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 48px", background: "#ffffff"
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Connexion</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 32px" }}>
            Entrez vos identifiants pour accéder à votre espace
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

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Email</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 16px",
                background: "#fafafa", transition: "border-color 0.15s"
              }}
                onFocus={e => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <Mail size={16} color="#94a3b8" />
                <input
                  type="email" name="email" placeholder="vous@exemple.com"
                  value={credentials.email} onChange={handleChange} required
                  style={inputStyle} autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Mot de passe</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 16px",
                background: "#fafafa", transition: "border-color 0.15s"
              }}
                onFocus={e => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <KeyRound size={16} color="#94a3b8" />
                <input
                  type={showPw ? "text" : "password"} name="password" placeholder="••••••••"
                  value={credentials.password} onChange={handleChange} required
                  style={inputStyle} autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: loading ? "#e2e8f0" : "linear-gradient(135deg,#b6d7df,#0e7490)",
              color: loading ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: loading ? "none" : "0 4px 16px rgba(8,145,178,0.3)",
              transition: "all 0.15s", marginBottom: 24
            }}>
              <LogIn size={17} />
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <p style={{ textAlign: "center", fontSize: 14, color: "#94a3b8", margin: 0 }}>
              Pas encore de compte ?{" "}
              <Link to="/auth/register" style={{ color: "#0891b2", fontWeight: 700, textDecoration: "none" }}>
                S'inscrire
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}