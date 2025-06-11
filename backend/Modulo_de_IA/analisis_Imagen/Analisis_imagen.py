from ultralytics import YOLO
import cv2
from typing import Optional, Tuple
import numpy as np

class ClasificadorImagen:
    def __init__(self, model_path: str, conf_threshold: float = 0.5):
        """
        Inicializa el clasificador de imágenes.
        
        Args:
            model_path: Ruta al modelo YOLO preentrenado
            conf_threshold: Umbral de confianza para las predicciones
        """
        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold
        self.last_inference_time = 0  # Para medir performance

    def predecir(self, imagen_path: str) -> Tuple[str, float]:
        """
        Realiza la predicción sobre la imagen.
        
        Args:
            imagen_path: Ruta a la imagen o frame numpy array
            
        Returns:
            Tupla con (nombre_clase, confianza)
        """
        try:
            # Medir tiempo de inferencia
            start_time = cv2.getTickCount()
            
            results = self.model(imagen_path, verbose=False)  # verbose=False para menos output
            
            # Calcular tiempo de inferencia
            self.last_inference_time = (cv2.getTickCount() - start_time) / cv2.getTickFrequency()
            
            if not results or len(results[0]) == 0:
                return "Desconocido", 0.0

            # Obtener la clase con más confianza
            top1_idx = results[0].probs.top1
            confianza = results[0].probs.top1conf.item()
            
            if confianza < self.conf_threshold:
                return "Desconocido", confianza
                
            nombre_clase = results[0].names[top1_idx]
            return nombre_clase, confianza
            
        except Exception as e:
            print(f"Error en predicción de imagen: {e}")
            return "Error", 0.0

    def predecir_desde_array(self, image_array: np.ndarray) -> Tuple[str, float]:
        """Predice directamente desde un array numpy (útil para video/stream)"""
        return self.predecir(image_array)