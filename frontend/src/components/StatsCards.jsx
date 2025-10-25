import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
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

  if (loading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" className="me-2" />
          <span>Cargando estadísticas...</span>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="shadow-sm">
        <Alert.Heading>❌ Error</Alert.Heading>
        {error}
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">📊 Top 5 Consumo por Barrio</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {items.map((x, i) => (
            <Col key={i} md={6} lg={4} xl={2}>
              <Card className="h-100 border-0 bg-light">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <span className="badge bg-primary rounded-circle fs-5" style={{ width: "40px", height: "40px", lineHeight: "40px" }}>
                      #{i + 1}
                    </span>
                  </div>
                  
                  <h6 className="text-muted mb-1">BARRIO</h6>
                  <h5 className="fw-bold text-dark mb-3">
                    {x.barrio || x.name || "-"}
                  </h5>
                  
                  <div>
                    <small className="text-muted">CONSUMO TOTAL (m³)</small>
                    <h4 className="fw-bold text-primary mb-0">
                      {x.total_m3 ?? x.total ?? "-"}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
          
          {items.length === 0 && (
            <Col xs={12}>
              <div className="text-center py-4 text-muted">
                📊 No hay datos de consumo disponibles
              </div>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}