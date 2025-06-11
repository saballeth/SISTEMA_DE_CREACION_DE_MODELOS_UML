from ultralytics import YOLO
import cv2

class ClasificadorImagen:
    def __init__(self, model_path: str):
        self.model = YOLO(model_path)

    def predecir(self, imagen_path: str) -> str:
        results = self.model(imagen_path)
        if not results:
            return "Desconocido"

        # Obtener la clase con más confianza
        nombre_clase = results[0].names[results[0].probs.top1]
        return nombre_clase
