import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { User, KeyRound, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
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

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Blobs */}
      <div style={{ position: "absolute", top: -120, left: -120, width: 500, height: 500, borderRadius: "50%", background: "rgba(37,99,235,0.12)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(124,58,237,0.1)", filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Left panel — branding */}
      <div style={{
        flex: 1, display: "none", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 48, position: "relative",
      }} className="lg-panel">
        <img src={logo} alt="EasyRH" style={{ height: 52, marginBottom: 32 }} />
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 14px", textAlign: "center", lineHeight: 1.2 }}>
          La RH Moderne,{" "}
          <span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Simplifiée
          </span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, textAlign: "center", maxWidth: 320, lineHeight: 1.7 }}>
          Gérez vos talents, suivez les performances et pilotez vos processus RH.
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: "100%", maxWidth: 460,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto", padding: "40px 24px",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ width: "100%" }}>

          {/* Logo mobile */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src={logo} alt="EasyRH" style={{ height: 40, margin: "0 auto 20px", display: "block" }} />
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
              Connexion
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Entrez vos identifiants pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Error */}
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

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 7 }}>
                Email
              </label>
              <div style={inputWrap}
                onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
              >
                <User size={16} color="rgba(255,255,255,0.4)" />
                <input type="email" name="email" placeholder="vous@exemple.com" value={credentials.email} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 7 }}>
                Mot de passe
              </label>
              <div style={inputWrap}>
                <KeyRound size={16} color="rgba(255,255,255,0.4)" />
                <input type={showPw ? "text" : "password"} name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required style={inputStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.4)",
              transition: "all 0.15s", marginBottom: 20,
            }}>
              <LogIn size={17} />
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            {/* Register link */}
            <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Pas encore de compte ?{" "}
              <Link to="/auth/register" style={{ color: "#60a5fa", fontWeight: 700, textDecoration: "none" }}>
                S'inscrire
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}