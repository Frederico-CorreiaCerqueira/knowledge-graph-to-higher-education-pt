
export const buildQuerySearchUniversity = (criteria) => {
  let filters = [];
  if (criteria.course) filters.push(`FILTER(CONTAINS(LCASE(?courseName), LCASE("${criteria.course}")))`);
  if (criteria.location) filters.push(`FILTER(LCASE(?districtName) = LCASE("${criteria.location}"))`);
  if (criteria.grade) filters.push(`FILTER(xsd:float(?grade) <= ${criteria.grade})`);
  

  return `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX edu: <http://example.org/education#>

  SELECT ?institutionCode ?institutionName ?grade ?courseCode ?courseName
  WHERE {
    ?institution a edu:Institution;
                edu:institutionCode ?institutionCode ;
                edu:institutionName ?institutionName ;
                edu:locatedInDistrict ?location ;
                edu:hasCourse ?course .
    
    ?location edu:districtName ?districtName .

    ?course rdf:type ?courseType;
            edu:lastAdmittedGrade ?grade .

    ?courseType edu:courseName ?courseName ;
                edu:courseCode ?courseCode .

    ${filters.join('\n      ')}
  }
  `;
};


export const buildQuerySearchCourse = (criteria) => {
  let filters = [];
  if (criteria.university) filters.push(`FILTER(?institutionName = "${criteria.university}"^^xsd:string)`);
  if (criteria.grade) filters.push(`FILTER(xsd:float(?grade) <= ${criteria.grade})`);
  if (criteria.scientificArea) filters.push(`FILTER(?scientificArea = "${criteria.scientificArea}"^^xsd:string)`);

  return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX edu: <http://example.org/education#>

    SELECT DISTINCT ?institutionName ?courseName ?grade ?scientificArea ?degree
    WHERE {
            ?institution a edu:Institution;
                edu:institutionName ?institutionName ;
                edu:hasCourse ?course .

            ?course edu:lastAdmittedGrade ?grade ;
            		rdf:type ?courseType .

            ?courseType edu:courseName ?courseName ;
            			edu:awardsDegree ?degree_type ;
                		edu:hasScientificArea ?sa .

            ?degree_type edu:degreeName ?degree .

            ?sa edu:scientificAreaName ?scientificArea .

    ${filters.join('\n      ')}
    }

  `;
};