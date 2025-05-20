
export const buildQuerySearchUniversity = (criteria) => {
  let filters = [];
  if (criteria.course) filters.push(`FILTER(CONTAINS(LCASE(STRAFTER(STR(?courseType), "#")), LCASE("${criteria.course}")))`);
  if (criteria.location) filters.push(`FILTER(CONTAINS(LCASE(?location), LCASE("${criteria.location}")))`);
  if (criteria.grade) filters.push(`FILTER(xsd:float(?grade) <= ${criteria.grade})`);

  return `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX edu: <http://example.org/education#>

  SELECT ?code ?name ?grade
  WHERE {
    ?institution a edu:Institution;
                edu:institutionCode ?code;
                edu:institutionName ?name;
                edu:district ?location;
                edu:hasCourse ?course .

    ?course rdf:type ?courseType;
            edu:lastAdmittedGrade ?grade .
    ${filters.join('\n      ')}

  }
  LIMIT 10
  `;
};


export const buildQuerySearchCourse = (criteria) => {
  let filters = [];
  if (criteria.university) filters.push(`FILTER(?institutionName = "${criteria.university}"^^xsd:string)`);
  if (criteria.grade) filters.push(`FILTER(xsd:float(?grade) <= ${criteria.grade})`);

  return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX edu: <http://example.org/education#>

    SELECT DISTINCT ?courseName ?grade
    WHERE {
    ?institution a edu:Institution;
                edu:institutionName ?institutionName;
                edu:hasCourse ?course .

    ?course edu:lastAdmittedGrade ?grade;
            rdf:type ?courseType .

    ?courseType edu:courseName ?courseName .

    ${filters.join('\n      ')}
    }
    LIMIT 10

  `;
};