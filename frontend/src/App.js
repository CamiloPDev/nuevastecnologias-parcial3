import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginWrapper from './Login';
import Dashboard from './Dashboard';

function App() {
  const [usuario, setUsuario] = useState('');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <LoginWrapper setUsuario={setUsuario} />
          } />
          <Route path="/dashboard" element={
            usuario
              ? <Dashboard usuario={usuario} />
              : <Navigate to="/" />
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
