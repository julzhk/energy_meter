# Pull base image
FROM nikolaik/python-nodejs:latest

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
RUN mkdir /code
WORKDIR /code

# Copy project
COPY . /code/
RUN pip install -r /code/requirements.txt
RUN npm install
RUN pwd
RUN ls
RUN npm run build


RUN python manage.py migrate
