import { Card, Form, Row, Col, Button } from "react-bootstrap";

export default function Filters({ neighborhoods = [], value = {}, onChange }) {
  const { neighborhood = "", debtor = null } = value;

  // Asegurar que neighborhoods sea un array
  const safeNeighborhoods = Array.isArray(neighborhoods) ? neighborhoods : [];

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <h5 className="mb-0">🔍 Filtros de Búsqueda</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Barrio:</Form.Label>
              <Form.Select
                value={neighborhood}
                onChange={e => onChange?.({ ...value, neighborhood: e.target.value || undefined })}
              >
                <option value="">Todos los barrios</option>
                {safeNeighborhoods.map((n, index) => (
                  <option key={n?.name || n || index} value={n?.name || n || ""}>
                    {n?.name || n || "Sin nombre"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Estado:</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="debtor-filter"
                  checked={debtor === true}
                  onChange={e => onChange?.({ ...value, debtor: e.target.checked ? true : null })}
                  className="me-2"
                />
                <Form.Label htmlFor="debtor-filter" className="mb-0">
                  🚨 Solo morosos
                </Form.Label>
              </div>
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button
              variant="outline-secondary"
              onClick={() => onChange?.({ neighborhood: "", debtor: null })}
              className="w-100"
            >
              🗑️ Limpiar
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}