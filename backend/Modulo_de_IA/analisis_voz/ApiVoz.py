import speech_recognition as sr

class SpeechToText:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        
    def transcribe(self, audio_file: str) -> str:
        """Convierte audio a texto"""
        with sr.AudioFile(audio_file) as source:
            audio = self.recognizer.record(source)
            try:
                return self.recognizer.recognize_google(audio, language="es-ES")
            except Exception as e:
                print(f"Error en transcripción: {e}")
                return ""