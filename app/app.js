import express from 'express';
import cors from 'cors';
import courseRoutes from './backend/routes/courseRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
