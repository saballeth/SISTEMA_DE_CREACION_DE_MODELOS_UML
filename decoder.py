def json_to_plantuml(data:dict) -> str:
    plantuml_str =  "@startuml Diagram\n"

    if data["diagramType"] == "classDiagram":
        plantuml_str += decodeClassDiagram(data)
    elif data["diagramType"] == "useCaseDiagram":
        print("Diagrama de casos de uso")

    plantuml_str += "@enduml"
    return plantuml_str

def decodeClassDiagram(data:dict):
    visibilities = {
        "private": "-",
        "protected": "#",
        "package private": "~",
        "public": "+"
    }
    isStatic = '{static} '
    plantuml_str = ""
    for clase in data["classes"]:
        
        # declare the class
        plantuml_str += f"{'abstract ' if clase['isAbstract'] else ''}class {clase['name']}\n"
        
        # adding attributes
        for attribute in clase["attributes"]:
            attribute_str = f"{clase['name']} : {visibilities[attribute['visibility']]}{isStatic if attribute['isStatic'] else ''}{attribute['name']} {attribute['type']}\n"
            plantuml_str += attribute_str

    return plantuml_str

def decodeUseCaseDiagram(data:dict):
    return ""
