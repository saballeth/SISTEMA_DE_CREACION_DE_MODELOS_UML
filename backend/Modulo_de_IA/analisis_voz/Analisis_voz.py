from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

class ClasificadorPLN:
    def __init__(self, modelo_path='modelo_texto.joblib', vectorizer_path='vectorizer.joblib'):
        self.vectorizer = joblib.load(vectorizer_path)
        self.modelo = joblib.load(modelo_path)

    def predecir(self, texto: str) -> str:
        texto_vectorizado = self.vectorizer.transform([texto])
        prediccion = self.modelo.predict(texto_vectorizado)
        return prediccion[0]