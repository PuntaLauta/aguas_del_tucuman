import api from "./client";

export async function listNeighborhoods() {
  try {
    const { data } = await api.get("/neighborhoods");
    console.log('Respuesta del backend para neighborhoods:', data);
    
    // Manejar la estructura del backend: { success: true, data: { neighborhoods: [...] } }
    if (data && data.success && data.data && data.data.neighborhoods) {
      return data.data.neighborhoods;
    }
    
    // Asegurar que devolvemos un array
    if (Array.isArray(data)) {
      return data;
    }
    
    // Si la respuesta tiene una estructura diferente
    if (data && data.rows && Array.isArray(data.rows)) {
      return data.rows;
    }
    
    // Fallback: devolver array vacío
    return [];
  } catch (error) {
    console.error('Error al obtener barrios:', error);
    return [];
  }
}

export async function listHouseholds({ neighborhood, debtor, page=1, pageSize=10 } = {}) {
  const params = {};
  if (neighborhood) params.neighborhood = neighborhood;
  if (debtor === true) params.debtor = true;
  if (debtor === false) params.debtor = false;
  
  // Convertir paginación de page/pageSize a limit/offset
  params.limit = pageSize;
  params.offset = (page - 1) * pageSize;
  
  try {
    const { data } = await api.get("/households", { params });
    console.log('Respuesta del backend para households:', data);
    
    // Manejar la estructura del backend: { success: true, data: { households: [...], total: ... } }
    if (data && data.success && data.data) {
      const backendData = data.data;
      if (backendData.households && Array.isArray(backendData.households)) {
        return {
          rows: backendData.households,
          count: backendData.total || backendData.households.length,
          total: backendData.total || backendData.households.length
        };
      }
    }
    
    // Manejar diferentes formatos de respuesta del backend (fallback)
    if (data && typeof data === 'object') {
      // Si la respuesta tiene rows y count
      if (data.rows && Array.isArray(data.rows)) {
        return {
          rows: data.rows,
          count: data.count || data.rows.length,
          total: data.count || data.rows.length
        };
      }
      // Si la respuesta es directamente un array
      if (Array.isArray(data)) {
        return {
          rows: data,
          count: data.length,
          total: data.length
        };
      }
    }
    
    // Fallback: devolver estructura vacía
    console.warn('Formato de respuesta no reconocido:', data);
    return {
      rows: [],
      count: 0,
      total: 0
    };
  } catch (error) {
    console.error('Error al obtener hogares:', error);
    throw error;
  }
}

export async function uploadCsv(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" }});
  return data; // { ok, inserted }
}

export async function topConsumption(limit=5) {
  const { data } = await api.get("/stats/top-consumption", { params: { limit } });
  return data;
}
