# Generated by Django 3.0.4 on 2020-03-31 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RawData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.TextField()),
                ('filename', models.TextField(blank=True)),
                ('timestamp', models.DateTimeField(blank=True, null=True)),
                ('processed', models.BooleanField(default=False)),
            ],
        ),
    ]