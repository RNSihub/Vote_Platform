from django.urls import path
from .views import signup, login, check_email, add_candidate, get_candidates, vote_candidate, admin_view_candidates

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('check-email/', check_email, name='check-email'),
    path('add-candidate/', add_candidate, name='add_candidate'),
    path('candidates/', get_candidates, name='get_candidates'),
    path('candidates/<str:id>/vote/', vote_candidate, name='vote_candidate'),
    path('admin/candidates/', admin_view_candidates, name='admin_view_candidates'),
]

