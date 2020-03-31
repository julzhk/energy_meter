from django.contrib import admin

from uploader.models import RawData


class RawDataAdmin(admin.ModelAdmin):
    list_display = ('data','filename','stage')
    list_filter = ('filename','stage')


admin.site.register(RawData, RawDataAdmin)
