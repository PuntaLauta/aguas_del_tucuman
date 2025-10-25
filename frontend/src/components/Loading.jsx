import { Spinner } from "react-bootstrap";

export default function Loading({ message = "Cargando..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" className="mb-3" />
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}