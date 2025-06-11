import joblib
import numpy as np
from typing import Tuple
from sklearn.base import BaseEstimator

class ClasificadorPLN:
    def __init__(self, modelo_path: str, vectorizer_path: str):
        self.model = joblib.load(modelo_path)
        self.vectorizer = joblib.load(vectorizer_path)
        self.diagram_types = {
            'clase': ['clase', 'clases', 'atributos', 'métodos', 'herencia'],
            'secuencia': ['secuencia', 'mensajes', 'llamadas', 'interacción'],
            'actividad': ['actividad', 'flujo', 'proceso', 'decisiones'],
            'casos_uso': ['casos uso', 'actores', 'sistema', 'interacciones']
        }
    
    def predecir(self, texto: str) -> Tuple[str, float]:
        # Primero verificar palabras clave (como fallback)
        detected_type = self._detect_by_keywords(texto.lower())
        
        # Luego usar el modelo
        texto_vec = self.vectorizer.transform([texto])
        
        if hasattr(self.model, 'predict_proba'):
            probas = self.model.predict_proba(texto_vec)[0]
            model_type = self.model.classes_[np.argmax(probas)]
            confidence = np.max(probas)
            
            # Combinar ambos resultados
            if detected_type and detected_type != model_type and confidence < 0.7:
                return detected_type, 0.7  # Priorizar palabras clave si el modelo no está seguro
            return model_type, confidence
        else:
            return self.model.predict(texto_vec)[0], 1.0
    
    def _detect_by_keywords(self, texto: str) -> str:
        for diagram_type, keywords in self.diagram_types.items():
            if any(keyword in texto for keyword in keywords):
                return diagram_type
        return None