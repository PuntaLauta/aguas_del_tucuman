import { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { uploadCsv } from "../api/households";

export default function UploadCsv({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await uploadCsv(file);
      setMessage(`✅ Archivo procesado correctamente. ${result.inserted} registros insertados.`);
      setVariant("success");
      setFile(null);
      onUploaded?.();
    } catch (error) {
      console.error("Error al subir CSV:", error);
      setMessage("❌ Error al procesar el archivo CSV. Verifica el formato.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">📁 Subir Archivo CSV</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Seleccionar archivo CSV:</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Formato esperado: id, barrio, lat, lng, period, consumo_m3, moroso, amount_due
            </Form.Text>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={!file || loading}
            className="w-100"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              "📤 Subir y Procesar"
            )}
          </Button>
        </Form>

        {message && (
          <Alert variant={variant} className="mt-3">
            {message}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}