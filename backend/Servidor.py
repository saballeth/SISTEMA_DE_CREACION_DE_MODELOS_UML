from flask import Flask, request, jsonify
from Modulo_de_IA.analisis_Imagen.Analisis_imagen import ClasificadorImagen
from Modulo_de_IA.analisis_voz.Analisis_voz import ClasificadorPLN
app = Flask(__name__)

clasificador_imagen = ClasificadorImagen("ruta_al_modelo/best.pt")
clasificador_texto = ClasificadorPLN()

@app.route('/clasificar/imagen', methods=['POST'])
def clasificar_imagen():
    imagen = request.files['imagen']
    path = "temp.jpg"
    imagen.save(path)
    tipo = clasificador_imagen.predecir(path)
    return jsonify({"tipo_diagrama": tipo})

@app.route('/clasificar/texto', methods=['POST'])
def clasificar_texto():
    texto = request.json.get("descripcion", "")
    tipo = clasificador_texto.predecir(texto)
    return jsonify({"tipo_diagrama": tipo})
