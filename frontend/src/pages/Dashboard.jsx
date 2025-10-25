import { useEffect, useState } from "react";
import { Alert, Button, Row, Col } from "react-bootstrap";
import UploadCsv from "../components/UploadCsv";
import Filters from "../components/Filters";
import StatsCards from "../components/StatsCards";
import MapView from "../components/MapView";
import HouseholdsTable from "../components/HouseholdsTable";
import Loading from "../components/Loading";
import { listNeighborhoods, listHouseholds } from "../api/households";

export default function Dashboard(){
  const [neighs, setNeighs] = useState([]);
  const [filters, setFilters] = useState({ neighborhood: "", debtor: null });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listHouseholds({
        neighborhood: filters.neighborhood || undefined,
        debtor: filters.debtor,
        page, pageSize
      });

      // Asegurar que siempre tengamos arrays válidos
      const safeRows = Array.isArray(res?.rows) ? res.rows : Array.isArray(res) ? res : [];
      const safeTotal = res?.count ?? res?.total ?? safeRows.length;

      setRows(safeRows);
      setTotal(safeTotal);
    } catch (err) {
      console.error('Error al cargar hogares:', err);
      setError('Error al cargar los datos. Verifica que el backend esté funcionando.');
      setRows([]); // Establecer array vacío en caso de error
      setTotal(0);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const refreshAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Recargar barrios
      const neighborhoods = await listNeighborhoods();
      setNeighs(Array.isArray(neighborhoods) ? neighborhoods : []);
      
      // Recargar hogares
      await refetch();
    } catch (err) {
      console.error('Error al refrescar datos:', err);
      setError('Error al refrescar los datos. Verifica que el backend esté funcionando.');
    }
  };

  useEffect(() => {
    (async () => {
      try { 
        const neighborhoods = await listNeighborhoods();
        // Asegurar que sea un array
        setNeighs(Array.isArray(neighborhoods) ? neighborhoods : []); 
      } catch (err) {
        console.error('Error al cargar barrios:', err);
        setNeighs([]); // Establecer array vacío en caso de error
      }
    })();
  }, []);

  useEffect(() => { setPage(1); }, [filters.neighborhood, filters.debtor]);
  useEffect(() => { refetch(); }, [page, filters.neighborhood, filters.debtor]);

  if (initialLoading) {
    return <Loading message="Cargando aplicación..." />;
  }

  if (error) {
    return (
      <Alert variant="danger" className="shadow">
        <Alert.Heading>❌ Error de conexión</Alert.Heading>
        <p>{error}</p>
        <p>Verifica que el backend esté ejecutándose en http://localhost:4001</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-danger"
            onClick={() => {
              setError(null);
              setInitialLoading(true);
              refetch();
            }}
          >
            🔄 Reintentar
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <UploadCsv onUploaded={() => refetch()} />
      </div>
      
      <div className="col-12">
        <Row className="g-3">
          <Col md={8}>
            <Filters neighborhoods={neighs} value={filters} onChange={setFilters} />
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button
              variant="outline-primary"
              onClick={refreshAllData}
              disabled={loading}
              className="w-100"
            >
              🔄 Refrescar Datos
            </Button>
          </Col>
        </Row>
      </div>
      
      <div className="col-12">
        <StatsCards />
      </div>
      
      <div className="col-12">
        {loading ? <Loading message="Cargando datos del mapa..." /> : <MapView households={rows} />}
      </div>
      
      <div className="col-12">
        <HouseholdsTable rows={rows} total={total} page={page} pageSize={pageSize} onPageChange={setPage} />
      </div>
    </div>
  );
}
