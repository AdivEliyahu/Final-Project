from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import os
import json
import certifi
import jwt
from dotenv import load_dotenv
from db_connection import db 
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from functools import wraps
from bson import ObjectId
from django.views.decorators.csrf import csrf_exempt

load_dotenv()
ca = certifi.where()

# Safty Requirments
@require_GET
def set_csrf_token(request):
    from django.middleware.csrf import get_token
    return JsonResponse({"csrfToken": get_token(request)})


# JWT Functions
def create_jwt(payload, expires_in=120):
    """Helper function to create JWT token"""
    
    payload['exp'] = datetime.utcnow() + timedelta(minutes=expires_in)
    return jwt.encode(payload, os.environ.get('JWT_SECRET'), algorithm='HS256')


def decode_jwt(token):
    """Decodes and verifies a JWT token."""
    try:
        return jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")


def jwt_required(view_func):
    """Decorator to protect routes with JWT authentication."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Unauthorized"}, status=401)

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms=["HS256"])
            request.user = payload  
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        return view_func(request, *args, **kwargs)
    
    return wrapper

@require_GET
@jwt_required
def protected_view(request):
    """Example protected view that requires JWT authentication."""
    return JsonResponse({
        "message": "This is a protected route",
        "user": request.user
    }, status=200)




# Views
@require_POST
def login(request):
    data = json.loads(request.body)
    users_collection = db['users']

    user = users_collection.find_one({"email": data.get('email')})
    
    if user and user['password'] == data.get('password'):
        user['_id'] = str(user['_id'])  
        
        payload = {
            "user_id": user["_id"],
            "email": user["email"]
        }
        
        access_token = create_jwt(payload, expires_in=120)  # 2 hours
        refresh_token = create_jwt(payload, expires_in=1440)  # 24 hours


        return JsonResponse({
            "user": user,
            "access": access_token,
            "refresh": refresh_token
        }, status=200)

    return JsonResponse({"error": "Invalid credentials"}, status=401)

@require_POST
def register(request):
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({"error": "Invalid request payload", "details": str(e)}, status=400)


    users_collection = db['users']

    email = data.get('email')
    if users_collection.find_one({"email": email}):
        return JsonResponse({"error": "Email is already in use."}, status=409)
    
    new_user = {
        "name": data.get('name'),
        "email": data.get('email'),
        "password": data.get('password')
    }

    result = users_collection.insert_one(new_user)
    new_user['_id'] = str(result.inserted_id)  

    payload = {
        "user_id": new_user["_id"],
        "email": new_user["email"]
    }

    access_token = create_jwt(payload, expires_in=120)  
    refresh_token = create_jwt(payload, expires_in=1440)  

    return JsonResponse({
        "user": new_user,
        "access": access_token,
        "refresh": refresh_token
    }, status=201)

# @csrf_exempt
# @require_GET
# def get_user(request): 
#     access_token = request.headers.get("Authorization")

#     try:
#         payload = decode_jwt(access_token)  
#         user_id = payload.get("user_id")

#         if not user_id:
#             return JsonResponse({"error": "Invalid token"}, status=401)

#         users_collection = db['users']
#         user = users_collection.find_one({"_id": ObjectId(user_id)})

#         if not user:
#             return JsonResponse({"error": "User not found"}, status=404)

#         user['_id'] = str(user['_id'])  


#         return JsonResponse({"user": user}, status=200)

#     except Exception as e:
#         return JsonResponse({"error": "Invalid or expired token", "details": str(e)}, status=401)


@require_GET
@jwt_required
def profile(request): 
    try:
        email = request.user.get("email")
        if not email:
            return JsonResponse({"error": "Invalid token payload"}, status=401)

        users_collection = db['users']
        user = users_collection.find_one({"email": email})

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        user['_id'] = str(user['_id'])
        user.pop("password", None)

        return JsonResponse(user, status=200)

    except Exception as e:
        return JsonResponse({"error": "Internal error", "details": str(e)}, status=500)
