// Script para crear el usuario administrador con credenciales correctas
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modelo Admin simplificado
const adminSchema = new mongoose.Schema({
  nombreCompleto: String,
  correo: { type: String, unique: true },
  telefono: String,
  password: String,
  rol: String,
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema, 'administradores');

async function setupAdmin() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe el admin
    const existingAdmin = await Admin.findOne({ correo: 'admin@nails.com' });
    
    if (existingAdmin) {
      console.log('⚠️  El administrador ya existe. Actualizando contraseña...');
      
      // Encriptar la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Actualizar
      existingAdmin.password = hashedPassword;
      existingAdmin.actualizadoEn = new Date();
      await existingAdmin.save();
      
      console.log('✅ Contraseña actualizada correctamente');
    } else {
      console.log('📝 Creando nuevo administrador...');
      
      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Crear admin
      const admin = new Admin({
        nombreCompleto: 'Administrador General',
        correo: 'admin@nails.com',
        telefono: '3000000000',
        password: hashedPassword,
        rol: 'admin'
      });
      
      await admin.save();
      console.log('✅ Administrador creado correctamente');
    }

    console.log('\n🎉 Configuración completada!');
    console.log('📧 Correo: admin@nails.com');
    console.log('🔑 Contraseña: admin123');
    
    await mongoose.connection.close();
    console.log('\n👋 Conexión cerrada');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
