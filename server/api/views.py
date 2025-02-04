from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_GET,require_POST

@require_GET
def test(request): 
    return HttpResponse("ok", 200)
