# 🛠️ Comandos Útiles

## MongoDB

### Iniciar MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Conectar a MongoDB
```bash
mongosh
```

### Comandos dentro de mongosh
```javascript
// Ver bases de datos
show dbs

// Usar la base de datos
use nailsDB

// Ver colecciones
show collections

// Ver todos los clientes
db.clientes.find().pretty()

// Ver todos los servicios
db.servicios.find().pretty()

// Ver todas las citas
db.citas.find().pretty()

// Contar documentos
db.clientes.countDocuments()
db.citas.countDocuments()

// Buscar un cliente específico
db.clientes.findOne({ cedula: "123456789" })

// Ver citas de hoy
db.citas.find({ 
  fecha: { 
    $gte: new Date(new Date().setHours(0,0,0,0)),
    $lte: new Date(new Date().setHours(23,59,59,999))
  }
}).pretty()

// Eliminar todas las citas (cuidado!)
db.citas.deleteMany({})

// Eliminar todos los pagos
db.pagos.deleteMany({})

// Salir
exit
```

### Exportar base de datos
```bash
# Exportar toda la base de datos
mongodump --db nailsDB --out ./backup

# Exportar una colección específica
mongoexport --db nailsDB --collection clientes --out clientes.json

# Exportar en formato CSV
mongoexport --db nailsDB --collection clientes --type=csv --fields nombre,apellido,cedula,telefono --out clientes.csv
```

### Importar base de datos
```bash
# Importar toda la base de datos
mongorestore --db nailsDB ./backup/nailsDB

# Importar una colección
mongoimport --db nailsDB --collection clientes --file clientes.json
```

---

## Backend (Node.js)

### Instalación
```bash
cd backend
npm install
```

### Ejecutar
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

### Instalar dependencias adicionales
```bash
npm install <nombre-paquete>
```

### Ver logs en tiempo real
```bash
# Windows
type nul > logs.txt & npm run dev | tee logs.txt

# Mac/Linux
npm run dev | tee logs.txt
```

---

## Frontend (React)

### Instalación
```bash
cd frontend
npm install
```

### Ejecutar
```bash
npm start
```

### Build para producción
```bash
npm run build
```

### Limpiar caché
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Windows
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## Git

### Inicializar repositorio
```bash
cd parcial3
git init
git add .
git commit -m "Initial commit"
```

### Conectar con GitHub
```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### Commits frecuentes
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

### Ver historial
```bash
git log --oneline
```

### Crear .gitignore
```bash
# Crear archivo .gitignore en la raíz
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore
```

---

## Pruebas de API con curl

### Clientes
```bash
# Obtener todos los clientes
curl http://localhost:5000/api/clientes

# Obtener un cliente por ID
curl http://localhost:5000/api/clientes/ID_DEL_CLIENTE

# Crear un cliente
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "999888777",
    "telefono": "3001234567",
    "correo": "juan@example.com"
  }'

# Actualizar un cliente
curl -X PUT http://localhost:5000/api/clientes/ID_DEL_CLIENTE \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "3009876543"
  }'

# Eliminar un cliente
curl -X DELETE http://localhost:5000/api/clientes/ID_DEL_CLIENTE

# Buscar clientes
curl http://localhost:5000/api/clientes/buscar/Juan
```

### Servicios
```bash
# Obtener todos los servicios
curl http://localhost:5000/api/servicios

# Obtener servicios activos
curl http://localhost:5000/api/servicios/activos

# Crear un servicio
curl -X POST http://localhost:5000/api/servicios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Manicure Express",
    "descripcion": "Manicure rápido",
    "categoria": "Manicure",
    "precio": 20000,
    "duracion": 30,
    "activo": true
  }'
```

### Citas
```bash
# Obtener todas las citas
curl http://localhost:5000/api/citas

# Obtener citas de hoy
curl http://localhost:5000/api/citas/hoy

# Obtener citas por fecha
curl http://localhost:5000/api/citas/fecha/2024-01-15

# Verificar disponibilidad
curl -X POST http://localhost:5000/api/citas/verificar-disponibilidad \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2024-01-15",
    "hora": "10:00",
    "duracionTotal": 60
  }'

# Crear una cita
curl -X POST http://localhost:5000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "ID_DEL_CLIENTE",
    "administrador": "ID_DEL_ADMIN",
    "servicios": ["ID_SERVICIO_1", "ID_SERVICIO_2"],
    "fecha": "2024-01-15",
    "hora": "10:00",
    "estado": "pendiente"
  }'
```

### Reportes
```bash
# Dashboard
curl http://localhost:5000/api/reportes/dashboard

# Ingresos
curl http://localhost:5000/api/reportes/ingresos/2024-01-01/2024-01-31

# Servicios populares
curl http://localhost:5000/api/reportes/servicios-populares/2024-01-01/2024-01-31

# Clientes frecuentes
curl http://localhost:5000/api/reportes/clientes-frecuentes
```

---

## Despliegue

### Railway (Backend)
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Agregar MongoDB
railway add

# Desplegar
railway up

# Ver logs
railway logs
```

### Vercel (Frontend)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### MongoDB Atlas
```bash
# Conectar desde local
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/nailsDB" --username tu-usuario

# String de conexión para .env
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/nailsDB?retryWrites=true&w=majority
```

---

## Solución de Problemas

### Puerto ocupado
```bash
# Windows - Matar proceso en puerto 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Limpiar caché de npm
```bash
npm cache clean --force
```

### Reinstalar todo
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Ver versiones
```bash
node --version
npm --version
mongosh --version
git --version
```

---

## Atajos de Teclado

### VS Code
- `Ctrl + P` - Buscar archivo
- `Ctrl + Shift + P` - Paleta de comandos
- `Ctrl + `` - Terminal
- `Ctrl + B` - Toggle sidebar
- `Ctrl + /` - Comentar línea
- `Alt + Shift + F` - Formatear documento

### Chrome DevTools
- `F12` - Abrir DevTools
- `Ctrl + Shift + C` - Inspeccionar elemento
- `Ctrl + Shift + J` - Consola
- `Ctrl + Shift + R` - Hard reload

---

## Scripts Útiles

### Backup automático de MongoDB
```bash
# backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db nailsDB --out ./backups/backup_$DATE
echo "Backup creado: backup_$DATE"
```

### Iniciar todo el proyecto
```bash
# start-all.sh
#!/bin/bash
# Iniciar MongoDB
net start MongoDB

# Iniciar Backend
cd backend
start npm run dev

# Iniciar Frontend
cd ../frontend
start npm start
```

### Verificar que todo funcione
```bash
# check-health.sh
#!/bin/bash
echo "Verificando MongoDB..."
mongosh --eval "db.version()"

echo "Verificando Backend..."
curl http://localhost:5000

echo "Verificando Frontend..."
curl http://localhost:3000
```

---

## Variables de Entorno

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nailsDB
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Producción Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nailsDB
NODE_ENV=production
```

### Producción Frontend (.env)
```env
REACT_APP_API_URL=https://tu-backend.railway.app/api
```

---

## Recursos Útiles

### Documentación
- Node.js: https://nodejs.org/docs
- React: https://react.dev
- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com
- Mongoose: https://mongoosejs.com

### Herramientas
- MongoDB Compass: https://www.mongodb.com/products/compass
- Postman: https://www.postman.com
- VS Code: https://code.visualstudio.com

### Despliegue
- Railway: https://railway.app
- Vercel: https://vercel.com
- MongoDB Atlas: https://www.mongodb.com/atlas
- Render: https://render.com
