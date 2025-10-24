export default function Filters({ neighborhoods = [], value = {}, onChange }) {
  const { neighborhood = "", debtor = null } = value;
  
  // Asegurar que neighborhoods sea un array
  const safeNeighborhoods = Array.isArray(neighborhoods) ? neighborhoods : [];
  
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fafafa"
    }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>🔍 Filtros</h3>
      <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
            Barrio:
          </label>
          <select 
            value={neighborhood} 
            onChange={e => onChange?.({ ...value, neighborhood: e.target.value || undefined })}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: "white",
              minWidth: "200px"
            }}
          >
            <option value="">Todos los barrios</option>
            {safeNeighborhoods.map((n, index) => (
              <option key={n?.name || n || index} value={n?.name || n || ""}>
                {n?.name || n || "Sin nombre"}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id="debtor-filter"
            checked={debtor === true}
            onChange={e => onChange?.({ ...value, debtor: e.target.checked ? true : null })}
            style={{ transform: "scale(1.2)" }}
          />
          <label 
            htmlFor="debtor-filter" 
            style={{ 
              fontSize: "14px", 
              fontWeight: "500", 
              color: "#374151",
              cursor: "pointer"
            }}
          >
            🚨 Solo morosos
          </label>
        </div>
        
        <button
          onClick={() => onChange?.({ neighborhood: "", debtor: null })}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px"
          }}
        >
          🗑️ Limpiar filtros
        </button>
      </div>
    </div>
  );
}
