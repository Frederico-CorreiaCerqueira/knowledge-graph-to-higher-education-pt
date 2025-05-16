import axios from 'axios';
import { graphDBEndpoint } from '../config.js';

const buildQuery = ({ name, university, location, area, grade }) => {
  let filters = [];
  console.log('Filters:', { name, university, location, area, grade });
  if (name) filters.push(`FILTER(CONTAINS(LCASE(?courseName), LCASE("${name}")))`);
  if (university) filters.push(`FILTER(CONTAINS(LCASE(?institutionName), LCASE("${university}")))`);
  if (location) filters.push(`FILTER(CONTAINS(LCASE(?location), LCASE("${location}")))`);
  if (area) filters.push(`FILTER(CONTAINS(LCASE(?area), LCASE("${area}")))`);
  if (grade) filters.push(`FILTER(xsd:float(?grade) >= ${grade})`);

  return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX edu: <http://example.org/education#>

SELECT DISTINCT ?institution ?course ?grade
WHERE {
    
  ?institution a edu:Institution;
      edu:district "Lisboa"^^xsd:string;
      edu:hasCourse ?course .
    ?course rdf:type edu:Engenharia_Eletrotécnica_Marítima;
        edu:lastAdmittedGrade ?grade;
    FILTER(xsd:float(?grade) >= 110)
    
  # Filtros opcionais — ativa só os que precisares
  # FILTER(CONTAINS(LCASE(?courseName), "engenharia"))
  # FILTER(CONTAINS(LCASE(?location), "lisboa"))
  # FILTER(xsd:float(?grade) >= 140)
}
LIMIT 10
  `;
};

export const searchCourses = async (criteria) => {
  const query = buildQuery(criteria);
  
  const response = await axios.get(graphDBEndpoint, {
    params: { query },
    headers: {
      'Accept': 'application/sparql-results+json',
    },
  });
  console.log('Response:', response.data.results);
  return query /*response.data.results.bindings.map((result) => ({
    course: result.courseName.value,
    institution: result.institutionName.value,
    area: result.area.value,
    grade: result.grade.value,
    location: result.location?.value || '',
  }));*/
};
