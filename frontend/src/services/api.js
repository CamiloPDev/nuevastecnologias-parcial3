const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Función para obtener el token
const getToken = () => {
  return localStorage.getItem('token');
};

// Función para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || error.msg || 'Error en la petición');
  }
  return response.json();
};

// ==================== CLIENTES ====================
export const clientesAPI = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/clientes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  buscar: async (termino) => {
    const response = await fetch(`${API_URL}/clientes/buscar?q=${termino}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  crear: async (cliente) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cliente)
    });
    return handleResponse(response);
  },

  actualizar: async (id, cliente) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cliente)
    });
    return handleResponse(response);
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== SERVICIOS ====================
export const serviciosAPI = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/servicios`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerActivos: async () => {
    const response = await fetch(`${API_URL}/servicios/activos`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  crear: async (servicio) => {
    const response = await fetch(`${API_URL}/servicios`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(servicio)
    });
    return handleResponse(response);
  },

  actualizar: async (id, servicio) => {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(servicio)
    });
    return handleResponse(response);
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== CITAS ====================
export const citasAPI = {
  obtenerTodas: async () => {
    const response = await fetch(`${API_URL}/citas`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerHoy: async () => {
    const response = await fetch(`${API_URL}/citas/hoy`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerPorFecha: async (fecha) => {
    const response = await fetch(`${API_URL}/citas/dia/${fecha}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerPorCliente: async (clienteId) => {
    const response = await fetch(`${API_URL}/citas/historial/${clienteId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  verificarDisponibilidad: async (datos) => {
    const response = await fetch(`${API_URL}/citas/verificar-disponibilidad`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(datos)
    });
    return handleResponse(response);
  },

  crear: async (cita) => {
    const response = await fetch(`${API_URL}/citas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cita)
    });
    return handleResponse(response);
  },

  actualizar: async (id, cita) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cita)
    });
    return handleResponse(response);
  },

  cancelar: async (id) => {
    const response = await fetch(`${API_URL}/citas/${id}/cancelar`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== PAGOS ====================
export const pagosAPI = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/pagos`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerPorRango: async (inicio, fin) => {
    const response = await fetch(`${API_URL}/pagos/rango/${inicio}/${fin}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  registrar: async (pago) => {
    const response = await fetch(`${API_URL}/pagos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pago)
    });
    return handleResponse(response);
  }
};

// ==================== REPORTES ====================
export const reportesAPI = {
  obtenerDashboard: async () => {
    const response = await fetch(`${API_URL}/reportes/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerIngresos: async (inicio, fin) => {
    const response = await fetch(`${API_URL}/reportes/ingresos/${inicio}/${fin}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerServiciosPopulares: async (inicio, fin) => {
    const response = await fetch(`${API_URL}/reportes/servicios-populares/${inicio}/${fin}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  obtenerClientesFrecuentes: async () => {
    const response = await fetch(`${API_URL}/reportes/clientes-frecuentes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== AUTENTICACIÓN ====================
export const authAPI = {
  login: async (correo, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });
    return handleResponse(response);
  },

  verify: async () => {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
