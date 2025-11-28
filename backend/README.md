# Backend - Sistema de Gestión de Belleza

API REST para el sistema de gestión de citas de belleza.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
copy .env.example .env
```

2. Configura las variables de entorno en `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nailsDB
NODE_ENV=development
```

## 📦 Inicializar Base de Datos

Ejecuta el script de MongoDB que está en la raíz del proyecto para crear las colecciones e insertar datos iniciales.

## 🏃 Ejecutar

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📚 Endpoints Disponibles

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `GET /api/clientes/buscar/:termino` - Buscar clientes
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Servicios
- `GET /api/servicios` - Obtener todos los servicios
- `GET /api/servicios/activos` - Obtener servicios activos
- `GET /api/servicios/:id` - Obtener servicio por ID
- `POST /api/servicios` - Crear nuevo servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Desactivar servicio

### Citas
- `GET /api/citas` - Obtener todas las citas
- `GET /api/citas/hoy` - Obtener citas de hoy
- `GET /api/citas/fecha/:fecha` - Obtener citas por fecha
- `GET /api/citas/cliente/:clienteId` - Obtener citas de un cliente
- `POST /api/citas/verificar-disponibilidad` - Verificar disponibilidad
- `POST /api/citas` - Crear nueva cita
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Cancelar cita

### Pagos
- `GET /api/pagos` - Obtener todos los pagos
- `GET /api/pagos/rango/:inicio/:fin` - Obtener pagos por rango
- `POST /api/pagos` - Registrar nuevo pago

### Reportes
- `GET /api/reportes/dashboard` - Estadísticas del dashboard
- `GET /api/reportes/ingresos/:inicio/:fin` - Reporte de ingresos
- `GET /api/reportes/servicios-populares/:inicio/:fin` - Servicios más vendidos
- `GET /api/reportes/clientes-frecuentes` - Clientes frecuentes

## 🗄️ Modelos de Datos

### Cliente
```javascript
{
  nombre: String,
  apellido: String,
  alias: String,
  cedula: String (único),
  telefono: String,
  correo: String,
  fechaRegistro: Date,
  actualizadoEn: Date
}
```

### Servicio
```javascript
{
  nombre: String,
  descripcion: String,
  categoria: String,
  precio: Number,
  duracion: Number (minutos),
  activo: Boolean,
  creadoEn: Date,
  actualizadoEn: Date
}
```

### Cita
```javascript
{
  cliente: ObjectId (ref: Cliente),
  administrador: ObjectId (ref: Administrador),
  servicios: [{
    servicio: ObjectId (ref: Servicio),
    nombre: String,
    precio: Number,
    duracion: Number
  }],
  fecha: Date,
  hora: String,
  duracionTotal: Number,
  precioTotal: Number,
  estado: String (pendiente|en_curso|completada|cancelada),
  notas: String,
  creadoEn: Date,
  actualizadoEn: Date
}
```

### Pago
```javascript
{
  cita: ObjectId (ref: Cita),
  monto: Number,
  metodoPago: String (efectivo|transferencia|nequi|tarjeta|otro),
  estado: String (pendiente|completado|cancelado),
  fecha: Date,
  notas: String
}
```
