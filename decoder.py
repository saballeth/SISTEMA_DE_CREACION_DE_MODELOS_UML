def json_to_plantuml(data:dict) -> str:
    plantuml_str =  "@startuml Diagram\n"

    if data["diagramType"] == "classDiagram":
        plantuml_str += decodeClassDiagram(data)
    elif data["diagramType"] == "useCaseDiagram":
        print("Diagrama de casos de uso")

    plantuml_str += "@enduml"
    return plantuml_str

def decodeClassDiagram(data:dict) -> str:
    visibilities = {
        "private": "-",
        "protected": "#",
        "package private": "~",
        "public": "+"
    }
    relations_type = {
        "inheritance": "<|--",
        "composition": "*--",
        "aggregation": "o--",
        "association": "--",
        "instantiation": "",
        "realization": "",
    }

    isStatic = '{static} '
    plantuml_str = ""
    # class
    for clase in data.get("classes", []):
        # declare the class
        plantuml_str += f"{'abstract ' if clase.get('isAbstract', '') else ''}class {clase['name']}\n"
        
        # adding attributes for clases
        for attribute in clase.get("attributes", []):
            attribute_str = f"{clase['name']} : {visibilities[attribute.get('visibility', '')]}{isStatic if attribute['isStatic'] else ''}{attribute['name']} {attribute['type']}\n"
            plantuml_str += attribute_str

        # adding methods for clases    
        for method in clase.get('methods', []):
            plantuml_str += f"{clase.get('name', '')} : {method.get('returnType', '')} {method.get('name', '')}()\n"
        
        # adding relationsihps
        for relation in clase.get("relationships", []):
            relation_str = f"{clase['name']} {relations_type[relation.get('type', [])]} {relation['target']}\n"
            plantuml_str += relation_str
    
    # interfaces
    for interfaz in data.get("interfaces", []):
        plantuml_str += f"interfaz {interfaz.get('name', '')}\n"
        for method in interfaz.get('methods', []):
            plantuml_str += f"{interfaz.get('name', '')} : {method.get('returnType', '')} {method.get('name', '')}()\n"
    return plantuml_str

def decodeUseCaseDiagram(data:dict):
    return ""
