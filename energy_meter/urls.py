from django.contrib import admin
from django.urls import path


from uploader.views import home, api, process

urlpatterns = [
    path('', home),
    path('api', api),
    path('process', process),

    path('admin/', admin.site.urls),
]
