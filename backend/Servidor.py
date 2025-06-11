from flask import send_file
from diagram_generator import DiagramGenerator  # Importa tu clase que genera PlantUML

@app.route("/api/generate_from_image", methods=["POST"])
def generate_from_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    detected_type = predict_image(path)  # Usa tu modelo YOLOv8 aquí
    dummy_data = {}  # Aquí deberás construir o inferir datos (a futuro) para cada tipo de diagrama
    plantuml = DiagramGenerator(dummy_data, detected_type).generate()

    return jsonify({"type": detected_type, "plantuml": plantuml})

@app.route("/api/generate_from_text", methods=["POST"])
def generate_from_text():
    text = request.json.get("text", "")
    if not text:
        return jsonify({"error": "Missing text"}), 400

    detected_type = predict_text(text)
    dummy_data = {}  # Simulador (a reemplazar cuando tengas datos reales)
    plantuml = DiagramGenerator(dummy_data, detected_type).generate()

    return jsonify({"type": detected_type, "plantuml": plantuml})
