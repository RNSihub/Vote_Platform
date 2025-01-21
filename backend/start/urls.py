from django.urls import path
from .views import signup, login, check_email, add_candidate,get_candidates , vote_candidate

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('check-email/', check_email, name='check-email'),
    path('add-candidate/', add_candidate, name='add_candidate'),  # This is correct
    path('candidates/', get_candidates, name='get_candidates'),
    path("candidates/<str:id>/vote/", vote_candidate, name="vote_candidate"),

]
