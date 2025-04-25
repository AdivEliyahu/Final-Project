from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET,require_POST
import os
import json
import certifi

from pymongo import MongoClient
from dotenv import load_dotenv
from .auth_views import jwt_required
import pymongo 
from db_connection import db 

load_dotenv()

ca = certifi.where()
@jwt_required
@require_GET
def test(request): 
    return JsonResponse({"message": "Server Connected"}, status=200)

