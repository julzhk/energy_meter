# Pull base image
FROM nikolaik/python-nodejs:latest

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
RUN mkdir /code
WORKDIR /code

# Install dependencies
COPY ./package.json /code/
COPY requirements.txt /code/
RUN pip install -r requirements.txt
RUN npm install


# Copy project
COPY . /code/

