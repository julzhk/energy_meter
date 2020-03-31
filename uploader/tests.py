from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client
from django.test import TestCase

class SimpleTests(TestCase):
    def test_first(self):
        client = Client()
        response = client.get(path='/')
        self.assertEqual(200, response.status_code)

