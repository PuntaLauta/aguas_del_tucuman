import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "12px 16px",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <Link 
          to="/" 
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontWeight: "700",
            fontSize: "20px"
          }}
        >
          💧 Aguas del Tucumán
        </Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link 
            to="/" 
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: "500",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "background-color 0.2s"
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
