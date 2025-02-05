from django.urls import path
from .views.auth_views import *
from .views.test_views import *
urlpatterns = [ 
    path('login', login),
    path('csrf', set_csrf_token),
    path('test',test)
]