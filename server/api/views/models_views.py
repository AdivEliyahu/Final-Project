import os
from django.views.decorators.http import require_GET,require_POST
from .auth_views import jwt_required
import json
from django.http import JsonResponse
from openai import OpenAI
import re

nlp = None

def load_ner_model():
    global nlp
    if nlp is None:
        import spacy
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, "NER_model", "model-best")
        nlp = spacy.load(model_path)
    return nlp


def find_entities_by_regex(text, entities):
    email_regex = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
    entities = (find_regex(text, "EMAIL", email_regex)) + entities

    phone_regex = r'\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}'
    entities = (find_regex(text, "CODE", phone_regex)) + entities

    return entities


def find_regex(text, label, regex):
    result = []
    matches = re.finditer(regex, text)
    for match in matches:
        email = match.group()
        start_char = match.start()
        end_char = match.end()
        result.append([email, label, start_char, end_char, "regex"])
    return result

def remove_duplicate_entities(entities):
    unique_entities = []
    seen_ranges = []

    # Sort by (start, -length) so longer entities come first if same start
    sorted_entities = sorted(entities, key=lambda x: (x[2], -(x[3] - x[2])))

    for entity in sorted_entities:
        start, end = entity[2], entity[3]
        overlap_found = False

        for idx, (s, e, source) in enumerate(seen_ranges):
            if not (end <= s or start >= e):
                # Overlapping found
                if entity[4] == "spacy" and source == "regex":
                    # Replace the regex one with SpaCy
                    unique_entities[idx] = entity
                    seen_ranges[idx] = (start, end, "spacy")
                # Otherwise, keep the existing one
                overlap_found = True
                break

        if not overlap_found:
            seen_ranges.append((start, end, entity[4]))
            unique_entities.append(entity)

    return unique_entities



def get_entities(text):
    if nlp is None:
        load_ner_model()

    doc = nlp(text)
    entities = [[ent.text, "CODE" if ent.label_ == "QUANTITY" else ent.label_, ent.start_char, ent.end_char, "spacy"] for ent in doc.ents]
    entities = find_entities_by_regex(text, entities)

    entities = remove_duplicate_entities(entities)
    output = {
        "text": text,
        "entities": entities
    }
    return json.dumps(output) 

    
system_prompt = """
You are an advanced text anonymization system. Your task is to determine which of the provided named entities should be masked to protect personally identifiable information (PII).

You are given:
- A full text.
- A list of named entities. Each entity includes:
  - "span_text": the matched text
  - "start_offset": character index of the match in the text
  - "end_offset": character index of the match in the text
  - "entity_type": one of PERSON, ORG, LOC, EMAIL, CODE, DATETIME, DEM, or MISC

Your task:
For each entity, return an object containing:
- "span_text"
- "start_offset"
- "end_offset"
- "identifier_type": one of:
  - "DIRECT" → must be anonymized to protect PII
  - "QUASI" → may be identifying when combined with other info
  - "NO_MASK" → does not require anonymization
- "entity_type": same as input
- "reason": a clear explanation for your classification decision

### Output format:
Return a raw JSON array (no markdown, no text around it). Example:

[
  {
    "span_text": "Dr. Emily Zhang",
    "start_offset": 0,
    "end_offset": 16,
    "identifier_type": "NO_MASK",
    "entity_type": "PERSON",
    "reason": "Doctor mentioned in a professional capacity, not the data subject."
  },
  {
    "span_text": "john.doe@gmail.com",
    "start_offset": 20,
    "end_offset": 38,
    "identifier_type": "DIRECT",
    "entity_type": "EMAIL",
    "reason": "Email belongs to the data subject and reveals identity."
  },
  {
    "span_text": "OpenAI",
    "start_offset": 50,
    "end_offset": 56,
    "identifier_type": "NO_MASK",
    "entity_type": "ORG",
    "reason": "Well-known public organization."
  }
]

### Guidelines for identifier_type:
- "DIRECT": use for entities that directly identify a specific individual (e.g., patient names, personal email, national ID, home address, personal dates).
- "QUASI": use for attributes that may become identifying when combined with others (e.g., job title + location + gender).
- "NO_MASK": use for public or professional mentions (e.g., doctors, reporters, city names, known companies).

### Clarifications:
- Do NOT anonymize doctors, public officials, or authors UNLESS they are the subject of sensitive data (e.g., "Dr. Smith was treated for cancer" → DIRECT; "Dr. Smith wrote the report" → NO_MASK).
- Do NOT hallucinate or infer new entities. Only use the provided list.
- Do NOT wrap the output in markdown or provide any explanation text.
- The "reason" field must be specific. Avoid vague justifications like "person's name" or "location." Use sentence context to support your classification.

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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": input_json}
        ]
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content

def replace_entities(gpt_response, text):
    gpt_data = json.loads(gpt_response)

    if not isinstance(gpt_data, list):
        raise ValueError("Expected a JSON list of entities")

    entities = sorted(gpt_data, key=lambda e: e["start_offset"], reverse=True)

    anonymized_text = text  # Initialize once

    for entity in entities:
        start = entity["start_offset"]
        end = entity["end_offset"]
        label = entity["entity_type"]
        identifier_type = entity["identifier_type"]

        if identifier_type == "NO_MASK":
            continue  # Do not mask

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

        return JsonResponse({"anonymized_text":anonymized_text}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



