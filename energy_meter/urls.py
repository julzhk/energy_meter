from django.contrib import admin
from django.urls import path

from uploader.views import home

urlpatterns = [
    path('', home),

    path('admin/', admin.site.urls),
]
