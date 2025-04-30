from django.views.decorators.http import require_GET,require_POST
import json
from django.http import JsonResponse
from db_connection import db 
from datetime import datetime


@require_POST
def save_document(request):
    try:
        data = json.loads(request.body)
        doc_name = data.get("docName")
        email = data.get("email")
        text = data.get("text")

        if not all([doc_name, email, text]):
            return JsonResponse({"error": "Email, Document Name, and text are required."}, status=400)

        users_docs_collection = db["usersDocs"]
        update_path = f"user_docs.{doc_name}"

        result = users_docs_collection.update_one(
            {"email": email},
            {
                "$set": {
                    update_path: {
                        "date": datetime.utcnow().isoformat(),
                        "text": text
                    }
                }
            },
            upsert=True
        )

        return JsonResponse({"message": "Document saved successfully."}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
