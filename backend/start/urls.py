from django.urls import path
from .views import signup, login, check_email, add_candidate,get_products

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('check-email/', check_email, name='check-email'),
    path('add_candidate/', add_candidate, name='add_candidate'),  # This is correct
    path('products/', get_products, name='get_products'),
]
