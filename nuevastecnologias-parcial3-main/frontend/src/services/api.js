const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || 'Error en la petición');
  }
  return response.json();
};

// ==================== CLIENTES ====================
export const clientesAPI = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/clientes`);
    return handleResponse(response);
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`);
    return handleResponse(response);
  },

  buscar: async (termino) => {
    const response = await fetch(`${API_URL}/clientes/buscar/${termino}`);
    return handleResponse(response);
  },

  crear: async (cliente) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    return handleResponse(response);
  },

  actualizar: async (id, cliente) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    return handleResponse(response);
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ==================== SERVICIOS ====================
export const serviciosAPI = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/servicios`);
    return handleResponse(response);
  },

  obtenerActivos: async () => {
    const response = await fetch(`${API_URL}/servicios/activos`);
    return handleResponse(response);
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_URL}/servicios/${id}`);
    return handleResponse(response);
  },

  crear: async (servicio) => {
    const response = await fetch(`${API_URL}/servicios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    });
    return handleResponse(response);
  },

  actualizar: async (id, servicio) => {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    });
    return handleResponse(response);
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ==================== CITAS ====================
export const citasAPI = {
  obtenerTodas: async () => {
    const response = await fetch(`${API_URL}/citas`);
    return handleResponse(response);
  },

  obtenerHoy: async () => {
    const response = await fetch(`${API_URL}/citas/hoy`);
    return handleResponse(response);
  },

  obtenerPorFecha: async (fecha) => {
    const response = await fetch(`${API_URL}/citas/fecha/${fecha}`);
    return handleResponse(response);
  },

  obtenerPorCliente: async (clienteId) => {
    const response = await fetch(`${API_URL}/citas/cliente/${clienteId}`);
    return handleResponse(response);
  },

  verificarDisponibilidad: async (datos) => {
    const response = await fetch(`${API_URL}/citas/verificar-disponibilidad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return handleResponse(response);
  },

  crear: async (cita) => {
    const response = await fetch(`${API_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita)
    });
    return handleResponse(response);
  },

  actualizar: async (id, cita) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita)
    });
    return handleResponse(response);
  },

  cancelar: async (id) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ==================== PAGOS ====================
export const pagosAPI = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/pagos`);
    return handleResponse(response);
  },

  obtenerPorRango: async (inicio, fin) => {
    const response = await fetch(`${API_URL}/pagos/rango/${inicio}/${fin}`);
    return handleResponse(response);
  },

  registrar: async (pago) => {
    const response = await fetch(`${API_URL}/pagos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pago)
    });
    return handleResponse(response);
  }
};

// ==================== REPORTES ====================
export const reportesAPI = {
  obtenerDashboard: async () => {
    const response = await fetch(`${API_URL}/reportes/dashboard`);
    return handleResponse(response);
  },

  obtenerIngresos: async (inicio, fin) => {
    const response = await fetch(`${API_URL}/reportes/ingresos/${inicio}/${fin}`);
    return handleResponse(response);
  },

  obtenerServiciosPopulares: async (inicio, fin) => {
    const response = await fetch(`${API_URL}/reportes/servicios-populares/${inicio}/${fin}`);
    return handleResponse(response);
  },

  obtenerClientesFrecuentes: async () => {
    const response = await fetch(`${API_URL}/reportes/clientes-frecuentes`);
    return handleResponse(response);
  }
};
