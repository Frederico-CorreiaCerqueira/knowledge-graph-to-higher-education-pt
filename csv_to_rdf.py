import pandas as pd
from rdflib import Graph, Namespace, Literal, RDF, XSD

ficheiro_excel = "lista_de_vagas_para_1_fase.xlsx"
df = pd.read_excel(ficheiro_excel, sheet_name=0, header=3)

g = Graph()
ENS = Namespace("http://example.org/ensino#")
g.bind("ens", ENS)

for _, row in df.iterrows():
    inst_nome = str(row["Nome da Instituição"]).strip()
    curso_nome = str(row["Nome do Curso"]).strip()
    vagas = row["Vagas 2024"]

    if pd.isna(inst_nome) or pd.isna(curso_nome):
        continue

    uri_inst = ENS[inst_nome.replace(" ", "_").replace(",", "").replace(".", "")]
    uri_curso = ENS[curso_nome.replace(" ", "_").replace(",", "").replace(".", "")]

    # Entidade instituição
    g.add((uri_inst, RDF.type, ENS.Instituicao))
    g.add((uri_inst, ENS.nomeInstituicao, Literal(inst_nome)))

    # Curso
    g.add((uri_curso, RDF.type, ENS.Curso))
    g.add((uri_curso, ENS.nomeCurso, Literal(curso_nome)))

    # Ligação entre inst e curso
    g.add((uri_inst, ENS.temCurso, uri_curso))

    # Vagas
    if pd.notna(vagas):
        try:
            g.add((uri_curso, ENS.temVagas, Literal(int(vagas), datatype=XSD.integer)))
        except:
            pass

    # Grau
    if "Grau" in row and pd.notna(row["Grau"]):
        g.add((uri_curso, ENS.temGrau, Literal(row["Grau"])))

    # Área Científica
    if "Área Científica" in row and pd.notna(row["Área Científica"]):
        g.add((uri_curso, ENS.temAreaCientifica, Literal(row["Área Científica"])))

    # Nota última colocação
    if "Nota último colocado 1ª Fase 2023 (cont. geral)" in row:
        nota = row["Nota último colocado 1ª Fase 2023 (cont. geral)"]
        if pd.notna(nota):
            try:
                g.add((uri_curso, ENS.notaUltimoColocado, Literal(float(nota), datatype=XSD.float)))
            except:
                pass

    # Códigos institucionais 
    if "Código Instit." in row and pd.notna(row["Código Instit."]):
        g.add((uri_inst, ENS.codigoInstituicao, Literal(str(row["Código Instit."]))))
    if "Código Curso" in row and pd.notna(row["Código Curso"]):
        g.add((uri_curso, ENS.codigoCurso, Literal(str(row["Código Curso"]))))


g.serialize("ensino.ttl", format="turtle")
print("RDF enriquecido gerado com sucesso!")
