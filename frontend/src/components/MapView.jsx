import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Crear iconos personalizados
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapView({ households = [] }) {
  const center = [-26.83, -65.2]; // Tucumán, Argentina
  
  // Asegurar que households sea un array y filtrar hogares con coordenadas válidas
  const safeHouseholds = Array.isArray(households) ? households : [];
  const validHouseholds = safeHouseholds.filter(h => {
    if (!h) return false;
    const lat = h.latitude || h.lat;
    const lng = h.longitude || h.lng;
    return lat !== null && lat !== undefined && lng !== null && lng !== undefined && 
           !isNaN(Number(lat)) && !isNaN(Number(lng)) && 
           Number(lat) !== 0 && Number(lng) !== 0;
  });
  
  // Contar estadísticas
  const totalHouseholds = validHouseholds.length;
  const debtorHouseholds = validHouseholds.filter(h => h.isDebtor ?? h.is_debtor ?? h.moroso).length;
  const nonDebtorHouseholds = totalHouseholds - debtorHouseholds;

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
        <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>🗺️ Mapa de Hogares</h3>
        <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#6b7280" }}>
          <span>📍 Total: {totalHouseholds}</span>
          <span style={{ color: "#dc2626" }}>🚨 Morosos: {debtorHouseholds}</span>
          <span style={{ color: "#16a34a" }}>✅ Al día: {nonDebtorHouseholds}</span>
        </div>
      </div>
      
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {validHouseholds.map((h, i) => {
            const isDebtor = h.isDebtor ?? h.is_debtor ?? h.moroso;
            const consumption = h.readings?.[0]?.consumptionM3 ?? h.consumption_m3 ?? 0;
            const amountDue = h.readings?.[0]?.amountDue ?? h.totalDebt ?? h.amount_due ?? 0;
            
            
                  // Obtener coordenadas (pueden venir como lat/lng o latitude/longitude)
                  const lat = h.latitude || h.lat;
                  const lng = h.longitude || h.lng;
            
            // Elegir icono basado en el estado
            let icon = greenIcon;
            if (isDebtor) {
              icon = redIcon;
            } else if (consumption > 50) { // Alto consumo
              icon = blueIcon;
            }
            
            return (
              <Marker key={h.id || i} position={[lat, lng]} icon={icon}>
                <Popup>
                  <div style={{ minWidth: "200px" }}>
                    <div style={{ 
                      fontWeight: "700", 
                      fontSize: "16px", 
                      marginBottom: "8px",
                      color: isDebtor ? "#dc2626" : "#16a34a"
                    }}>
                      {h.neighborhood?.name || h.barrio || "Sin barrio"}
                    </div>
                    
                    <div style={{ marginBottom: "6px" }}>
                      <strong>Consumo:</strong> {consumption} m³
                    </div>
                    
                    <div style={{ marginBottom: "6px" }}>
                      <strong>Estado:</strong> 
                      <span style={{ 
                        color: isDebtor ? "#dc2626" : "#16a34a",
                        fontWeight: "600"
                      }}>
                        {isDebtor ? " 🚨 Moroso" : " ✅ Al día"}
                      </span>
                    </div>
                    
                    {amountDue > 0 && (
                      <div style={{ marginBottom: "6px" }}>
                        <strong>Deuda:</strong> ${amountDue.toLocaleString()}
                      </div>
                    )}
                    
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#6b7280", 
                      marginTop: "8px",
                      borderTop: "1px solid #e0e0e0",
                      paddingTop: "6px"
                    }}>
                      📍 {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      {validHouseholds.length === 0 && (
        <div style={{
          padding: "40px",
          textAlign: "center",
          color: "#6b7280"
        }}>
          📍 No hay hogares con coordenadas para mostrar en el mapa
        </div>
      )}
    </div>
  );
}
