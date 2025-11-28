import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { clientesAPI } from '../services/api';

function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    alias: '',
    cedula: '',
    telefono: '',
    correo: ''
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await clientesAPI.obtenerTodos();
      setClientes(data);
    } catch (error) {
      alert('Error al cargar clientes: ' + error.message);
    }
  };

  const buscarClientes = async () => {
    if (!busqueda.trim()) {
      cargarClientes();
      return;
    }
    try {
      const data = await clientesAPI.buscar(busqueda);
      setClientes(data);
    } catch (error) {
      alert('Error en la búsqueda: ' + error.message);
    }
  };

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setClienteEditar(cliente);
      setFormData(cliente);
    } else {
      setClienteEditar(null);
      setFormData({ nombre: '', apellido: '', alias: '', cedula: '', telefono: '', correo: '' });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteEditar(null);
    setFormData({ nombre: '', apellido: '', alias: '', cedula: '', telefono: '', correo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clienteEditar) {
        await clientesAPI.actualizar(clienteEditar._id, formData);
        alert('Cliente actualizado exitosamente');
      } else {
        await clientesAPI.crear(formData);
        alert('Cliente creado exitosamente');
      }
      cerrarModal();
      cargarClientes();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      await clientesAPI.eliminar(id);
      alert('Cliente eliminado exitosamente');
      cargarClientes();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#aa7bc3', fontWeight: 700 }}>Gestión de Clientes</h2>
        <button onClick={() => abrirModal()} style={btnPrimario}>
          <FaUserPlus /> Nuevo Cliente
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && buscarClientes()}
          style={inputStyle}
        />
        <button onClick={buscarClientes} style={btnSecundario}>
          <FaSearch /> Buscar
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px #efeef3', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f6fd', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Alias</th>
              <th style={thStyle}>Cédula</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={tdStyle}>{cliente.nombre} {cliente.apellido}</td>
                <td style={tdStyle}>{cliente.alias}</td>
                <td style={tdStyle}>{cliente.cedula}</td>
                <td style={tdStyle}>{cliente.telefono}</td>
                <td style={tdStyle}>{cliente.correo}</td>
                <td style={tdStyle}>
                  <button onClick={() => abrirModal(cliente)} style={btnIcono}>
                    <FaEdit color="#aa7bc3" />
                  </button>
                  <button onClick={() => eliminarCliente(cliente._id)} style={btnIcono}>
                    <FaTrash color="#dc2626" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ color: '#aa7bc3', marginBottom: '1.5rem' }}>
              {clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Alias"
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Correo"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const btnIcono = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  marginRight: '0.5rem'
};

const thStyle = {
  padding: '1rem',
  textAlign: 'left',
  color: '#aa7bc3',
  fontWeight: 600
};

const tdStyle = {
  padding: '1rem',
  color: '#444'
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

export default GestionClientes;
