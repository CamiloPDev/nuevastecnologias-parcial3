# 🚀 Inicio Rápido - Nails Studio

## ⚡ Opción 1: Script Automático (Recomendado)

Simplemente ejecuta:

```bash
iniciar-proyecto.bat
```

Esto iniciará automáticamente:
- ✅ Backend en puerto 4000
- ✅ Frontend en puerto 3000
- ✅ Abrirá el navegador

---

## 📝 Opción 2: Manual

### Paso 1: Backend

```bash
cd backend
npm install
node scripts/createAdmin.js
npm run dev
```

### Paso 2: Frontend (Nueva terminal)

```bash
cd frontend
npm install
npm start
```

### Paso 3: Abrir Navegador

http://localhost:3000

---

## 🔑 Credenciales de Prueba

- **Correo:** admin@nails.com
- **Contraseña:** admin123

---

## 📊 URLs Importantes

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Docs:** http://localhost:4000 (muestra info de la API)

---

## ✅ Verificación Rápida

### 1. Backend funcionando

Abre: http://localhost:4000

Deberías ver:
```json
{
  "mensaje": "✅ API Nails Studio funcionando correctamente 🟣💅",
  "version": "2.0.0",
  "status": "online",
  "database": "MongoDB Atlas"
}
```

### 2. Frontend funcionando

Abre: http://localhost:3000

Deberías ver la pantalla de login.

### 3. Login funciona

1. Ingresa: admin@nails.com / admin123
2. Deberías ver el dashboard

### 4. Datos se cargan

1. Ve a "Clientes"
2. Deberías ver 4 clientes
3. Ve a "Servicios"
4. Deberías ver 8 servicios

---

## ❗ Problemas Comunes

### "Cannot connect to MongoDB"

**Solución:** Verifica tu conexión a internet. El proyecto usa MongoDB Atlas (cloud).

### "Port already in use"

**Solución:** Cierra otras aplicaciones que usen los puertos 3000 o 4000.

### "Module not found"

**Solución:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## 📚 Documentación Completa

- **VALIDACION-PROYECTO.md** - Guía completa de validación
- **COMPARACION-BACKENDS.md** - Comparación con versión anterior
- **INSTALACION-MONGODB-WINDOWS.md** - Guía de MongoDB (si quieres local)

---

## 🎯 Siguiente Paso

Una vez que todo funcione, revisa:
- **CHECKLIST-PARCIAL.md** - Para la entrega del parcial
- **GUIA-RAPIDA.md** - Guía completa del proyecto

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa **VALIDACION-PROYECTO.md**
2. Ejecuta los tests de validación
3. Verifica los logs en las terminales del backend y frontend
