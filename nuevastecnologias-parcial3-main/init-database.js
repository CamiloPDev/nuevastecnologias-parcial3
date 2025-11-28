// Script de inicialización de la base de datos MongoDB
// Ejecutar con: mongosh < init-database.js

use("nailsDB");

// Limpiar colecciones existentes (opcional - comentar si no quieres borrar datos)
// db.administradores.drop();
// db.clientes.drop();
// db.servicios.drop();
// db.citas.drop();
// db.pagos.drop();
// db.historial_citas.drop();
// db.config.drop();

////////////////////////////////////////////////////////
// 1. ADMINISTRADORES
////////////////////////////////////////////////////////
db.createCollection("administradores");
db.administradores.insertOne({
  nombreCompleto: "Administrador General",
  correo: "admin@nails.com",
  telefono: "3000000000",
  password: "$2a$10$ExampleDePasswordEncriptada123456789", // Cambiar con bcrypt
  rol: "admin",
  creadoEn: new Date(),
  actualizadoEn: new Date()
});

////////////////////////////////////////////////////////
// 2. CLIENTES
////////////////////////////////////////////////////////
db.createCollection("clientes");
db.clientes.insertMany([
  {
    nombre: "María",
    apellido: "Pérez",
    alias: "Mari",
    cedula: "123456789",
    telefono: "3201112233",
    correo: "maria@example.com",
    fechaRegistro: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Laura",
    apellido: "Martínez",
    alias: "Lau",
    cedula: "987654321",
    telefono: "3159876543",
    correo: "laura@example.com",
    fechaRegistro: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Ana",
    apellido: "García",
    alias: "Anita",
    cedula: "456789123",
    telefono: "3187654321",
    correo: "ana@example.com",
    fechaRegistro: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Sofía",
    apellido: "López",
    alias: "Sofi",
    cedula: "321654987",
    telefono: "3145678901",
    correo: "sofia@example.com",
    fechaRegistro: new Date(),
    actualizadoEn: new Date()
  }
]);

////////////////////////////////////////////////////////
// 3. SERVICIOS
////////////////////////////////////////////////////////
db.createCollection("servicios");
db.servicios.insertMany([
  {
    nombre: "Manicure Básico",
    descripcion: "Manicure tradicional con esmalte.",
    categoria: "Manicure",
    precio: 25000,
    duracion: 40,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Manicure con Diseño",
    descripcion: "Manicure con diseños personalizados y decoración.",
    categoria: "Manicure",
    precio: 35000,
    duracion: 60,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Pedicure Spa",
    descripcion: "Pedicure con exfoliación y masaje relajante.",
    categoria: "Pedicure",
    precio: 35000,
    duracion: 60,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Pedicure Básico",
    descripcion: "Pedicure tradicional con esmalte.",
    categoria: "Pedicure",
    precio: 28000,
    duracion: 45,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Uñas Acrílicas",
    descripcion: "Aplicación completa de uñas acrílicas premium.",
    categoria: "Acrílicas",
    precio: 70000,
    duracion: 120,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Uñas en Gel",
    descripcion: "Aplicación de uñas en gel con acabado brillante.",
    categoria: "Gel",
    precio: 65000,
    duracion: 90,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Retiro de Acrílico",
    descripcion: "Retiro profesional de uñas acrílicas.",
    categoria: "Mantenimiento",
    precio: 20000,
    duracion: 30,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  },
  {
    nombre: "Esmaltado Permanente",
    descripcion: "Esmaltado semipermanente de larga duración.",
    categoria: "Esmaltado",
    precio: 30000,
    duracion: 45,
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  }
]);

////////////////////////////////////////////////////////
// 4. CITAS (colección vacía - se llenarán desde la app)
////////////////////////////////////////////////////////
db.createCollection("citas");

////////////////////////////////////////////////////////
// 5. PAGOS (colección vacía - se llenarán desde la app)
////////////////////////////////////////////////////////
db.createCollection("pagos");

////////////////////////////////////////////////////////
// 6. HISTORIAL DE CITAS (colección vacía)
////////////////////////////////////////////////////////
db.createCollection("historial_citas");

////////////////////////////////////////////////////////
// 7. CONFIGURACIÓN GLOBAL
////////////////////////////////////////////////////////
db.createCollection("config");
db.config.insertOne({
  recordatorioHorasAntes: 24,
  notificacionesWhatsApp: true,
  notificacionesCorreo: true,
  horarioApertura: "08:00",
  horarioCierre: "18:00",
  diasLaborales: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  creadoEn: new Date()
});

////////////////////////////////////////////////////////
// 8. ÍNDICES PARA OPTIMIZACIÓN
////////////////////////////////////////////////////////

// Índices para clientes
db.clientes.createIndex({ cedula: 1 }, { unique: true });
db.clientes.createIndex({ correo: 1 });
db.clientes.createIndex({ telefono: 1 });

// Índices para administradores
db.administradores.createIndex({ correo: 1 }, { unique: true });

// Índices para citas
db.citas.createIndex({ fecha: 1, hora: 1 });
db.citas.createIndex({ cliente: 1 });
db.citas.createIndex({ estado: 1 });

// Índices para pagos
db.pagos.createIndex({ fecha: 1 });
db.pagos.createIndex({ cita: 1 });

// Índices para servicios
db.servicios.createIndex({ categoria: 1 });
db.servicios.createIndex({ activo: 1 });

print("✅ Base de datos inicializada correctamente");
print("📊 Colecciones creadas:");
print("   - administradores (1 registro)");
print("   - clientes (4 registros)");
print("   - servicios (8 registros)");
print("   - citas (vacía)");
print("   - pagos (vacía)");
print("   - historial_citas (vacía)");
print("   - config (1 registro)");
print("🔍 Índices creados para optimización");
