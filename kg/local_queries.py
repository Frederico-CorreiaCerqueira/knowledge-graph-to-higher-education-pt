from rdflib import Graph

file = "./education.ttl"
g = Graph()
g.parse(file, format="ttl")

# SPARQL query to get university names and codes
query = """
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
"""

results = g.query(query)
print("List of universities (institution | course):")
for row in results:
    print(f"{row.institution} | {row.course} | {row.grade}")


"""
from rdflib import Graph

file = "./education.ttl"
g = Graph()
g.parse(file, format="ttl")

SPARQL query to get university names and codes
query = 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX edu: <http://example.org/education#>

SELECT DISTINCT ?institution ?courseName
WHERE {
    ?institution a edu:Institution;
        edu:institutionName "Escola Superior Náutica Infante D. Henrique"^^xsd:string;
        edu:hasCourse ?course .
    ?course edu:lastAdmittedGrade "131.6"^^xsd:float.
    
    ?course rdf:type ?courseType .
    ?courseType edu:courseName ?courseName .
    
    # FILTER(xsd:float(?grade) < 140)
    

  ?institution a edu:Institution;
      edu:district "Lisboa"^^xsd:string;
      edu:hasCourse ?course .
    ?course rdf:type edu:Engenharia_Eletrotécnica_Marítima;
        edu:lastAdmittedGrade ?grade;

    
  # Filtros opcionais — ativa só os que precisares
  # FILTER(CONTAINS(LCASE(?courseName), "engenharia"))
  # FILTER(CONTAINS(LCASE(?location), "lisboa"))
  # FILTER(xsd:float(?grade) >= 140)
}
LIMIT 10

results = g.query(query)
print("List of universities (institution | course):")
for row in results:
    print(f"{row.institution} | {row.courseName}")
"""