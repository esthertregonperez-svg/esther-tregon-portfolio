/**
 * Configuracion de la aplicacion Express.
 */

import express from 'express';
import cors from 'cors';

import clienteRoutes from './routes/cliente.routes.js';
import obraRoutes from './routes/obra.routes.js';
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import { manejadorErrores } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { estado: 'operativo', timestamp: new Date().toISOString() }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/obras', obraRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'RUTA_NO_ENCONTRADA', message: 'El recurso solicitado no existe' }
  });
});

app.use(manejadorErrores);

export default app;