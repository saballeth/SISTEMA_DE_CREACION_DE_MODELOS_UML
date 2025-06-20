
import json
import os
import subprocess
import sys
from decoder import DecodeClass, DecodeUseCase, DecodeSequence, DecodeActivity, DecodeState

class JsonPuml:

    def __init__(self, config: dict):

        try:
            self._plant_uml_path = config['plant_uml_path']
            self._plant_uml_version = config['plant_uml_version']
            self._json_path = config['json_path']
            self._output_path = config['output_path']
            self._diagram_name = config['diagram_name']

        # Cargar los datos del archivo JSON
            self._data = self._get_data()

        # Convertir los datos JSON a código PlantUML
            self._code = self._json_to_plantuml()

        except KeyError as e:
            print(f"Error de configuracion: falta la clave {e} en el diccionario de configuracion")
            sys.exit(1)
        except Exception as e:
            print(f"Error inesperado durante la inicializacion de {e}")
            sys.exit(1)



    def generate_diagram(self):
        
        try:
        # Crear la carpeta de salida si no existe
            os.makedirs(self._output_path, exist_ok=True)

        # Ruta del archivo de entrada .puml
            out = os.path.join(self._output_path, self._diagram_name + ".puml")

        # Ruta al archivo JAR de PlantUML
            plant_uml = os.path.join(self._plant_uml_path, self._plant_uml_version)

        # Guardar el código PlantUML en un archivo
            with open(out, "w", encoding="utf-8") as output:
                output.write(self._code)

        # Ejecutar PlantUML para generar la imagen
            subprocess.run([
                "java", "-jar", plant_uml,  # Ejecutar PlantUML
                "-o", self._output_path,    # Carpeta de salida
                out                         # Archivo .puml de entrada
            ], check=True)

        except FileNotFoundError as e:
            print(f"Error: Archivo no encontrado - {e}")
            sys.exit(1)
        except subprocess.CalledProcessError as e:
            print(f"Error al ejecutar PlantUML: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Error inesperado al generar el diagrama: {e}")
            sys.exit(1)


    def _get_data(self) -> dict:

        try:
            with open(self._json_path, "r", encoding="utf-8") as input:
                data = json.load(input)
            return data
        except FileNotFoundError as e:
            print(f"Error, el archivo JSON no fue encontrado: {e}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error, Archivo JSON mal formado: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Error inesperado al cargar el archivo JSON: {e}")
            sys.exit(1)


    class DiagramGenerator:
        def __init__(self, raw_data: dict, detected_type: str = None):
            self._data = raw_data
            self._diagram_type = detected_type or self._data.get("diagramType", "")

        def generate(self) -> str:
            try:
                plantuml_str = "@startuml Diagram\n"
            
                if self._diagram_type == "classDiagram":
                    plantuml_str += DecodeClass(self._data).get_code()
                elif self._diagram_type == "useCaseDiagram":
                    plantuml_str += DecodeUseCase(self._data).get_code()
                elif self._diagram_type == "sequenceDiagram":
                    plantuml_str += DecodeSequence(self._data).get_code()
                elif self._diagram_type == "activityDiagram":
                    plantuml_str += DecodeActivity(self._data).get_code()
                elif self._diagram_type == "stateDiagram":
                    plantuml_str += DecodeState(self._data).get_code()
                else:
                    raise ValueError(f"Tipo de diagrama '{self._diagram_type}' no soportado.")
            
                plantuml_str += "@enduml"
                return plantuml_str

            except Exception as e:
                raise RuntimeError(f"Error generando código PlantUML: {e}")

class DecodeUseCase:
    """
    Esta clase se encarga de generar el código PlantUML para un diagrama de casos de uso.
    El código es generado a partir de los datos proporcionados en formato JSON, los cuales 
    contienen información sobre actores, casos de uso, paquetes y relaciones.

    Atributos:
    - _data (dict): Los datos en formato JSON que describen el diagrama de casos de uso.
    - _use_case_code (str): El código PlantUML generado para el diagrama.
    """

    def __init__(self, data: dict):
        """
        Inicializa la clase con los datos del diagrama en formato JSON.

        Parámetros:
        - data (dict): El diccionario que contiene los datos del diagrama en formato JSON.
        """
        try:
            self._data = data
            self._use_case_code = self._generate_code()
        except Exception as e:
            print("Error inesperado en DecodeUseCase: {e}")
            sys.exit(1)

    def get_code(self) -> str:
        """
        Obtiene el código PlantUML generado para el diagrama de casos de uso.

        Retorna:
        - str: El código PlantUML para el diagrama.
        """
        return self._use_case_code

    def _generate_code(self) -> str:
        """
        Genera el código PlantUML para el diagrama de casos de uso a partir de los datos JSON.

        Este método recorre los datos JSON y genera las representaciones correspondientes para
        los actores, casos de uso, paquetes y relaciones.

        Retorna:
        - str: El código PlantUML generado para el diagrama.
        """
        try:
            plantuml_str = ""

        # Actores
            for actor in self._data.get("actors", []):
                plantuml_str = self._decodeUseCaseActor(plantuml_str, actor)
            
        # Casos de uso globales
            for use_case in self._data.get("useCases", []):
                plantuml_str = self._decodeUseCase(plantuml_str, use_case)

        # Paquetes
            plantuml_str = self._decodeUseCasePackage(plantuml_str, self._data)

        # Relaciones
            for relation in self._data.get("relationships", []):
                plantuml_str = self._decodeRelationships(plantuml_str, relation)     

            return plantuml_str
        except Exception as e: 
            print(f"Error inesperado al generar el codigo PlantUML: {e}")
            sys.exit(1)
    
    def _decodeUseCaseActor(self, current_code: str, data) -> str:
        """
        Decodifica un actor y lo convierte a código PlantUML.

        Parámetros:
        - current_code (str): El código PlantUML generado hasta el momento.
        - data (dict): Los datos del actor (nombre, alias, estereotipo, etc.).

        Retorna:
        - str: El código PlantUML actualizado con el actor.
        """
        try:     
            plantuml_str = current_code

            actor_name = data.get("name", "")
            actor_alias = data.get("alias", "") 
            actor_stereotype = f' <<{data["stereotype"]}>>' if "stereotype" in data else ""
            actor_business = "/" if data.get("business", False) else ""

            if actor_name:
                plantuml_str += f"actor{actor_business} \"{actor_name}\""
                if actor_alias:
                    plantuml_str += f" as {actor_alias}"
                plantuml_str += actor_stereotype + "\n"
        
            return plantuml_str
        except Exception as e:
            print(f"Error inesperado al decodificar actor: {e}")
            sys.exit(1)

    def _decodeUseCase(self, current_code: str, data) -> str:
        """
        Decodifica un caso de uso y lo convierte a código PlantUML.

        Parámetros:
        - current_code (str): El código PlantUML generado hasta el momento.
        - data (dict): Los datos del caso de uso (nombre, alias, estereotipo, etc.).

        Retorna:
        - str: El código PlantUML actualizado con el caso de uso.
        """
        try:
            plantuml_str = current_code

            usecase_name = data.get("name", "")
            if usecase_name:
                usecase_business = "/" if data.get("business", False) else ""
                usecase_alias = data.get("alias", "")
                usecase_stereotype = f' <<{data["stereotype"]}>>' if "stereotype" in data else ""
                if usecase_alias:
                    plantuml_str += f'usecase{usecase_business} (\"{usecase_name}\") as {usecase_alias} {usecase_stereotype}\n'
    
            return plantuml_str
        except Exception as e:
            print(f"Error inesperado al decodificar caso de uso: {e}")
            sys.exit(1)


    def _decodeUseCasePackage(self, current_code: str, data) -> str:
        """
        Decodifica los paquetes de casos de uso y actores, generando el código PlantUML correspondiente.

        Parámetros:
        - current_code (str): El código PlantUML generado hasta el momento.
        - data (dict): Los datos del paquete (que contiene casos de uso y actores).

        Retorna:
        - str: El código PlantUML actualizado con los paquetes.
        """
        try:
            plantuml_str = current_code
            packages = data.get("packages", [])
            if not packages:
                return plantuml_str
        
            for package in packages:
                plantuml_str += f'package "{package["name"]}" as {package["alias"]} {{\n'

                for use_case in package.get("useCases", []):
                    plantuml_str = self._decodeUseCase(plantuml_str, use_case) 

                for actor in package.get("actors", []):
                    plantuml_str = self._decodeUseCaseActor(plantuml_str, actor)

                plantuml_str = self._decodeUseCasePackage(plantuml_str, package)

                plantuml_str += "}\n" 

            return plantuml_str
        except Exception as e:
            print(f"Error inesperado al decodificar paquete: {e}")
            sys.exit(1)

    def _decodeRelationships(self, current_code: str, data) -> str:
        """
        Decodifica las relaciones entre actores y casos de uso y las convierte a código PlantUML.

        Parámetros:
        - current_code (str): El código PlantUML generado hasta el momento.
        - data (dict): Los datos de la relación (tipo, principal, secundario, dirección, etc.).

        Retorna:
        - str: El código PlantUML actualizado con la relación.
        """
        try:

            plantuml_str = current_code

            relation_type = data.get("type", "")
            relation_principal = data.get("principal", "")
            relation_secondary = data.get("secondary", "")
            relation_direction = data.get("direction", "")
            relation_label = f":\"{data.get('label', '')}\"" if data.get('label') else ""

            # Solo actor_actor
            relation_extend = data.get("extend", "")
        
            # Solo usecase_usecase 
            relation_stereotype = data.get("stereotype", "")

            if(relation_principal and relation_secondary):
                if relation_type == "actor_actor": 
                    if relation_extend == ">":
                        plantuml_str += f"{relation_secondary} <|-- {relation_principal}"
                    elif relation_extend == "<":
                        plantuml_str += f"{relation_principal} <|-- {relation_secondary}"
                    else:
                        plantuml_str += f"{relation_principal} -{relation_direction}-> {relation_secondary}"
                    plantuml_str += relation_label + "\n"
                    
                elif relation_type == "actor_usecase":
                    plantuml_str += f"{relation_principal} -{relation_direction}-> {relation_secondary}{relation_label}\n"

                elif relation_type == "useCase_usecase":
                    if relation_stereotype == "include" :
                        plantuml_str += f"{relation_principal} .> {relation_secondary}: include\n"
                    elif relation_stereotype == "extends":
                        plantuml_str += f"{relation_principal} .> {relation_secondary}: extends\n"

                elif relation_type == "package_package":
                    plantuml_str += f"{relation_principal} -{relation_direction}-> {relation_secondary}{relation_label}\n"

            return plantuml_str
        except Exception as e:
            print(f"Error inesperado al decodificar relaciones: {e}")
            sys.exit(1)

class DecodeClass:
    """
    Esta clase genera código PlantUML para diagramas de clases a partir de un archivo de datos JSON.
    
    Atributos:
        _data (dict): Los datos en formato JSON que describen las clases, atributos, métodos y relaciones.
        _visibilities (dict): Diccionario que mapea los niveles de visibilidad a su representación PlantUML.
        _relations_type (dict): Diccionario que mapea los tipos de relaciones a su representación PlantUML.
        _class_code (str): El código PlantUML generado a partir de los datos JSON.

    Métodos:
        __init__(self, data: dict): Inicializa la clase con los datos del diagrama de clases en formato JSON.
        get_code(self) -> str: Retorna el código PlantUML generado para el diagrama de clases.
        _generate_code(self) -> str: Genera el código PlantUML a partir de los datos del diagrama de clases.
    """
    
    def __init__(self, data: dict):
        """
        Inicializa la clase con los datos del diagrama de clases en formato JSON.

        Parámetros:
            data (dict): Los datos del diagrama de clases, incluyendo clases, atributos, métodos y relaciones.
        """
        try:
            
            self._data = data

        # Mapeo de visibilidades en PlantUML
            self._visibilities = {
                "private": "-",
                "protected": "#",
                "package private": "~",
                "public": "+"
            }

            # Mapeo de tipos de relaciones en PlantUML
            self._relations_type = {
                "inheritance": "<|--",
                "composition": "*--",
                "aggregation": "o--",
                "association": "--",
                "instantiation": "..|>",
                "realization": "<|..",
            }

            # Genera el código PlantUML
            self._class_code = self._generate_code()
        except Exception as e:
            print(f"Error inesperado en DecodeClass: {e}")
            sys.exit(1)

    def get_code(self) -> str:
        """
        Obtiene el código PlantUML generado para el diagrama de clases.

        Retorna:
            str: El código PlantUML para el diagrama de clases.
        """
        return self._class_code

    def _generate_code(self) -> str:
        """
        Genera el código PlantUML a partir de los datos del diagrama de clases en formato JSON.

        Este método recorre los datos del diagrama y construye el código PlantUML correspondiente
        a las clases, atributos, métodos y relaciones entre clases.

        Retorna:
            str: El código PlantUML generado para el diagrama de clases.
        """
        try:
            plantuml_str = ""

            # Recorre los elementos declarados (clases)
            for element in self._data.get('declaringElements', []):
                # Declara la clase
                type = element.get('type', '')
                elementName = element.get('name', '')
                plantuml_str += f"{type} {elementName}\n"
            
                # Añadir atributos para las clases
                for attribute in element.get('attributes', []):
                    attributeName = attribute.get('name', '')
                    attributeType = attribute.get('type', '')
                    visibility = self._visibilities[attribute.get('visibility', '')]
                    static = "{isStatic}" if attribute.get('isStatic', False) else ''
                    final = "{final}" if attribute.get('isFinal', False) else ''
                    plantuml_str += f"{elementName} : {visibility} {static} {final} {attributeType} {attributeName}\n"

                # Añadir métodos para las clases    
                for method in element.get('methods', []):
                    methodName = method.get('name', '')
                    abstract = "{abstract}" if method.get('isAbstract', False) else ''
                    visibility = self._visibilities[method.get('visibility', 'public')]
                    returnType =  method.get('returnType', 'void')
                
                    # Añadir parámetros a los métodos
                    params = ""
                    for param in method.get('params', []):
                        params += f"{param.get('type', '')} {param.get('name', '')} "

                    plantuml_str += f"{elementName} : {visibility} {abstract} {returnType} {methodName}({params[:-1]})\n"  # params[:-1] elimina el último espacio
            
                # Añadir relaciones entre clases
                for relation in self._data.get('relationShips', []):
                    relationType = self._relations_type[relation.get('type', '')]
                    source = relation.get('source', '') 
                    target = relation.get('target', '')
                    multiplicityEnd1 = f"\"{relation['multiplicity'][0]}\"" if 'multiplicity' in relation else ''
                    multiplicityEnd2 = f"\"{relation['multiplicity'][3]}\"" if 'multiplicity' in relation else ''
            
                    plantuml_str += f"{source} {multiplicityEnd1} {relationType} {multiplicityEnd2} {target}\n"

                return plantuml_str
        except Exception as e:
            print(f"Error inesperado al generar codigo PlantUML: {e}")
            sys.exit(1)

class DecodeSequence:
    def __init__(self, data: dict):
        self._data = data

    def get_code(self) -> str:
        code = ""
        participants = self._data.get("participants", [])
        for p in participants:
            code += f"participant {p}\n"
        for msg in self._data.get("messages", []):
            frm = msg.get("from")
            to = msg.get("to")
            txt = msg.get("text", "")
            code += f"{frm} -> {to}: {txt}\n"
        return code

class DecodeActivity:
    def __init__(self, data: dict):
        self._data = data

    def get_code(self) -> str:
        code = ""
        for step in self._data.get("steps", []):
            typ = step.get("type")
            name = step.get("name")
            if typ == "start":
                code += "start\n"
            elif typ == "action":
                code += f":{name};\n"
            elif typ == "decision":
                code += f"if ({name}) then (yes)\n"
                for act in step.get("yes", []):
                    code += f":{act};\n"
                code += "else (no)\n"
                for act in step.get("no", []):
                    code += f":{act};\n"
                code += "endif\n"
            elif typ == "stop":
                code += "stop\n"
        return code

class DecodeState:
    def __init__(self, data: dict):
        self._data = data

    def get_code(self) -> str:
        code = ""
        for st in self._data.get("states", []):
            code += f"state {st['name']}\n"
        for tr in self._data.get("transitions", []):
            frm = tr.get("from")
            to = tr.get("to")
            label = tr.get("trigger", "")
            code += f"{frm} --> {to} : {label}\n"
        return code
