// Script para probar el login directamente
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  nombreCompleto: String,
  correo: { type: String, unique: true },
  telefono: String,
  password: String,
  rol: String
});

const Admin = mongoose.model('Admin', adminSchema, 'administradores');

async function testLogin() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado\n');

    // Buscar el admin
    const admin = await Admin.findOne({ correo: 'admin@nails.com' });
    
    if (!admin) {
      console.log('❌ No se encontró el usuario admin@nails.com');
      process.exit(1);
    }

    console.log('✅ Usuario encontrado:');
    console.log('   Correo:', admin.correo);
    console.log('   Nombre:', admin.nombreCompleto);
    console.log('   Rol:', admin.rol);
    console.log('   Password hash:', admin.password.substring(0, 20) + '...\n');

    // Probar la contraseña
    const testPassword = 'admin123';
    console.log('🔐 Probando contraseña:', testPassword);
    
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    if (isMatch) {
      console.log('✅ ¡Contraseña correcta! El login debería funcionar.\n');
    } else {
      console.log('❌ Contraseña incorrecta. Hay un problema con el hash.\n');
      
      // Intentar crear un nuevo hash
      console.log('🔧 Generando nuevo hash...');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(testPassword, salt);
      
      admin.password = newHash;
      await admin.save();
      
      console.log('✅ Hash actualizado. Prueba de nuevo el login.\n');
    }

    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
