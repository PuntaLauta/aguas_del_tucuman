import { useState } from "react";
import { uploadCsv } from "../api/households";

export default function UploadCsv({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("Por favor selecciona un archivo CSV");
    setLoading(true); 
    setMsg("");
    try {
      const res = await uploadCsv(file);
      setMsg(`✅ Importadas: ${res.inserted ?? "?"} registros`);
      onUploaded && onUploaded(res.inserted);
      setFile(null); // Reset file input
    } catch (err) {
      setMsg("❌ Error al subir: " + (err?.response?.data?.error || err.message));
    } finally { 
      setLoading(false); 
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setMsg(""); // Clear previous messages
  };

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fafafa"
    }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>📁 Subir Archivo CSV</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            style={{
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: "white"
            }}
          />
        </div>
        <button 
          disabled={loading || !file} 
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: loading || !file ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading || !file ? "not-allowed" : "pointer",
            fontWeight: "500"
          }}
        >
          {loading ? "⏳ Subiendo..." : "📤 Subir CSV"}
        </button>
        <button 
          type="button" 
          onClick={() => onUploaded && onUploaded()} 
          style={{
            padding: "8px 16px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          🔄 Refrescar
        </button>
      </form>
      {msg && (
        <div style={{
          marginTop: "12px",
          padding: "8px 12px",
          borderRadius: "4px",
          backgroundColor: msg.includes("✅") ? "#dcfce7" : msg.includes("❌") ? "#fee2e2" : "#f3f4f6",
          color: msg.includes("✅") ? "#166534" : msg.includes("❌") ? "#dc2626" : "#374151",
          fontSize: "14px"
        }}>
          {msg}
        </div>
      )}
    </div>
  );
}
