import datetime
import io
from collections import Counter

from django.http import JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from uploader.models import RawData


def home(request):
    return render(request, 'uploader/home.html', {})

@ensure_csrf_cookie
def api(request):
    if request.FILES:
        file_readlines, filename = extract_file_data(request)
        count = store_data(file_readlines, filename)
        return JsonResponse({'count':count})
    return HttpResponseForbidden()

def extract_file_data(request):
    filebytecode = request.FILES['file'].file
    filename = request.FILES['file'].name
    io_file = io.TextIOWrapper(filebytecode)
    file_readlines = io_file.readlines()
    return file_readlines, filename

def store_data(file_readlines, filename):
    uploaded_data_list = []
    now = datetime.datetime.now()
    for line in file_readlines:
        uploaded_data_list.append(RawData(data=line, filename=filename, timestamp=now))
    RawData.objects.bulk_create(uploaded_data_list)
    return len(uploaded_data_list)


