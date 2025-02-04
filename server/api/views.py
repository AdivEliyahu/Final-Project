from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_GET, require_POST
import os
import certifi

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

ca = certifi.where()

@require_GET
def test(request):
    uri = "mongodb+srv://adiveliyahu3:<OVkGHi4qb2gdxsTK>@cluster0.q7vxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    # Create a new client and connect to the server
    client = MongoClient(uri, tlsCAFile=ca)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    return HttpResponse("ok", 200)




