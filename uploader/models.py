from django.db import models


class RawData(models.Model):
    DATATYPES = [
        (1, 'Upload Building Data'),
        (2, 'Upload Half Hourly Data'),
        (3, 'Upload Meter Data')
    ]
    data = models.TextField()
    filename = models.TextField(blank=True)
    timestamp = models.DateTimeField(blank=True,null=True)
    stage = models.TextField(choices=DATATYPES)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.data}"

    @staticmethod
    def process(self):
        batch = RawData.objects.filter(processed=False)[:50]
