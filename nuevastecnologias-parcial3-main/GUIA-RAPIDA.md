# 🚀 Guía Rápida de Inicio

## Pasos para Ejecutar el Proyecto

### 1️⃣ Inicializar MongoDB (Solo la primera vez)

```bash
# Asegúrate de que MongoDB esté corriendo
mongosh

# Ejecutar el script de inicialización
mongosh < init-database.js
```

**Resultado esperado:**
```
✅ Base de datos inicializada correctamente
📊 Colecciones creadas:
   - administradores (1 registro)
   - clientes (4 registros)
   - servicios (8 registros)
   - citas (vacía)
   - pagos (vacía)
   - historial_citas (vacía)
   - config (1 registro)
🔍 Índices creados para optimización
```

### 2️⃣ Iniciar el Backend

```bash
cd backend
npm install    # Solo la primera vez
npm run dev
```

**Resultado esperado:**
```
🚀 Servidor corriendo en puerto 5000
✅ MongoDB conectado: localhost
```

**Verificar que funciona:**
Abre en el navegador: `http://localhost:5000`
Deberías ver: `{"mensaje":"✅ API del Sistema de Gestión de Belleza funcionando"}`

### 3️⃣ Iniciar el Frontend (En otra terminal)

```bash
cd frontend
npm install    # Solo la primera vez
npm start
```

**Resultado esperado:**
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

### 4️⃣ Usar la Aplicación

1. Abre `http://localhost:3000` en tu navegador
2. Ingresa cualquier usuario y contraseña (no hay validación por ahora)
3. Explora los módulos:
   - **Dashboard**: Ver estadísticas
   - **Gestión de Citas**: Crear, editar, cancelar citas
   - **Clientes**: CRUD completo
   - **Servicios**: CRUD completo

## 🧪 Pruebas Rápidas

### Probar el Backend Directamente

**1. Obtener todos los clientes:**
```bash
curl http://localhost:5000/api/clientes
```

**2. Obtener todos los servicios:**
```bash
curl http://localhost:5000/api/servicios
```

**3. Obtener estadísticas del dashboard:**
```bash
curl http://localhost:5000/api/reportes/dashboard
```

**4. Crear un nuevo cliente:**
```bash
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "Usuario",
    "cedula": "111222333",
    "telefono": "3001234567",
    "correo": "test@example.com"
  }'
```

### Flujo Completo de Prueba en la UI

1. **Crear un Cliente:**
   - Ir a "Clientes"
   - Click en "Nuevo Cliente"
   - Llenar formulario
   - Guardar

2. **Crear una Cita:**
   - Ir a "Gestión de Citas"
   - Click en "Nueva Cita"
   - Seleccionar cliente
   - Seleccionar uno o más servicios
   - Elegir fecha y hora
   - Guardar

3. **Verificar en Dashboard:**
   - Volver al Dashboard
   - Ver las estadísticas actualizadas
   - Ver la cita en "Citas de Hoy"

## ❗ Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no funciona, iniciar MongoDB:
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Error: "Port 5000 already in use"
```bash
# Cambiar el puerto en backend/.env
PORT=5001

# Y en frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### La página no carga datos
1. Verificar que el backend esté corriendo (http://localhost:5000)
2. Abrir la consola del navegador (F12) y buscar errores
3. Verificar que MongoDB tenga datos (ejecutar `mongosh` y `use nailsDB; db.clientes.find()`)

## 📊 Datos de Prueba Incluidos

### Clientes (4):
- María Pérez (123456789)
- Laura Martínez (987654321)
- Ana García (456789123)
- Sofía López (321654987)

### Servicios (8):
- Manicure Básico - $25,000 (40 min)
- Manicure con Diseño - $35,000 (60 min)
- Pedicure Spa - $35,000 (60 min)
- Pedicure Básico - $28,000 (45 min)
- Uñas Acrílicas - $70,000 (120 min)
- Uñas en Gel - $65,000 (90 min)
- Retiro de Acrílico - $20,000 (30 min)
- Esmaltado Permanente - $30,000 (45 min)

## 🎯 Funcionalidades Clave a Probar

### ✅ Validación de Disponibilidad
1. Crear una cita para hoy a las 10:00 AM
2. Intentar crear otra cita para hoy a las 10:00 AM
3. Debería mostrar: "El horario seleccionado no está disponible"

### ✅ Múltiples Servicios
1. Al crear una cita, seleccionar 2 o más servicios
2. Ver que la duración total se calcula automáticamente
3. Ver que el precio total se suma correctamente

### ✅ Estados de Citas
1. Crear una cita (estado: Pendiente)
2. Click en "Iniciar" (estado: En Curso)
3. Click en "Completar" (estado: Completada)

### ✅ Búsqueda de Clientes
1. Ir a "Clientes"
2. Buscar por nombre, cédula o teléfono
3. Ver resultados filtrados

## 📝 Checklist de Verificación

- [ ] MongoDB está corriendo
- [ ] Base de datos inicializada con datos de prueba
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Puedo ver el Dashboard con estadísticas
- [ ] Puedo crear un nuevo cliente
- [ ] Puedo crear un nuevo servicio
- [ ] Puedo crear una cita con múltiples servicios
- [ ] La validación de horarios funciona
- [ ] Puedo cambiar el estado de una cita
- [ ] Puedo buscar clientes

## 🎉 ¡Listo!

Si todos los pasos funcionan correctamente, tienes el sistema completamente operativo.

**Próximos pasos:**
1. Crear más citas de prueba
2. Explorar los reportes
3. Probar todas las funcionalidades CRUD
4. Preparar para despliegue en producción
