import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Login({ setUsuario }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de autenticación local
    setUsuario(user || 'Usuario');
    navigate('/dashboard');
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
        <input
          type="text"
          placeholder="Correo electrónico o usuario"
          value={user}
          onChange={e => setUser(e.target.value)}
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
          value={pass}
          onChange={e => setPass(e.target.value)}
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
        <button type="submit" style={{
          width: '100%',
          background: '#cfbaf0',
          border: 'none',
          borderRadius: '8px',
          padding: '0.8rem',
          color: '#444',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginBottom: '1.2rem',
          boxShadow: '0 2px 10px #eee'
        }}>Iniciar sesión</button>
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
