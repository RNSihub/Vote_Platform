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

# MongoDB connection
client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Vote']
users_collection = db['users']
candidates_collection = db['candidates']

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

    # Check if the email already exists in the MongoDB collection
    if users_collection.find_one({"email": email}):
        return Response({"exists": True}, status=status.HTTP_200_OK)
    return Response({"exists": False}, status=status.HTTP_200_OK)


candidates_collection = db['candidates']

@api_view(['POST'])
def add_candidate(request):
    """
    Endpoint to add a new candidate with image upload.
    """
    data = request.data

    # Validate required fields
    required_fields = ['candidateName', 'age', 'department']
    for field in required_fields:
        if field not in data or not data[field]:
            return Response(
                {"detail": f"{field} is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Handle base64 image upload
    candidate_image_base64 = data.get('candidate_image')
    if not candidate_image_base64:
        return Response({"detail": "Candidate image is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Decode base64 string to binary (ensure no extra prefix is included)
        if candidate_image_base64.startswith("data:image"):
            candidate_image_base64 = candidate_image_base64.split(',')[1]  # Remove data:image/jpeg;base64, part
        
        image_data = base64.b64decode(candidate_image_base64)
        with open('path/to/save/image.jpg', 'wb') as f:
            f.write(image_data)

    except Exception as e:
        return Response({"detail": "Invalid image format."}, status=status.HTTP_400_BAD_REQUEST)

    # Prepare candidate data
    candidate_data = {
        "candidateName": data['candidateName'],
        "age": data['age'],
        "department": data['department'],
        "candidate_image": candidate_image_base64  # Store the image as base64 string or handle as needed
    }

    # Insert candidate into MongoDB
    try:
        candidate_id = candidates_collection.insert_one(candidate_data).inserted_id
        candidate = candidates_collection.find_one({"_id": ObjectId(candidate_id)})
        candidate['_id'] = str(candidate['_id'])  # Convert ObjectId to string for JSON response
        return Response(candidate, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": "Error saving candidate to database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_products(request):
    # Fetch products from MongoDB
    products = list(candidates_collection.find())

    # Convert ObjectId to string for JSON response
    for product in products:
        product['_id'] = str(product['_id'])
        # If you have binary images, you may want to encode them as base64
        if isinstance(product.get('product_image'), bytes):
            product['product_image'] = base64.b64encode(product['product_image']).decode('utf-8')

    return Response(products)