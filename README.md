
* collect, 
* visualise and 
* analyse energy data.


Sample Data
----
 
* Half hourly data shows how much energy was consumed in the previous half hour. 

Task Overview
----

* manipulate raw data files, 
* create a suitable database structure, 
* read and write data to a database, use the Django web framework
* visualise data. 


Requirements
----
* Use Django and whichever sql database (e.g SQLite, PostgreSQL) and 
* third-party libraries you feel are appropriate, 
* create a web application which is capable of the following:

* Uploading the attached (or any) csv files via a web form
* writing the data to a database via a Django model.
* Simple data exploration through Django views and html tables showing a list of buildings,
then a list of meters for each building with hyperlinks etc.
* One simple visualisation of energy consumption using whatever graph or chart you 
feel is useful (using a third-party library is fine). 
e.g: it could be to plot the half hourly data for each meter in a line chart, 
or perhaps sum the energy consumption per day across every hotel and draw a bar chart. 


To run:
===

The docker way
---
With docker: from this folder:
``` 
docker-compose up
```

The Venv way
---

Alternatively: create a virtual environment and
```
pip install -r requirements.txt
npm init
npm run docker-start
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```


Both should run the app on: http://0.0.0.0:8000/

To view Django admin to see successfully uploaded data:

http://0.0.0.0:8000/admin/
