import { useEffect, useState } from "react";
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
      <div style={{
        padding: '20px',
        border: '1px solid #dc2626',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        margin: '20px'
      }}>
        <h3>❌ Error de conexión</h3>
        <p>{error}</p>
        <p>Verifica que el backend esté ejecutándose en http://localhost:4001</p>
        <button 
          onClick={() => {
            setError(null);
            setInitialLoading(true);
            refetch();
          }}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <UploadCsv onUploaded={() => refetch()} />
      <Filters neighborhoods={neighs} value={filters} onChange={setFilters} />
      
      {/* Debug info temporal */}
      <div style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#f8fafc",
        fontSize: "12px"
      }}>
        <h4 style={{ margin: "0 0 8px 0" }}>🔍 Debug Info:</h4>
        <div>Barrios cargados: {neighs.length}</div>
        <div>Hogares cargados: {rows.length}</div>
        <div>Total: {total}</div>
        <div>Página: {page}</div>
        <div>Filtros: {JSON.stringify(filters)}</div>
        <button 
          onClick={() => {
            console.log('Barrios:', neighs);
            console.log('Hogares:', rows);
            refetch();
          }}
          style={{
            marginTop: "8px",
            padding: "4px 8px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          🔄 Debug & Refetch
        </button>
      </div>
      
      <StatsCards />
      {loading ? <Loading message="Cargando datos del mapa..." /> : <MapView households={rows} />}
      <HouseholdsTable rows={rows} total={total} page={page} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
