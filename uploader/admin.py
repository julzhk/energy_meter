from django.contrib import admin

from uploader.models import RawData, Building, Meter, Consumption


class RawDataAdmin(admin.ModelAdmin):
    list_display = ('data', 'filename', 'stage', 'processed', 'error')
    list_filter = ('filename', 'stage', 'processed', 'error')


class BuildingAdmin(admin.ModelAdmin):
    list_display = ('name', 'uid')


class MeterAdmin(admin.ModelAdmin):
    list_display = ['uid', 'building']


class ConsumptionAdmin(admin.ModelAdmin):
    list_display = ['consumption', 'meter', 'reading_date_time']
    list_filter = ('meter',)


admin.site.register(RawData, RawDataAdmin)
admin.site.register(Meter, MeterAdmin)
admin.site.register(Building, BuildingAdmin)
admin.site.register(Consumption, ConsumptionAdmin)
