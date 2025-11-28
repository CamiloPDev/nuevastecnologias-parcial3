# Sistema de Gestión de Belleza - Nail Studio

Sistema completo de gestión de citas para salones de belleza con backend en Node.js + MongoDB y frontend en React.

## 🚀 Características Implementadas

### Backend (API REST)
- ✅ CRUD completo de Clientes
- ✅ CRUD completo de Servicios
- ✅ CRUD completo de Citas con validación de disponibilidad
- ✅ Sistema de Pagos
- ✅ Reportes y estadísticas (Dashboard, ingresos, servicios populares, clientes frecuentes)
- ✅ Validación de horarios (evita citas duplicadas)
- ✅ Cálculo automático de duración y precio total

### Frontend (React)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de Clientes (crear, editar, eliminar, buscar)
- ✅ Gestión de Servicios (crear, editar, desactivar)
- ✅ Gestión de Citas (crear, editar, cancelar, cambiar estado)
- ✅ Validación de disponibilidad de horarios
- ✅ Diseño responsive con colores pastel
- ✅ Navegación entre módulos

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd parcial3
```

### 2. Configurar MongoDB

Asegúrate de que MongoDB esté corriendo en tu máquina local o en un servidor.

**Inicializar la base de datos:**
```bash
mongosh < init-database.js
```

Este script creará:
- Base de datos `nailsDB`
- Colecciones: administradores, clientes, servicios, citas, pagos, historial_citas, config
- Datos de prueba (1 admin, 4 clientes, 8 servicios)
- Índices optimizados

### 3. Configurar Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` (o copia `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nailsDB
NODE_ENV=development
```

**Iniciar el backend:**
```bash
npm run dev
```

El servidor estará en `http://localhost:5000`

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

El archivo `.env` ya está configurado:
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Iniciar el frontend:**
```bash
npm start
```

La aplicación estará en `http://localhost:3000`

## 🎯 Uso del Sistema

### Login
- Usuario: `admin@nails.com`
- Contraseña: (cualquiera por ahora, no hay validación)

### Módulos Disponibles

1. **Dashboard**: Vista general con estadísticas del día
2. **Gestión de Citas**: Crear, editar, cancelar citas con validación de horarios
3. **Clientes**: CRUD completo con búsqueda
4. **Servicios**: CRUD completo con categorías y precios
5. **Reportes**: (Próximamente)

## 📊 Estructura del Proyecto

```
parcial3/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Administrador.js
│   │   ├── Cliente.js
│   │   ├── Servicio.js
│   │   ├── Cita.js
│   │   └── Pago.js
│   ├── routes/
│   │   ├── clientes.js
│   │   ├── servicios.js
│   │   ├── citas.js
│   │   ├── pagos.js
│   │   └── reportes.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GestionClientes.js
│   │   │   ├── GestionServicios.js
│   │   │   └── GestionCitas.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── Dashboard.js
│   │   └── Login.js
│   ├── package.json
│   └── .env
└── init-database.js
```

## 🔌 API Endpoints

### Clientes
- `GET /api/clientes` - Obtener todos
- `GET /api/clientes/:id` - Obtener por ID
- `GET /api/clientes/buscar/:termino` - Buscar
- `POST /api/clientes` - Crear
- `PUT /api/clientes/:id` - Actualizar
- `DELETE /api/clientes/:id` - Eliminar

### Servicios
- `GET /api/servicios` - Obtener todos
- `GET /api/servicios/activos` - Obtener activos
- `POST /api/servicios` - Crear
- `PUT /api/servicios/:id` - Actualizar
- `DELETE /api/servicios/:id` - Desactivar

### Citas
- `GET /api/citas` - Obtener todas
- `GET /api/citas/hoy` - Obtener de hoy
- `GET /api/citas/fecha/:fecha` - Por fecha
- `POST /api/citas/verificar-disponibilidad` - Verificar horario
- `POST /api/citas` - Crear
- `PUT /api/citas/:id` - Actualizar
- `DELETE /api/citas/:id` - Cancelar

### Reportes
- `GET /api/reportes/dashboard` - Estadísticas
- `GET /api/reportes/ingresos/:inicio/:fin` - Ingresos
- `GET /api/reportes/servicios-populares/:inicio/:fin` - Servicios más vendidos
- `GET /api/reportes/clientes-frecuentes` - Top clientes

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no está corriendo, iniciarlo
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod
```

### Error CORS en el frontend
Verifica que el backend esté corriendo en el puerto 5000 y que el `.env` del frontend tenga la URL correcta.

### Puerto en uso
Si el puerto 5000 o 3000 está ocupado, cámbialo en los archivos `.env` correspondientes.

## 📝 Próximos Pasos (Pendientes)

- [ ] Sistema de autenticación real con JWT
- [ ] Módulo de reportes completo
- [ ] Sistema de notificaciones (email/SMS)
- [ ] Historial de cambios en citas
- [ ] Exportar reportes a PDF/Excel
- [ ] Despliegue en producción

## 👥 Autor

[Tu Nombre]

## 📄 Licencia

Este proyecto es para fines educativos.
