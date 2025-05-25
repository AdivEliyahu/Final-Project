import os
from django.views.decorators.http import require_GET,require_POST
from .auth_views import jwt_required
import json
from django.http import JsonResponse
from openai import OpenAI


nlp = None

def load_ner_model():
    global nlp
    if nlp is None:
        import spacy
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, "NER_model", "model-best")
        nlp = spacy.load(model_path)
    return nlp


def get_entities(text):
    if nlp is None:
        load_ner_model()

    doc = nlp(text)
    entities = [[ent.text, ent.label_, ent.start_char, ent.end_char] for ent in doc.ents]
    output = {
        "text": text,
        "entities": entities
    }
    return json.dumps(output) 

    
prompt = """

You will receive a text along with a list of named entities extracted using a SpaCy model. Each named entity includes its character offsets in the text. Your task is to return a JSON object where each named entity contains:

- The entity itself (word or phrase).
- The provided character offsets (start and end positions).
- The identity type of the entity (`DIRECT`, `NO_MASK`, or `QUASI`).
- The entity type (`PERSON`, `CODE`, `LOC`, `ORG`, `DEM`, `DATETIME`, `QUANTITY`, `MISC`).

### **Input format:**
A JSON object containing:
- `"text"`: The original text string.
- `"entities"`: A list of lists, where each inner list contains:
  - The named entity as a string.
  - The entity type as a string (e.g., `PERSON`, `ORG`, `LOC`, etc.).
  - The starting offset of the entity in the text (integer).
  - The ending offset of the entity in the text (integer).

### **Output format:**
A JSON object with a `"named_entities"` key containing a list of objects, where each object represents a named entity with:
- `"span_text"`: The entity itself.
- `"start_offset"`: The provided starting index of the entity in the text.
- `"end_offset"`: The provided ending index of the entity in the text.
- `"identifier_type"`: One of (`DIRECT`, `NO_MASK`, `QUASI`).
- `"entity_type"`: One of (`PERSON`, `CODE`, `LOC`, `ORG`, `DEM`, `DATETIME`, `QUANTITY`, `MISC`).

---

### **Example Input:**
```json
{
  "text": "Alice moved to New York in 2022 and joined OpenAI as a researcher.",
  "entities": [
    ["Alice", "PERSON", 0, 5],
    ["New York", "LOC", 14, 22],
    ["2022", "DATETIME", 26, 30],
    ["OpenAI", "ORG", 42, 48]
  ]
}

### **Example Output:**
```
{
  "named_entities": [
    {
      "span_text": "Alice",
      "start_offset": 0,
      "end_offset": 5,
      "identifier_type": "DIRECT",
      "entity_type": "PERSON"
    },
    {
      "span_text": "New York",
      "start_offset": 14,
      "end_offset": 22,
      "identifier_type": "NO_MASK",
      "entity_type": "LOC"
    },
    {
      "span_text": "2022",
      "start_offset": 26,
      "end_offset": 30,
      "identifier_type": "DIRECT",
      "entity_type": "DATETIME"
    },
    {
      "span_text": "OpenAI",
      "start_offset": 42,
      "end_offset": 48,
      "identifier_type": "NO_MASK",
      "entity_type": "ORG"
    }
  ]
}

### **Additional Instructions:**
Use the provided character offsets as they are. Do not change or recalculate them.
The "identifier_type" should be determined based on logical inference from the entity's role in the text.
The "entity_type" should strictly map to one of the predefined types.
Return only the JSON output, without additional explanations or formatting.
If an entity appears multiple times, include each occurrence with its given offsets.
If an entity in the "entities" list is not found in the text, ignore it.
- If the surrounding sentence contains **keywords or phrases indicating personal significance** (e.g., "born on", "birthday", "married on", "graduated", "first child born", "anniversary", "death", "retired"), set `"identifier_type": "DIRECT"`.
- If the date is part of a generic action or unrelated (e.g., "promoted on", "random date", "conference on", "meeting on"), set `"identifier_type": "NO_MASK"`.
- Check the surrounding sentence in the `"text"` input for **context clues** and assign the appropriate `identifier_type`.
"""


def gpt_response(text): 
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.")
        raise ValueError("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.")
    
    client = OpenAI(api_key=api_key)

    input_json = get_entities(text)
    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": input_json}
        ]
    )
    return response.choices[0].message.content

def replace_entities(gpt_response, text):
    gpt_data = json.loads(gpt_response)
    entities = gpt_data.get("named_entities", [])
    entities = sorted(entities, key=lambda e: e["start_offset"], reverse=True)

    anonymized_text = text

    for entity in entities:
        start = entity["start_offset"]
        end = entity["end_offset"]
        label = entity["entity_type"]
        identifier_type = entity["identifier_type"]
        
        if identifier_type == "NO_MASK":
            continue # Skip entities with NO_MASK identifier type
        
        anonymized_text = anonymized_text[:start] + f"<{label}>" + anonymized_text[end:]
    
    return anonymized_text

@require_POST
def anonymize_entities(request):
    try:
        data = json.loads(request.body)
        text = data.get("text", "")

        if not text:
            return JsonResponse({"error": "No text provided"}, status=400)

        gpt_output = gpt_response(text)
        anonymized_text = replace_entities(gpt_output, text)
        return JsonResponse({"anonymized_text": anonymized_text}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



