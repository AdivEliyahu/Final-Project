from django.urls import path
from .views.auth_views import *
from .views.test_views import *


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [ 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login', login),
    path('csrf', set_csrf_token),
    path('get_user', get_user),
    path('test',test), # Remove later test only
    path('protected_view',protected_view), # Remove later test only
]