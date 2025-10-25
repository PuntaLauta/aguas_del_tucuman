import { Card, Table, Pagination, Badge, Spinner } from "react-bootstrap";

export default function HouseholdsTable({ rows = [], total = 0, page = 1, pageSize = 10, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Asegurar que rows sea un array
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-warning text-dark">
        <h5 className="mb-0">🏠 Lista de Hogares</h5>
        <small>Mostrando {safeRows.length} de {total} hogares</small>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Barrio</th>
                <th className="text-end">Consumo (m³)</th>
                <th className="text-center">Estado</th>
                <th className="text-end">Deuda</th>
                <th className="text-end">Coordenadas</th>
              </tr>
            </thead>
            <tbody>
              {safeRows.map((r, i) => {
                const isDebtor = r?.isDebtor ?? r?.is_debtor ?? r?.moroso;
                const consumption = r?.readings?.[0]?.consumptionM3 ?? r?.consumption_m3 ?? 0;
                const amountDue = r?.readings?.[0]?.amountDue ?? r?.totalDebt ?? r?.amount_due ?? 0;

                return (
                  <tr key={r?.id || i}>
                    <td className="fw-medium">
                      {r?.neighborhood?.name || r?.barrio || "-"}
                    </td>
                    <td className={`text-end fw-medium ${consumption > 50 ? 'text-danger' : ''}`}>
                      {consumption || "-"}
                    </td>
                    <td className="text-center">
                      <Badge bg={isDebtor ? "danger" : "success"}>
                        {isDebtor ? "🚨 Moroso" : "✅ Al día"}
                      </Badge>
                    </td>
                    <td className={`text-end fw-medium ${amountDue > 0 ? 'text-danger' : 'text-muted'}`}>
                      ${amountDue.toLocaleString()}
                    </td>
                    <td className="text-end text-muted small">
                      {(r?.lat || r?.latitude) && (r?.lng || r?.longitude) ?
                        `${Number(r?.lat || r?.latitude).toFixed(4)}, ${Number(r?.lng || r?.longitude).toFixed(4)}` : "-"}
                    </td>
                  </tr>
                );
              })}
              
              {safeRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    📊 No hay datos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
      
      {totalPages > 1 && (
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Página {page} de {totalPages}
            </small>
            <Pagination size="sm" className="mb-0">
              <Pagination.Prev
                disabled={page <= 1}
                onClick={() => onPageChange?.(page - 1)}
              />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next
                disabled={page >= totalPages}
                onClick={() => onPageChange?.(page + 1)}
              />
            </Pagination>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}