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
    code = int(float(code))
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


def course_degree(g, course, degree_type):
    add_to_graph(g, course, EDU.degreeType, create_str_literal(degree_type))


def course_scientific_area(g, course, area):
    add_to_graph(g, course, EDU.scientificArea, create_str_literal(area))


def last_admitted_grade(g, course, grade):
    if grade == "---":
        grade = create_str_literal("---")
    else:
        grade = create_float_literal(float(grade))
    add_to_graph(g, course, EDU.lastAdmittedGrade, grade)


def course_available_slots(g, course, slots):
    if slots == "---":
        slots = 0
    else:
        slots = int(float(slots))
    add_to_graph(g, course, EDU.availableSlots, create_int_literal(slots))


def create_graph_from_excel():
    excel_file = "lista_de_vagas_para_1_fase.xlsx"
    df = pd.read_excel(excel_file, sheet_name=0, header=3)
    g = Graph()
    g.bind("edu", EDU)

    for _, row in df.iterrows():

        if pd.isna(row["Nome da Instituição"]) or pd.isna(row["Nome do Curso"]):
            continue

        inst_name = get_value(row, "Nome da Instituição")
        course_name = get_value(row, "Nome do Curso")

        inst = create_institution(g, inst_name, get_value(row, "Código Instit."))
        course_type = create_type_course(g, course_name, get_value(row, "Código Curso"))

        course = create_type(g, course_type, inst_name, course_name)

        inst_has_course(g, inst, course)

        available_slots = get_value(row, "Vagas 2024")
        if pd.notna(available_slots):
            course_available_slots(g, course, available_slots)

        course_degree(g, course, get_value(row, "Grau"))
        course_scientific_area(g, course, get_value(row, "Área Científica"))

        nota = get_value(row, "Nota último colocado 1ª Fase 2023 (cont. geral)")
        if pd.notna(nota):
            last_admitted_grade(g, course, nota)

    g.serialize("education.ttl", format="turtle")


create_graph_from_excel()
print("Successfully generated RDF!")
