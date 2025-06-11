import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión MySQL usando variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db', // 'db' para Docker Compose, Render te dará el host
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'estacionamiento',
  port: Number(process.env.DB_PORT) || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a MySQL exitosa');
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

// Ejemplo de endpoint que consulta la base de datos
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error en la consulta' });
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
