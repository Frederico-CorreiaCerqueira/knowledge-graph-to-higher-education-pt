import { getCourses } from '../services/courseService.js';

export const search = async (req, res) => {
  try {
    const results = await getCourses(req.query);
    res.json(results);
  } catch (error) {
    console.error('Erro na pesquisa:', error.message);
    res.status(500).json({ error: 'Erro ao pesquisar cursos.' });
  }
};
