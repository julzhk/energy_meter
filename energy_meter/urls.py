from django.contrib import admin
from django.urls import path


from uploader.views import home, api, process, results, api_data

urlpatterns = [
    path('', home),
    path('api', api),
    path('data_api', api_data),
    path('process', process),
    path('results', results, name='results'),

    path('admin/', admin.site.urls),
]
