import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { serviciosAPI } from '../services/api';

function GestionServicios() {
  const [servicios, setServicios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicioEditar, setServicioEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    duracion: '',
    activo: true
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await serviciosAPI.obtenerTodos();
      setServicios(data);
    } catch (error) {
      alert('Error al cargar servicios: ' + error.message);
    }
  };

  const abrirModal = (servicio = null) => {
    if (servicio) {
      setServicioEditar(servicio);
      setFormData(servicio);
    } else {
      setServicioEditar(null);
      setFormData({ nombre: '', descripcion: '', categoria: '', precio: '', duracion: '', activo: true });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setServicioEditar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (servicioEditar) {
        await serviciosAPI.actualizar(servicioEditar._id, formData);
        alert('Servicio actualizado exitosamente');
      } else {
        await serviciosAPI.crear(formData);
        alert('Servicio creado exitosamente');
      }
      cerrarModal();
      cargarServicios();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const eliminarServicio = async (id) => {
    if (!window.confirm('¿Desactivar este servicio?')) return;
    try {
      await serviciosAPI.eliminar(id);
      alert('Servicio desactivado');
      cargarServicios();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#aa7bc3', fontWeight: 700 }}>Gestión de Servicios</h2>
        <button onClick={() => abrirModal()} style={btnPrimario}>
          <FaPlusCircle /> Nuevo Servicio
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {servicios.map((servicio) => (
          <div key={servicio._id} style={{
            background: '#fff',
            borderRadius: '14px',
            boxShadow: '0 2px 12px #efeef3',
            padding: '1.5rem',
            opacity: servicio.activo ? 1 : 0.6
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: '#aa7bc3', marginBottom: '0.5rem' }}>{servicio.nombre}</h3>
                <span style={{
                  background: '#f9f6fd',
                  color: '#aa7bc3',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem'
                }}>{servicio.categoria}</span>
              </div>
              <div>
                <button onClick={() => abrirModal(servicio)} style={btnIcono}>
                  <FaEdit color="#aa7bc3" />
                </button>
                <button onClick={() => eliminarServicio(servicio._id)} style={btnIcono}>
                  <FaTrash color="#dc2626" />
                </button>
              </div>
            </div>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem' }}>{servicio.descripcion}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#aa7bc3', fontWeight: 700, fontSize: '1.5rem' }}>
                  ${servicio.precio.toLocaleString()}
                </div>
                <div style={{ color: '#888', fontSize: '0.9rem' }}>{servicio.duracion} minutos</div>
              </div>
              <div style={{
                background: servicio.activo ? '#e2ffe8' : '#fee2e2',
                color: servicio.activo ? '#58bb7b' : '#dc2626',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                {servicio.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ color: '#aa7bc3', marginBottom: '1.5rem' }}>
              {servicioEditar ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre del servicio"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                style={inputStyle}
              />
              <textarea
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px' }}
              />
              <input
                type="text"
                placeholder="Categoría (ej: Manicure, Pedicure)"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Duración (minutos)"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                required
                style={inputStyle}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                />
                Servicio activo
              </label>
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
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'auto'
};

export default GestionServicios;
