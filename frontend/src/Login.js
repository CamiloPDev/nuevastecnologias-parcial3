import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function Login({ setUsuario }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(correo, password);
      
      if (result.success) {
        setUsuario(correo);
        navigate('/dashboard');
      } else {
        setError(result.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#f9f6fd',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: '#fff',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          borderRadius: '18px',
          boxShadow: '0 4px 40px #cac7d3',
          width: '370px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2 style={{
          color: '#aa7bc3', fontWeight: 700, fontSize: '1.6rem', marginBottom: '2rem'
        }}>Bienvenido</h2>
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
          style={{
            marginBottom: '1rem',
            width: '100%',
            padding: '0.65rem',
            borderRadius: '8px',
            border: '1px solid #d0cde1',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            marginBottom: '1rem',
            width: '100%',
            padding: '0.65rem',
            borderRadius: '8px',
            border: '1px solid #d0cde1',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <a href="#" style={{
          color: '#aa7bc3',
          fontSize: '0.95rem',
          alignSelf: 'flex-end',
          marginBottom: '1rem',
          textDecoration: 'none'
        }}>¿Olvidaste tu contraseña?</a>
        <button type="submit" disabled={loading} style={{
          width: '100%',
          background: loading ? '#e0d4f7' : '#cfbaf0',
          border: 'none',
          borderRadius: '8px',
          padding: '0.8rem',
          color: '#444',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginBottom: '1.2rem',
          boxShadow: '0 2px 10px #eee',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          color: '#888',
          marginBottom: '1rem'
        }}>
          Credenciales de prueba:<br/>
          <strong>admin@nails.com</strong> / <strong>admin123</strong>
        </div>
        <GoogleLogin
          onSuccess={cred => {
            // Usar el nombre real si lo recuperas del perfil Google
            setUsuario('Usuario de Google');
            navigate('/dashboard');
          }}
          onError={() => {
            alert('Error al iniciar sesión con Google');
          }}
          theme="filled_blue"
          shape="pill"
          width="320"
          text="Acceder con Google"
        />
        <div style={{ marginTop: '2rem' }}>
          <a href="#" style={{
            color: '#b4aee8',
            fontSize: '1rem',
            textDecoration: 'none'
          }}>Crear cuenta nueva</a>
        </div>
      </form>
    </div>
  );
}

function LoginWrapper(props) {
  return (
    <GoogleOAuthProvider clientId="769503887726-qio1q7iq6del79ppeaaor8k17qo7f58s.apps.googleusercontent.com">
      <Login {...props} />
    </GoogleOAuthProvider>
  );
}

export default LoginWrapper;
