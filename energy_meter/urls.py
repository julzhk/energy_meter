from django.contrib import admin
from django.urls import path

from uploader.views import home,api

urlpatterns = [
    path('', home),
    path('api', api),

    path('admin/', admin.site.urls),
]
