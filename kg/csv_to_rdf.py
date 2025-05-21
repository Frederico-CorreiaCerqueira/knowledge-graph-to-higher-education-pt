import os
import pandas as pd
from rdflib import Graph, Namespace, Literal, RDF, XSD

EDU = Namespace("http://example.org/education#")


def get_value(row, column):
    return str(row[column]).strip()


def add_to_graph(graph, subject, predicate, obj):
    graph.add((subject, predicate, obj))


def create_literal(value, datatype):
    return Literal(value, datatype=datatype)


def create_str_literal(value):
    return create_literal(value, datatype=XSD.string)


def create_float_literal(value):
    if value == "---":
        value = 0.0
    else:
        value = float(value)
    return create_literal(value, datatype=XSD.float)


def create_int_literal(value):
    return create_literal(value, datatype=XSD.integer)


def normalize_name(value):
    return value.replace(" ", "_").replace(",", "").replace(".", "").replace("º", "").replace(":", "").replace(";", "")

def create_institution(g, name, code):
    inst = EDU[normalize_name(name)]
    literal = create_str_literal(name)
    add_to_graph(g, inst, RDF.type, EDU.Institution)
    add_to_graph(g, inst, EDU.institutionName, literal)
    add_to_graph(g, inst, EDU.institutionCode, create_int_literal(code))
    return inst


def create_type_course(g, name, code):
    n = normalize_name(name)
    course = EDU[n]
    literal = create_str_literal(name)
    add_to_graph(g, course, RDF.type, EDU.Course)
    add_to_graph(g, course, EDU.courseName, literal)
    add_to_graph(g, course, EDU.courseCode, create_str_literal(code))
    return course


def inst_has_course(g, inst, course):
    add_to_graph(g, inst, EDU.hasCourse, course)


def create_type(g, course_type, inst_name, course_name):
    course = EDU[normalize_name(inst_name) + "_" + normalize_name(course_name)]
    add_to_graph(g, course, RDF.type, course_type)
    return course


def create_degree(g, degree_type):
    degree = EDU[normalize_name(degree_type)]
    add_to_graph(g, degree, RDF.type, EDU.Degree)
    add_to_graph(g, degree, EDU.degreeName, create_str_literal(degree_type))
    return degree


def course_degree(g, course, degree):
    add_to_graph(g, course, EDU.awardsDegree, degree)


def create_scientific_area(g, code, name):
    scientific_area = EDU[normalize_name(name)]
    add_to_graph(g, scientific_area, RDF.type, EDU.ScientificArea)
    add_to_graph(g, scientific_area, EDU.scientificAreaCode, create_int_literal(int(float(code))))
    add_to_graph(g, scientific_area, EDU.scientificAreaName, create_str_literal(name))
    return scientific_area


def course_scientific_area(g, course, scientific_area):
    add_to_graph(g, course, EDU.hasScientificArea, scientific_area)


def last_admitted_grade(g, course, grade):
    if grade == "---":
        grade = 0
    grade = create_float_literal(float(grade))
    add_to_graph(g, course, EDU.lastAdmittedGrade, grade)


def course_available_slots(g, course, slots):
    if slots == "---":
        slots = 0
    else:
        slots = int(float(slots))
    add_to_graph(g, course, EDU.availableSlots, create_int_literal(slots))


def add_location_to_institution(g, inst, address, postal_code, district, county):
    if address:
        add_to_graph(g, inst, EDU.address, create_str_literal(address))
    if postal_code:
        add_to_graph(g, inst, EDU.postalCode, create_str_literal(postal_code))
    if district:
        add_to_graph(g, inst, EDU.locatedInDistrict, district)
    if county:
        add_to_graph(g, inst, EDU.locatedInCounty, county)


def create_district(g, district_name):
    district = EDU[normalize_name(district_name)]
    add_to_graph(g, district, RDF.type, EDU.District)
    add_to_graph(g, district, EDU.districtName, create_str_literal(district_name))
    return district


def create_county(g, county_name, district):
    county = EDU[normalize_name(county_name)]
    add_to_graph(g, county, RDF.type, EDU.County)
    add_to_graph(g, county, EDU.countyName, create_str_literal(county_name))
    add_to_graph(g, county, EDU.countyPartOfDistrict, district)
    return county


def create_graph_from_excel(output_dir = None):
    excel_file = "./docs/lista_de_vagas_para_1_fase.xlsx"
    location_file = "./docs/Localizacao.xlsx"

    # Load the main data and location data
    df = pd.read_excel(excel_file, sheet_name=0, header=3)
    location_df = pd.read_excel(location_file)

    # Create the RDF graph
    g = Graph()
    g.bind("edu", EDU)

    # Create a dictionary for location data
    location_dict = {
        row["Código do Estabelecimento"]: row
        for _, row in location_df.iterrows()
    }

    for _, row in df.iterrows():
        if pd.isna(row["Nome da Instituição"]) or pd.isna(row["Nome do Curso"]):
            continue

        inst_name = get_value(row, "Nome da Instituição")
        course_name = get_value(row, "Nome do Curso")
        inst_code =int(float( get_value(row, "Código Instit.")))

        inst = create_institution(g, inst_name, inst_code)
        course_type = create_type_course(g, course_name, get_value(row, "Código Curso"))

        course = create_type(g, course_type, inst_name, course_name)

        inst_has_course(g, inst, course)

        available_slots = get_value(row, "Vagas 2024")
        if pd.notna(available_slots):
            course_available_slots(g, course, available_slots)

        degree = create_degree(g, get_value(row, "Grau"))
        course_degree(g, course_type, degree)
        
        scientific_area = create_scientific_area(g, get_value(row, "Área Científica"), get_value(row, 8))
        course_scientific_area(g, course_type, scientific_area)

        nota = get_value(row, "Nota último colocado 1ª Fase 2023 (cont. geral)")
        if pd.notna(nota):
            last_admitted_grade(g, course, nota)

        # Add location data if available
        if inst_code in location_dict:
            location_data = location_dict[inst_code]
            district = create_district(g, location_data.get("Distrito"))
            county = create_county(g, location_data.get("Concelho"), district)
            add_location_to_institution(
                g,
                inst,
                location_data.get("Morada"),
                location_data.get("Código Postal"),
                district,
                county
            )

    file_name = "education.ttl"
    if output_dir:
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        file_name = os.path.join(output_dir, file_name)
    g.serialize(file_name, format="turtle")
    
create_graph_from_excel("ontology")
print("Successfully generated RDF with locations!")
