import pandas as pd

excel_file = "lista_de_vagas_para_1_fase.xlsx"

xls = pd.ExcelFile(excel_file)
print("Folhas disponíveis:")
print(xls.sheet_names)

# Escolher a primeira folha e ignorar as 2 primeiras linhas
df = pd.read_excel(excel_file, sheet_name=0, header=3)

# Mostrar as colunas e as primeiras linhas
print("\nColunas da folha selecionada:")
print(df.columns)
print("\nPrimeiras 5 linhas:")
print(df.head())
