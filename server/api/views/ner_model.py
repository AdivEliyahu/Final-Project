import os
from django.views.decorators.http import require_GET,require_POST
from .auth_views import jwt_required


nlp = None

def load_ner_model():
    global nlp
    if nlp is None:
        import spacy
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, "NER_model", "model-best")
        nlp = spacy.load(model_path)
    return nlp


def get_entities(text="Hello, my name is John Doe and I live in New York City."): 

    if nlp is None:
        load_ner_model()

    doc = nlp(text)
    entities = [[ent.text, ent.label_] for ent in doc.ents]
    return entities


