import io

from django.http import JsonResponse, HttpResponseForbidden, HttpResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie

from uploader.models import RawData, Building, Meter,Consumption


def home(request):
    return render(request, 'uploader/home.html', {})


@ensure_csrf_cookie
def api(request):
    if request.FILES:
        file_readlines, filename = extract_file_data(request)
        stage = request.POST.get('stage', None)
        count = store_data(file_readlines, filename, stage)
        return JsonResponse({'count': count})
    return HttpResponseForbidden()


def extract_file_data(request):
    filebytecode = request.FILES['file'].file
    filename = request.FILES['file'].name
    io_file = io.TextIOWrapper(filebytecode)
    file_readlines = io_file.readlines()
    return file_readlines, filename


def store_data(file_readlines, filename, stage):
    uploaded_data_list = []
    now = timezone.now()
    for line in file_readlines:
        uploaded_data_list.append(RawData(data=line,
                                          filename=filename,
                                          timestamp=now,
                                          stage=int(stage)))
    RawData.objects.bulk_create(uploaded_data_list)
    return len(uploaded_data_list)


def process(request):
    for stage, klass, create_funct in [
        (RawData.BUILDING, Building, create_building_object),
        (RawData.METER, Meter, create_meter_object),
        (RawData.TIME, Consumption, create_consumption_object),
    ]:
        process_raw_data(create_funct, klass, stage)
    return HttpResponse('ok')


def process_raw_data(create_funct, klass, stage):
    this_stage_qs = RawData.objects.filter(stage=stage).exclude(processed=True)
    new_objects = []
    data_errors = []
    for item in this_stage_qs:
        try:
            create_funct(item, new_objects)
        except ValueError:
            data_errors.append(item.pk)
    klass.objects.bulk_create(new_objects)
    this_stage_qs.update(processed=True, error=False)
    RawData.objects.filter(pk__in=data_errors).update(processed=True, error=True)


def create_building_object(item, new_objects):
    uid, name, *_ = item.data.split(',')
    new_objects.append(Building(uid=int(uid), name=name))

def create_meter_object(item, new_objects):
    building_uid, uid, fuel, unit = item.data.split(',')
    new_objects.append(Meter(uid=int(uid), building_id=building_uid))

def create_consumption_object(item, new_objects):
    consumption_amount, meter_id, reading_date_time = item.data.split(',')
    new_objects.append(Consumption(consumption=consumption_amount,
                                   meter_id=meter_id,
                                   reading_date_time=reading_date_time))
