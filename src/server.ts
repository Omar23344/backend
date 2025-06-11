import cors from 'cors';
import express, { Request, Response } from 'express';
import { pool } from './database/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Obtener todos los registros
app.get('/api/estacionamientos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM estacionamientos');
    res.json(result.rows); // <-- esto debe ser un array
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Agregar un nuevo registro
app.post('/api/estacionamientos', async (req: Request, res: Response) => {
  const { placa, horas, tarifa } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO estacionamientos (placa, horas, tarifa) VALUES ($1, $2, $3) RETURNING *',
      [placa, horas, tarifa]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el registro' });
  }
});

// Editar un registro
app.put('/api/estacionamientos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { placa, horas, tarifa } = req.body;
  try {
    const result = await pool.query(
      'UPDATE estacionamientos SET placa=$1, horas=$2, tarifa=$3 WHERE id=$4 RETURNING *',
      [placa, horas, tarifa, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al editar el registro' });
  }
});

// Eliminar un registro
app.delete('/api/estacionamientos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM estacionamientos WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
