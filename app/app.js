import express from 'express';
import courseRoutes from './backend/routes/courseRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
