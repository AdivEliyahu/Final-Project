from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET,require_POST
import os
import certifi

from pymongo import MongoClient
from dotenv import load_dotenv

import pymongo 
from db_connection import db 

load_dotenv()

ca = certifi.where()

@require_GET
def test(request):
    users_collection = db['users']

    records = {"name": "Ned Stark"}
    
    try:
        user = users_collection.find_one(records)
        if user:
            user['_id'] = str(user['_id'])  
        return JsonResponse({"obj": user}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)





