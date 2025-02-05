from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET,require_POST
import os
import json
import certifi

from pymongo import MongoClient
from dotenv import load_dotenv

import pymongo 
from db_connection import db 

load_dotenv()

ca = certifi.where()
@require_GET
def set_csrf_token(request):
    from django.middleware.csrf import get_token
    return JsonResponse({"csrfToken": get_token(request)})


@require_POST
def login(request): 
    users_collection = db['users']
    data = json.loads(request.body)
    records = { 
        "email" : data.get('email'),
        "password" : data.get('password')
    }
    print(records)
    try:
        user = users_collection.find_one(records)
        if user:
            user['_id'] = str(user['_id'])  
            print(user)
        return JsonResponse({"user": user}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
