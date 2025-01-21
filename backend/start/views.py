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
client = MongoClient("mongodb+srv://naveensanthosh1213:KSN%40123@admin.hutoj.mongodb.net/")
db = client['admin_upload']
users_collection = db['users']
products_collection = db['products']

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


@api_view(['POST'])
def add_product(request):
    """
    Endpoint to add a new product with image upload as base64 string.
    """
    data = request.data

    # Validate required fields
    required_fields = ['product_name', 'product_price', 'discount', 'description']
    for field in required_fields:
        if field not in data or not data[field]:
            return Response(
                {"detail": f"{field} is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Handle base64 image upload
    product_image_base64 = data.get('product_image')
    if not product_image_base64:
        return Response({"detail": "Product image is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Decode base64 string to binary (ensure no extra prefix is included)
        if product_image_base64.startswith("data:image"):
            product_image_base64 = product_image_base64.split(',')[1]  # Remove data:image/jpeg;base64, part
        
        image_data = base64.b64decode(product_image_base64)

        # Convert binary data to base64 string for response
        product_image_base64 = base64.b64encode(image_data).decode('utf-8')  # Convert binary data back to base64 string

    except Exception as e:
        return Response({"detail": "Invalid image format."}, status=status.HTTP_400_BAD_REQUEST)

    # Prepare product data with image as base64 string
    product_data = {
        "product_name": data['product_name'],
        "product_image": product_image_base64,  # Store the image as base64 string
        "product_price": data['product_price'],
        "discount": data['discount'],
        "description": data['description']
    }

    # Insert product into MongoDB
    try:
        product_id = products_collection.insert_one(product_data).inserted_id
        product = products_collection.find_one({"_id": ObjectId(product_id)})
        product['_id'] = str(product['_id'])  # Convert ObjectId to string for JSON response
        return Response(product, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": "Error saving product to database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
def get_products(request):
    # Fetch products from MongoDB
    products = list(products_collection.find())

    # Convert ObjectId to string for JSON response
    for product in products:
        product['_id'] = str(product['_id'])
        # If you have binary images, you may want to encode them as base64
        if isinstance(product.get('product_image'), bytes):
            product['product_image'] = base64.b64encode(product['product_image']).decode('utf-8')

    return Response(products)