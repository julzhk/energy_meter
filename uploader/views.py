import datetime
import io
from collections import Counter

from django.http import JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


def home(request):
    return render(request, 'uploader/home.html', {})
