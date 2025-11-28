import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { citasAPI, clientesAPI, serviciosAPI } from '../services/api';

function GestionCitas() {
  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaEditar, setCitaEditar] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    cliente: '',
    administrador: '674a1b2c3d4e5f6g7h8i9j0k', // ID temporal del admin
    servicios: [],
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    estado: 'pendiente',
    notas: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [fechaFiltro]);

  const cargarDatos = async () => {
    try {
      const [citasData, clientesData, serviciosData] = await Promise.all([
        citasAPI.obtenerPorFecha(fechaFiltro),
        clientesAPI.obtenerTodos(),
        serviciosAPI.obtenerActivos()
      ]);
      setCitas(citasData);
      setClientes(clientesData);
      setServicios(serviciosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const abrirModal = (cita = null) => {
    if (cita) {
      setCitaEditar(cita);
      setFormData({
        ...cita,
        servicios: cita.servicios.map(s => s.servicio),
        fecha: new Date(cita.fecha).toISOString().split('T')[0]
      });
    } else {
      setCitaEditar(null);
      setFormData({
        cliente: '',
        administrador: '674a1b2c3d4e5f6g7h8i9j0k',
        servicios: [],
        fecha: fechaFiltro,
        hora: '',
        estado: 'pendiente',
        notas: ''
      });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCitaEditar(null);
  };

  const calcularDuracionTotal = () => {
    return formData.servicios.reduce((total, servicioId) => {
      const servicio = servicios.find(s => s._id === servicioId);
      return total + (servicio ? servicio.duracion : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.servicios.length === 0) {
      alert('Debes seleccionar al menos un servicio');
      return;
    }

    try {
      // Verificar disponibilidad
      const duracionTotal = calcularDuracionTotal();
      const disponibilidad = await citasAPI.verificarDisponibilidad({
        fecha: formData.fecha,
        hora: formData.hora,
        duracionTotal,
        citaId: citaEditar?._id
      });

      if (!disponibilidad.disponible) {
        alert('El horario seleccionado no está disponible. Por favor elige otro horario.');
        return;
      }

      if (citaEditar) {
        await citasAPI.actualizar(citaEditar._id, formData);
        alert('Cita actualizada exitosamente');
      } else {
        await citasAPI.crear(formData);
        alert('Cita creada exitosamente');
      }
      cerrarModal();
      cargarDatos();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const cancelarCita = async (id) => {
    if (!window.confirm('¿Cancelar esta cita?')) return;
    try {
      await citasAPI.cancelar(id);
      alert('Cita cancelada');
      cargarDatos();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await citasAPI.actualizar(id, { estado: nuevoEstado });
      cargarDatos();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const formatearEstado = (estado) => {
    const estados = {
      'pendiente': 'Pendiente',
      'en_curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado] || estado;
  };

  const colorEstado = (estado) => {
    const colores = {
      'pendiente': { bg: '#fff4e6', color: '#f59e0b' },
      'en_curso': { bg: '#e0f2fe', color: '#0284c7' },
      'completada': { bg: '#e2ffe8', color: '#58bb7b' },
      'cancelada': { bg: '#fee2e2', color: '#dc2626' }
    };
    return colores[estado] || colores.pendiente;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#aa7bc3', fontWeight: 700 }}>Gestión de Citas</h2>
        <button onClick={() => abrirModal()} style={btnPrimario}>
          <FaPlusCircle /> Nueva Cita
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <FaCalendarAlt color="#aa7bc3" size={20} />
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px #efeef3', padding: '1.5rem' }}>
        {citas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            No hay citas para esta fecha
          </div>
        ) : (
          citas.map((cita) => {
            const colores = colorEstado(cita.estado);
            return (
              <div key={cita._id} style={{
                borderBottom: '1px solid #f5f5f5',
                padding: '1rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#aa7bc3', fontWeight: 700, fontSize: '1.1rem' }}>
                      {cita.hora}
                    </span>
                    <span style={{ color: '#444', fontWeight: 600 }}>
                      {cita.cliente.nombre} {cita.cliente.apellido}
                    </span>
                    <span style={{
                      background: colores.bg,
                      color: colores.color,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      {formatearEstado(cita.estado)}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.95rem' }}>
                    {cita.servicios.map(s => s.nombre).join(', ')}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Duración: {cita.duracionTotal} min | Total: ${cita.precioTotal.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {cita.estado === 'pendiente' && (
                    <button
                      onClick={() => cambiarEstado(cita._id, 'en_curso')}
                      style={{ ...btnEstado, background: '#e0f2fe', color: '#0284c7' }}
                    >
                      Iniciar
                    </button>
                  )}
                  {cita.estado === 'en_curso' && (
                    <button
                      onClick={() => cambiarEstado(cita._id, 'completada')}
                      style={{ ...btnEstado, background: '#e2ffe8', color: '#58bb7b' }}
                    >
                      Completar
                    </button>
                  )}
                  <button onClick={() => abrirModal(cita)} style={btnIcono}>
                    <FaEdit color="#aa7bc3" />
                  </button>
                  <button onClick={() => cancelarCita(cita._id)} style={btnIcono}>
                    <FaTrash color="#dc2626" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {mostrarModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ color: '#aa7bc3', marginBottom: '1.5rem' }}>
              {citaEditar ? 'Editar Cita' : 'Nueva Cita'}
            </h3>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Cliente</label>
              <select
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                required
                style={inputStyle}
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.nombre} {c.apellido} - {c.telefono}
                  </option>
                ))}
              </select>

              <label style={labelStyle}>Servicios</label>
              <div style={{ marginBottom: '1rem', maxHeight: '150px', overflow: 'auto', border: '1px solid #d0cde1', borderRadius: '8px', padding: '0.5rem' }}>
                {servicios.map(s => (
                  <label key={s._id} style={{ display: 'block', padding: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.servicios.includes(s._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, servicios: [...formData.servicios, s._id] });
                        } else {
                          setFormData({ ...formData, servicios: formData.servicios.filter(id => id !== s._id) });
                        }
                      }}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {s.nombre} - ${s.precio.toLocaleString()} ({s.duracion} min)
                  </label>
                ))}
              </div>

              <label style={labelStyle}>Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Hora</label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Notas</label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                style={{ ...inputStyle, minHeight: '60px' }}
                placeholder="Notas adicionales (opcional)"
              />

              {formData.servicios.length > 0 && (
                <div style={{ background: '#f9f6fd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <strong>Duración total:</strong> {calcularDuracionTotal()} minutos
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={btnPrimario}>Guardar</button>
                <button type="button" onClick={cerrarModal} style={btnSecundario}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #d0cde1',
  fontSize: '1rem',
  outline: 'none'
};

const labelStyle = {
  display: 'block',
  color: '#aa7bc3',
  fontWeight: 600,
  marginBottom: '0.5rem'
};

const btnPrimario = {
  background: '#cfbaf0',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  color: '#444',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const btnSecundario = {
  background: '#f9f6fd',
  border: '1px solid #cfbaf0',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  color: '#aa7bc3',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const btnIcono = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem'
};

const btnEstado = {
  border: 'none',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContent = {
  background: '#fff',
  borderRadius: '14px',
  padding: '2rem',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'auto'
};

export default GestionCitas;
