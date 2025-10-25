import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, Badge } from "react-bootstrap";
import L from "leaflet";

// Crear iconos personalizados usando iconos por defecto de Leaflet
const greenIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'custom-green-marker'
});

const redIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'custom-red-marker'
});

const blueIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'custom-blue-marker'
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
    <Card className="shadow-sm">
      <Card.Header className="bg-success text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🗺️ Mapa de Hogares</h5>
          <div className="d-flex gap-3">
            <Badge bg="light" text="dark">📍 Total: {totalHouseholds}</Badge>
            <Badge bg="danger">🚨 Morosos: {debtorHouseholds}</Badge>
            <Badge bg="success">✅ Al día: {nonDebtorHouseholds}</Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
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
                      <h6 className={`fw-bold mb-2 ${isDebtor ? 'text-danger' : 'text-success'}`}>
                        {h.neighborhood?.name || h.barrio || "Sin barrio"}
                      </h6>

                      <div className="mb-2">
                        <strong>Consumo:</strong> {consumption} m³
                      </div>

                      <div className="mb-2">
                        <strong>Estado:</strong>
                        <Badge bg={isDebtor ? "danger" : "success"} className="ms-2">
                          {isDebtor ? "🚨 Moroso" : "✅ Al día"}
                        </Badge>
                      </div>

                      {amountDue > 0 && (
                        <div className="mb-2">
                          <strong>Deuda:</strong> ${amountDue.toLocaleString()}
                        </div>
                      )}

                      <small className="text-muted">
                        📍 {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
                      </small>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {validHouseholds.length === 0 && (
          <div className="text-center py-5 text-muted">
            📍 No hay hogares con coordenadas para mostrar en el mapa
          </div>
        )}
      </Card.Body>
    </Card>
  );
}