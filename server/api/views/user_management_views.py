from django.views.decorators.http import require_GET,require_POST
import json
from django.http import JsonResponse
from db_connection import db 
from datetime import datetime
from .auth_views import decode_jwt

@require_POST
def save_document(request):
    try:
        data = json.loads(request.body)
        doc_name = data.get("docName")
        token = data.get("token")
        text = data.get("text")
        date = data.get("date")

        payload = decode_jwt(token)  
        email = payload.get("email")


        if not all([doc_name, email, text]):
            return JsonResponse({"error": "Email, Document Name, and text are required."}, status=400)

        users_docs_collection = db["usersDocs"]
        update_path = f"user_docs.{doc_name}"

        result = users_docs_collection.update_one(
            {"email": email},
            {
                "$set": {
                    update_path: {
                        "date": date,
                        "text": text
                    }
                }
            },
            upsert=True
        )

        return JsonResponse({"message": "Document saved successfully."}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




@require_GET
def get_user_doc_names(request):
    try:
        access_token = request.headers.get("Authorization")
        payload = decode_jwt(access_token)  
        email = payload.get("email")

        if not email:
            return JsonResponse({"error": "Email is required."}, status=400)

        users_docs_collection = db["usersDocs"]
        user_docs = users_docs_collection.find_one({"email": email})['user_docs']

        if not user_docs:
            return JsonResponse({"docNames": []}, status=200)

        doc_names = [key for key in user_docs.keys() if key != "_id" and key != "email"]
        return JsonResponse({"docNames": doc_names}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)