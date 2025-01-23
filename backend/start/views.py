from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pymongo import MongoClient
from bson.objectid import ObjectId
from django.contrib.auth.models import User
from io import BytesIO
from bson import Binary
import base64
from django.core.exceptions import ValidationError
from django.http import JsonResponse

# MongoDB connection
client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Vote']
users_collection = db['users']
candidates_collection = db['candidates']
vote_collections = db['Voted']


@api_view(['POST'])
def signup(request):
    data = request.data
    data['password'] = make_password(data['password'])

    # Set role to "user" by default if not provided
    data['role'] = data.get('role', 'user')

    if users_collection.find_one({"email": data['email']}):
        return Response({'detail': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user_id = users_collection.insert_one(data).inserted_id
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    user['_id'] = str(user['_id'])
    return Response(user, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    data = request.data
    user = users_collection.find_one({"email": data['email']})

    if user and check_password(data['password'], user['password']):
        user['_id'] = str(user['_id'])
        return Response({'_id': user['_id'], 'email': user['email'], 'role': user['role']}, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def check_email(request):
    email = request.query_params.get('email')

    if users_collection.find_one({"email": email}):
        return Response({"exists": True}, status=status.HTTP_200_OK)
    return Response({"exists": False}, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_candidate(request):
    data = request.data

    required_fields = ['candidate_name', 'candidate_age', 'description']
    for field in required_fields:
        if field not in data or not data[field]:
            return Response({"detail": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

    candidate_image_base64 = data.get('candidate_image')
    if not candidate_image_base64:
        return Response({"detail": "candidate image is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if candidate_image_base64.startswith("data:image"):
            candidate_image_base64 = candidate_image_base64.split(',')[1]

        image_data = base64.b64decode(candidate_image_base64)
        candidate_image_base64 = base64.b64encode(image_data).decode('utf-8')

    except Exception:
        return Response({"detail": "Invalid image format."}, status=status.HTTP_400_BAD_REQUEST)

    candidate_data = {
        "candidate_name": data['candidate_name'],
        "candidate_image": candidate_image_base64,
        "candidate_age": data['candidate_age'],
        "description": data['description']
    }

    try:
        candidate_id = candidates_collection.insert_one(candidate_data).inserted_id
        candidate = candidates_collection.find_one({"_id": ObjectId(candidate_id)})
        candidate['_id'] = str(candidate['_id'])
        return Response(candidate, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({"detail": "Error saving candidate to database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_candidates(request):
    candidates = list(candidates_collection.find())

    for candidate in candidates:
        candidate['_id'] = str(candidate['_id'])
        if isinstance(candidate.get('candidate_image'), bytes):
            candidate['candidate_image'] = base64.b64encode(candidate['candidate_image']).decode('utf-8')

    return Response(candidates)


@api_view(['POST'])
def vote_candidate(request, id):
    try:
        candidate = candidates_collection.find_one({"_id": ObjectId(id)})
        if not candidate:
            return JsonResponse({"error": "Candidate not found."}, status=404)

        voter_data = {"candidate_id": str(id), "voted_at": request.data.get("voted_at", None)}
        vote_collections.insert_one(voter_data)

        return JsonResponse({"message": f"Successfully voted for {candidate['candidate_name']}!"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def admin_view_candidates(request):
    try:
        candidates = list(candidates_collection.find())
        for candidate in candidates:
            candidate['_id'] = str(candidate['_id'])

            vote_count = vote_collections.count_documents({"candidate_id": candidate['_id']})
            candidate['elector_count'] = vote_count

        return Response(candidates, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
