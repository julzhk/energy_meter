from django.db import models


class RawData(models.Model):
    METER = 3
    TIME = 2
    BUILDING = 1

    DATATYPES = [
        (BUILDING, 'Upload Building Data'),
        (TIME, 'Upload Half Hourly Data'),
        (METER, 'Upload Meter Data')
    ]
    data = models.TextField()
    filename = models.TextField(blank=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    stage = models.TextField(choices=DATATYPES)
    processed = models.BooleanField(default=False)
    error = models.NullBooleanField(default=None)

    def __str__(self):
        return f"{self.data}"

    @staticmethod
    def process(self):
        batch = RawData.objects.filter(processed=False)[:50]


class Building(models.Model):
    uid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=256)


class Meter(models.Model):
    uid = models.IntegerField(primary_key=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)


class Consumption(models.Model):
    consumption = models.FloatField(default=0)
    meter = models.ForeignKey(Meter, on_delete=models.CASCADE)
    reading_date_time = models.DateTimeField()
