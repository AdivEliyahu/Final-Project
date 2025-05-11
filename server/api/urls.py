from django.urls import path
from .views.auth_views import *
from .views.models_views import anonymize_entities
from .views.user_management_views import *


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [ 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login', login),
    path('register', register),
    path('csrf', set_csrf_token),
    path('profile', profile),
    path('anonymize/', anonymize_entities, name='extract_entities'),
    path('save_document/', save_document),
    path('get_user_doc_names/', get_user_doc_names),
    path('get_user_doc', get_user_doc),
    path('delete_user_doc', delete_user_doc),
    
    
]