import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginWrapper from './Login';
import Dashboard from './Dashboard';

function App() {
  const [usuario, setUsuario] = useState('');

  return (
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
  );
}

export default App;
