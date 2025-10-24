export default function HouseholdsTable({ rows = [], total = 0, page = 1, pageSize = 10, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  
  // Asegurar que rows sea un array
  const safeRows = Array.isArray(rows) ? rows : [];
  
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "#fafafa"
    }}>
      <div style={{
        padding: "16px 20px",
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>🏠 Lista de Hogares</h3>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          Mostrando {safeRows.length} de {total} hogares
        </div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <th style={{ 
                padding: "12px 16px", 
                textAlign: "left", 
                fontWeight: "600", 
                color: "#374151",
                borderBottom: "1px solid #e0e0e0"
              }}>
                Barrio
              </th>
              <th style={{ 
                padding: "12px 16px", 
                textAlign: "right", 
                fontWeight: "600", 
                color: "#374151",
                borderBottom: "1px solid #e0e0e0"
              }}>
                Consumo (m³)
              </th>
              <th style={{ 
                padding: "12px 16px", 
                textAlign: "center", 
                fontWeight: "600", 
                color: "#374151",
                borderBottom: "1px solid #e0e0e0"
              }}>
                Estado
              </th>
              <th style={{ 
                padding: "12px 16px", 
                textAlign: "right", 
                fontWeight: "600", 
                color: "#374151",
                borderBottom: "1px solid #e0e0e0"
              }}>
                Deuda
              </th>
              <th style={{ 
                padding: "12px 16px", 
                textAlign: "right", 
                fontWeight: "600", 
                color: "#374151",
                borderBottom: "1px solid #e0e0e0"
              }}>
                Coordenadas
              </th>
            </tr>
          </thead>
          <tbody>
            {safeRows.map((r, i) => {
              const isDebtor = r?.isDebtor ?? r?.is_debtor ?? r?.moroso;
              const consumption = r?.readings?.[0]?.consumptionM3 ?? r?.consumption_m3 ?? 0;
              const amountDue = r?.readings?.[0]?.amountDue ?? r?.totalDebt ?? r?.amount_due ?? 0;
              
              return (
                <tr 
                  key={r?.id || i} 
                  style={{ 
                    borderBottom: "1px solid #f0f0f0",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = "white"}
                >
                  <td style={{ padding: "12px 16px", color: "#1f2937" }}>
                    {r?.neighborhood?.name || r?.barrio || "-"}
                  </td>
                  <td style={{ 
                    padding: "12px 16px", 
                    textAlign: "right", 
                    fontWeight: "500",
                    color: consumption > 50 ? "#dc2626" : "#374151"
                  }}>
                    {consumption || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor: isDebtor ? "#fee2e2" : "#dcfce7",
                      color: isDebtor ? "#dc2626" : "#16a34a"
                    }}>
                      {isDebtor ? "🚨 Moroso" : "✅ Al día"}
                    </span>
                  </td>
                  <td style={{ 
                    padding: "12px 16px", 
                    textAlign: "right",
                    color: amountDue > 0 ? "#dc2626" : "#6b7280",
                    fontWeight: "500"
                  }}>
                    ${amountDue.toLocaleString()}
                  </td>
                  <td style={{ 
                    padding: "12px 16px", 
                    textAlign: "right",
                    fontSize: "12px",
                    color: "#6b7280"
                  }}>
                    {(r?.lat || r?.latitude) && (r?.lng || r?.longitude) ? 
                      `${Number(r?.lat || r?.latitude).toFixed(4)}, ${Number(r?.lng || r?.longitude).toFixed(4)}` : "-"}
                  </td>
                </tr>
              );
            })}
            {safeRows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ 
                  padding: "40px", 
                  textAlign: "center", 
                  color: "#6b7280",
                  fontSize: "16px"
                }}>
                  📊 No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div style={{
          padding: "16px 20px",
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Página {page} de {totalPages}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              disabled={page <= 1} 
              onClick={() => onPageChange?.(page - 1)}
              style={{
                padding: "8px 16px",
                backgroundColor: page <= 1 ? "#f3f4f6" : "#2563eb",
                color: page <= 1 ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                fontWeight: "500"
              }}
            >
              ← Anterior
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => onPageChange?.(page + 1)}
              style={{
                padding: "8px 16px",
                backgroundColor: page >= totalPages ? "#f3f4f6" : "#2563eb",
                color: page >= totalPages ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                fontWeight: "500"
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
