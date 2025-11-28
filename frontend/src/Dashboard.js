import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserFriends, FaDollarSign, FaChartLine, FaPlusCircle, FaRegCalendarCheck, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { citasAPI, reportesAPI } from './services/api';
import GestionCitas from './components/GestionCitas';
import GestionClientes from './components/GestionClientes';
import GestionServicios from './components/GestionServicios';

function Dashboard({ usuario }) {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [citasHoy, setCitasHoy] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    citasHoy: 0,
    citasPendientes: 0,
    totalClientes: 0,
    ingresosHoy: 0,
    ocupacion: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [citas, stats] = await Promise.all([
        citasAPI.obtenerHoy(),
        reportesAPI.obtenerDashboard()
      ]);
      setCitasHoy(citas);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setCargando(false);
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

  const renderizarContenido = () => {
    switch (vistaActual) {
      case 'citas':
        return <GestionCitas />;
      case 'clientes':
        return <GestionClientes />;
      case 'servicios':
        return <GestionServicios />;
      case 'reportes':
        return <div style={{ padding: '2rem' }}><h2 style={{ color: '#aa7bc3' }}>Reportes (Próximamente)</h2></div>;
      default:
        return renderizarDashboard();
    }
  };

  const renderizarDashboard = () => {
    if (cargando) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
    }

    return (
      <>
        {/* Encabezado con nombre dinámico de usuario */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: '#aa7bc3', fontWeight: 700, fontSize: '1.7rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            ¡Hola, {usuario}! <span role="img" aria-label="saludo">👋</span>
          </h2>
          <div style={{ marginTop: 4, color: '#a4a3ca', fontWeight: 500, fontSize: '1rem' }}>
            Bienvenida de vuelta, tienes un día ocupado hoy
          </div>
        </div>
        {/* Tarjetas métricas */}
        <div style={{ display: 'flex', gap: '1.7rem', marginBottom: '1.8rem' }}>
          <Card icon={<FaCalendarAlt color="#aa7bc3"/>} title="Citas Hoy" value={estadisticas.citasHoy} desc={`${estadisticas.citasPendientes} pendientes`} />
          <Card icon={<FaUserFriends color="#aa7bc3"/>} title="Clientes" value={estadisticas.totalClientes} desc="Total registrados" />
          <Card icon={<FaDollarSign color="#aa7bc3"/>} title="Ingresos Hoy" value={`$${estadisticas.ingresosHoy.toLocaleString()}`} desc="Pagos completados" />
          <Card icon={<FaChartLine color="#aa7bc3"/>} title="Ocupación" value={`${estadisticas.ocupacion}%`} desc={estadisticas.ocupacion > 70 ? 'Muy bueno' : 'Normal'} />
        </div>
        {/* Acciones rápidas */}
        <div style={{ display: 'flex', gap: '1.7rem', marginBottom: '1.7rem' }}>
          <div onClick={() => setVistaActual('citas')} style={{ cursor: 'pointer' }}>
            <QuickAction title="Nueva Cita" desc="Programar una nueva cita" icon={<FaPlusCircle color="#b4aee8" />} />
          </div>
          <div onClick={() => setVistaActual('citas')} style={{ cursor: 'pointer' }}>
            <QuickAction title="Ver Agenda Hoy" desc="Revisa las citas de hoy" icon={<FaCalendarAlt color="#cfbaf0" />} />
          </div>
          <div onClick={() => setVistaActual('clientes')} style={{ cursor: 'pointer' }}>
            <QuickAction title="Añadir Cliente" desc="Registrar nuevo cliente" icon={<FaUserPlus color="#f7cfff" />} />
          </div>
        </div>
        {/* Listado de citas */}
        <section style={{ marginTop: '2.2rem', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px #efeef3', padding: '1.5rem' }}>
          <div style={{ color: '#aa7bc3', fontWeight: 700, fontSize: '1.13rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            Citas de Hoy <a href="#" onClick={(e) => { e.preventDefault(); setVistaActual('citas'); }} style={{ color: '#b4aee8', fontSize: '0.96rem', textDecoration: 'none' }}>Ver todas</a>
          </div>
          <div>
            {citasHoy.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                No hay citas programadas para hoy
              </div>
            ) : (
              citasHoy.map((c, i) => {
                const serviciosNombres = c.servicios.map(s => s.nombre).join(', ');
                const colores = colorEstado(c.estado);
                return (
                  <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < citasHoy.length - 1 ? '1px solid #fbeaff' : 'none', padding: '0.9rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <FaCalendarAlt color="#b4aee8" />
                      <span style={{ color: '#444', fontWeight: 600 }}>{c.cliente.nombre} {c.cliente.apellido}</span>
                      <span style={{ color: '#888', fontWeight: 400 }}>{serviciosNombres}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                      <span style={{ color: '#aa7bc3', fontWeight: 600 }}>{c.hora}</span>
                      <span style={{
                        background: colores.bg,
                        color: colores.color,
                        borderRadius: '8px',
                        padding: '3px 15px',
                        fontWeight: 700,
                        fontSize: '0.98rem'
                      }}>{formatearEstado(c.estado)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(120deg,#f9f6fd,#fbeaff 80%)', fontFamily: 'sans-serif' }}>
      {/* Menú lateral */}
      <aside style={{ background: '#fff', width: '210px', minHeight: '100vh', boxShadow: '0 0 15px #eee', borderRadius: '0 22px 22px 0', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <img src="https://img.icons8.com/pastel-glyph/64/000000/nail-polish.png" width="46" alt="" />
          <div style={{ fontWeight: 700, color: '#aa7bc3', fontSize: '1.15rem', marginTop: '8px' }}>Nail Studio</div>
          <small style={{ color: '#b4aee8', fontSize: '0.95rem' }}>Sistema de Gestión</small>
        </div>
        <nav style={{ width: '100%' }}>
          <button onClick={() => setVistaActual('dashboard')} style={{ ...menuBtnStyle, background: vistaActual === 'dashboard' ? '#cfbaf0' : '#f9f6fd' }}>
            <FaChartLine /> Dashboard
          </button>
          <button onClick={() => setVistaActual('citas')} style={{ ...menuBtnStyle, background: vistaActual === 'citas' ? '#cfbaf0' : '#f9f6fd' }}>
            <FaCalendarAlt /> Gestión de Citas
          </button>
          <button onClick={() => setVistaActual('clientes')} style={{ ...menuBtnStyle, background: vistaActual === 'clientes' ? '#cfbaf0' : '#f9f6fd' }}>
            <FaUserFriends /> Clientes
          </button>
          <button onClick={() => setVistaActual('servicios')} style={{ ...menuBtnStyle, background: vistaActual === 'servicios' ? '#cfbaf0' : '#f9f6fd' }}>
            <FaRegCalendarCheck /> Servicios
          </button>
          <button onClick={() => setVistaActual('reportes')} style={{ ...menuBtnStyle, background: vistaActual === 'reportes' ? '#cfbaf0' : '#f9f6fd' }}>
            <FaDollarSign /> Reportes
          </button>
        </nav>
        <button onClick={() => window.location.href = '/'} style={{ ...menuBtnStyle, marginTop: '4rem', color: '#aa7bc3' }}>
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem' }}>
        {renderizarContenido()}
      </main>
    </div>
  );
}

function Card({ icon, title, value, desc }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      boxShadow: '0 2px 10px #eee',
      padding: '1rem 1.4rem',
      minWidth: '130px',
      textAlign: 'center',
      flex: 1
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '.2rem' }}>{icon}</div>
      <div style={{ color: '#444', fontSize: '1.9rem', fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#aa7bc3', fontSize: '1rem', fontWeight: 500 }}>{title}</div>
      <div style={{ color: '#b4aee8', marginTop: '.2rem', fontSize: '0.97rem' }}>{desc}</div>
    </div>
  );
}

function QuickAction({ title, desc, icon }) {
  return (
    <div style={{
      background: '#f9f6fd',
      borderRadius: '14px',
      boxShadow: '0 2px 10px #fbeaff',
      padding: '1.1rem 1.4rem',
      minWidth: '160px',
      textAlign: 'center',
      flex: 1
    }}>
      <div style={{ fontSize: '1.7rem', marginBottom: '.2rem' }}>{icon}</div>
      <div style={{ color: '#444', fontSize: '1.07rem', fontWeight: 700 }}>{title}</div>
      <div style={{ color: '#aa7bc3', marginTop: '.1rem', fontSize: '0.98rem' }}>{desc}</div>
    </div>
  );
}

const menuBtnStyle = {
  display: 'flex',
  gap: '0.9rem',
  alignItems: 'center',
  background: '#f9f6fd',
  border: 'none',
  fontSize: '1.05rem',
  fontWeight: 600,
  color: '#444',
  padding: '0.8rem 1.5rem',
  width: '100%',
  marginBottom: '0.6rem',
  borderRadius: '11px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background 0.2s',
};

export default Dashboard;
