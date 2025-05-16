import { searchCourses } from './backend/repositories/courseRepository.js';

async function runTest() {
  try {
    const criteria = {
      name: 'Engenharia',      // procura cursos com "Engenharia" no nome
      university: '',          // sem filtro para universidade
      location: '',            // sem filtro para localização
      area: '',                // sem filtro para área científica
      grade: 12.5              // só cursos com nota mínima >= 12.5
    };

    const results = await searchCourses(criteria);
    console.log('Resultados encontrados:', results);

  } catch (err) {
    console.error('Erro ao buscar cursos:', err);
  }
}

runTest();
