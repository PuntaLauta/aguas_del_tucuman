import { useEffect, useState } from "react";
import { topConsumption } from "../api/households";

export default function StatsCards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); 
        setError("");
        const data = await topConsumption(5);
        // Asegurar que sea un array y tenga la estructura correcta
        const safeData = Array.isArray(data) ? data : [];
        setItems(safeData);
      } catch (e) {
        console.error('Error en StatsCards:', e);
        setError("No se pudo cargar el top de consumo");
        setItems([]); // Establecer array vacío en caso de error
      } finally { 
        setLoading(false); 
      }
    })();
  }, []);

  if (loading) return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fafafa",
      textAlign: "center"
    }}>
      <div style={{ color: "#6b7280" }}>⏳ Cargando estadísticas...</div>
    </div>
  );
  
  if (error) return (
    <div style={{
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fef2f2",
      color: "#dc2626"
    }}>
      ❌ {error}
    </div>
  );

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fafafa"
    }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>📊 Top 5 Consumo por Barrio</h3>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "16px" 
      }}>
        {items.map((x, i) => (
          <div 
            key={i} 
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "transform 0.2s"
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              marginBottom: "8px"
            }}>
              <span style={{ 
                fontSize: "20px",
                backgroundColor: "#dbeafe",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                #{i + 1}
              </span>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>
                  BARRIO
                </div>
                <div style={{ fontWeight: "700", color: "#1f2937" }}>
                  {x.barrio || x.name || "-"}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>
                CONSUMO TOTAL (m³)
              </div>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                color: "#2563eb",
                marginTop: "4px"
              }}>
                {x.total_m3 ?? x.total ?? "-"}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ 
            gridColumn: "1 / -1", 
            textAlign: "center", 
            color: "#6b7280",
            padding: "20px"
          }}>
            📊 No hay datos de consumo disponibles
          </div>
        )}
      </div>
    </div>
  );
}
