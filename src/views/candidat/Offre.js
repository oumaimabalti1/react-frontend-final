import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "components/Navbars/CNavbar.js";
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

export default function Offre() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  // CV state
  const [existingCV, setExistingCV] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // Apply state
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get("/candidat/offres")
      .then(res => setOffres(res.data.offres || []))
      .catch(() => showToast("Erreur chargement des offres", "error"))
      .finally(() => setLoading(false));
  }, []);

  const openModal = async (offre) => {
    setSelected(offre);
    setCvFile(null);
    setCvUploaded(false);
    setApplied(false);
    try {
      const res = await api.get("/candidat/cv");
      setExistingCV(res.data.cv);
    } catch {
      setExistingCV(null);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setExistingCV(null);
    setCvFile(null);
    setCvUploaded(false);
    setApplied(false);
  };

  const handleCVSelect = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Seuls les fichiers PDF sont acceptés", "error");
      return;
    }
    setCvFile(file);
  };

  const handleUploadCV = async () => {
    if (!cvFile) return;
    setUploadingCV(true);
    const formData = new FormData();
    formData.append("cv", cvFile);
    try {
      const res = await api.post("/candidat/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExistingCV(res.data.cv);
      setCvUploaded(true);
      showToast("CV uploadé avec succès !");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur upload CV", "error");
    } finally {
      setUploadingCV(false);
    }
  };

  const handlePostuler = async () => {
    if (!existingCV && !cvUploaded) {
      showToast("Veuillez d'abord uploader votre CV", "error");
      return;
    }
    setApplying(true);
    try {
      await api.post("/candidat/candidatures", { offreId: selected._id });
      setApplied(true);
      showToast("Candidature envoyée avec succès !");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la candidature", "error");
    } finally {
      setApplying(false);
    }
  };

  const hasCV = existingCV || cvUploaded;

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {/* MODAL */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, width: "100%", maxWidth: 620,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)", position: "relative",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <button onClick={closeModal} style={{
              position: "absolute", top: 16, right: 16,
              background: "#f1f5f9", border: "none", borderRadius: 8,
              width: 32, height: 32, cursor: "pointer", fontSize: 16, zIndex: 1,
            }}>✕</button>

            {applied ? (
              /* SUCCESS */
              <div style={{ padding: "60px 40px", textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2340", marginBottom: 8 }}>
                  Candidature envoyée !
                </h2>
                <p style={{ color: "#6b7280", marginBottom: 28 }}>
                  Votre candidature pour <strong>{selected.titre}</strong> a été soumise avec succès.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button onClick={closeModal} style={{
                    padding: "11px 24px", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer",
                  }}>
                    Continuer à chercher
                  </button>
                  <Link to="/candidat/applications" style={{
                    padding: "11px 24px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff", fontWeight: 600, textDecoration: "none",
                  }}>
                    Mes candidatures →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* OFFRE DETAILS */}
                <div style={{ padding: "36px 40px 24px" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "#eff6ff", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 16,
                  }}>💼</div>

                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2340", marginBottom: 8 }}>
                    {selected.titre}
                  </h2>

                  <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    {selected.entrepriseId?.nom && (
                      <span style={{ background: "#f0fdf4", color: "#059669", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
                        🏢 {selected.entrepriseId.nom}
                      </span>
                    )}
                    {selected.entrepriseId?.secteur && (
                      <span style={{ background: "#eff6ff", color: "#3b82f6", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
                        {selected.entrepriseId.secteur}
                      </span>
                    )}
                    {selected.entrepriseId?.email && (
                      <span style={{ background: "#f8fafc", color: "#6b7280", borderRadius: 20, padding: "4px 12px", fontSize: 13 }}>
                        ✉️ {selected.entrepriseId.email}
                      </span>
                    )}
                  </div>

                  <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px 20px" }}>
                    <p style={{ color: "#374151", lineHeight: 1.7, fontSize: 15, margin: 0 }}>
                      {selected.description}
                    </p>
                  </div>
                </div>

                <div style={{ height: 1, background: "#f0f2f8", margin: "0 40px" }} />

                {/* CV SECTION */}
                <div style={{ padding: "24px 40px 36px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 4 }}>
                    📄 Votre CV
                  </h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
                    Un CV est requis pour postuler
                  </p>

                  {/* Existing CV badge */}
                  {existingCV && !cvFile && (
                    <div style={{
                      background: "#f0fdf4", border: "1.5px solid #86efac",
                      borderRadius: 12, padding: "14px 18px",
                      display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
                    }}>
                      <span style={{ fontSize: 20 }}>✅</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#059669", margin: 0 }}>CV existant détecté</p>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{existingCV.fichier}</p>
                      </div>
                      <button onClick={() => fileRef.current.click()} style={{
                        padding: "6px 12px", borderRadius: 8,
                        border: "1px solid #86efac", background: "#fff",
                        color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>
                        Remplacer
                      </button>
                    </div>
                  )}

                  {/* New file selected */}
                  {cvFile && (
                    <div style={{
                      border: "1.5px solid #3b82f6", borderRadius: 12,
                      padding: "16px 20px", background: "#eff6ff",
                      display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
                    }}>
                      <span style={{ fontSize: 24 }}>📄</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1a2340", margin: 0 }}>{cvFile.name}</p>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{(cvFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={() => setCvFile(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 18 }}>✕</button>
                    </div>
                  )}

                  {/* Drop zone — show if no CV at all */}
                  {!existingCV && !cvFile && (
                    <div
                      onClick={() => fileRef.current.click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleCVSelect(e.dataTransfer.files[0]); }}
                      style={{
                        border: `2px dashed ${dragOver ? "#2563eb" : "#cbd5e1"}`,
                        borderRadius: 12, padding: "28px 20px",
                        textAlign: "center", cursor: "pointer",
                        background: dragOver ? "#eff6ff" : "#f8fafc",
                        transition: "all 0.2s", marginBottom: 16,
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: 0 }}>Glissez votre CV ici</p>
                      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>ou cliquez pour sélectionner un PDF</p>
                    </div>
                  )}

                  <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }}
                    onChange={e => handleCVSelect(e.target.files[0])} />

                  {/* Upload confirm button */}
                  {cvFile && !cvUploaded && (
                    <button onClick={handleUploadCV} disabled={uploadingCV} style={{
                      width: "100%", padding: "11px", borderRadius: 12, border: "none",
                      background: uploadingCV ? "#94a3b8" : "linear-gradient(135deg, #0891b2, #0e7490)",
                      color: "#fff", fontWeight: 700, fontSize: 14,
                      cursor: uploadingCV ? "not-allowed" : "pointer", marginBottom: 12,
                    }}>
                      {uploadingCV ? "Upload en cours..." : "⬆️ Confirmer l'upload du CV"}
                    </button>
                  )}

                  {/* Postuler button */}
                  <button onClick={handlePostuler} disabled={!hasCV || applying} style={{
                    width: "100%", padding: "13px", borderRadius: 12, border: "none",
                    background: hasCV ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#e2e8f0",
                    color: hasCV ? "#fff" : "#94a3b8",
                    fontWeight: 700, fontSize: 15,
                    cursor: hasCV && !applying ? "pointer" : "not-allowed",
                    boxShadow: hasCV ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
                    transition: "all 0.2s",
                  }}>
                    {applying ? "Envoi en cours..." : hasCV ? "🚀 Postuler maintenant" : "Uploadez votre CV pour postuler"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PAGE */}
      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a2340", margin: 0 }}>Offres d'emploi</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
                {offres.length} offre{offres.length !== 1 ? "s" : ""} disponible{offres.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link to="/candidat/applications" style={{
              padding: "10px 20px", borderRadius: 10,
              border: "2px solid #1a2340", color: "#1a2340",
              fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>
              Mes candidatures →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, height: 200, opacity: 0.5 }} />
              ))}
            </div>
          ) : offres.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p>Aucune offre disponible pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {offres.map(offre => (
                <div key={offre._id} style={{
                  background: "#fff", borderRadius: 16, padding: "24px",
                  boxShadow: "0 2px 16px rgba(30,60,120,0.07)",
                  display: "flex", flexDirection: "column", gap: 12,
                  transition: "transform 0.18s, box-shadow 0.18s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(30,60,120,0.13)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(30,60,120,0.07)"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💼</div>

                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>{offre.titre}</h3>
                    {offre.entrepriseId?.nom && (
                      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>🏢 {offre.entrepriseId.nom}</p>
                    )}
                  </div>

                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {offre.description}
                  </p>

                  {offre.entrepriseId?.secteur && (
                    <span style={{ alignSelf: "flex-start", background: "#eff6ff", color: "#3b82f6", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
                      {offre.entrepriseId.secteur}
                    </span>
                  )}

                  <button onClick={() => openModal(offre)} style={{
                    marginTop: "auto", padding: "10px", borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}>
                    Voir & Postuler →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}