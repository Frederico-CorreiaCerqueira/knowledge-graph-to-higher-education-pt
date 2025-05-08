# Knowledge Graph of Higher Education in Portugal

Building a Knowledge Graph for higher education in Portugal, modeling institutions, courses, available slots, scientific areas, and admission scores, with RDF data generated from Excel files and an ontology defined in OWL.

## Features
- Conversion of Excel data into **RDF**.
- Definition of an **OWL ontology** modeling:
  - Higher education institutions
  - Courses
  - Available slots
  - Scientific area
  - Last admitted student's score
  - Institutional and course codes
- Generation of a Knowledge Graph for semantic exploration of the data.
- Execution of SPARQL queries over the generated graph.

## Technologies Used
- Python (`pandas`, `rdflib`)
- RDF/Turtle
- OWL Ontology
- SPARQL

## Data Structure
- Each **institution** is linked to its **courses**.
- Each **course** has properties such as academic degree, scientific area, available slots, and admission score.

---

**Note:** This Knowledge Graph was developed as part of the **Knowledge Networks** course of the **Master’s Degree in Computer Science** (specialization in Computer Engineering) at the **Faculty of Sciences, University of Lisbon**.

**Project developed by students:**
- Frederico Correia Cerqueira
- Joana Chuço
- Gonçalo Garcias
- João [last name]

---
