def json_to_plantuml(data:dict) -> str:
    plantuml_str =  "@startuml Diagram\n"

    if data["diagramType"] == "classDiagram":
        plantuml_str += decodeClassDiagram(data)
    elif data["diagramType"] == "useCaseDiagram":
        print("Diagrama de casos de uso")

    plantuml_str += "@enduml"
    return plantuml_str

def decodeClassDiagram(data:dict):
    plantuml_str = ""
    for clase in data["classes"]:
        # declare the class
        plantuml_str += f"{'abstract ' if clase['isAbstract'] else ''}class {clase['name']}\n"
        
        # adding attributes
    
    return plantuml_str

def decodeUseCaseDiagram(data:dict):
    return ""
