# python

Barebones Python API made with django that can be run within a Docker container.

## Getting Started

To get the app running and making calls for restaurants, follow these steps:

1. Configure your `python` and `venv` to install needed dependencies
2. Run `python manage.py runserver`
3. Visit `http://localhost:8000/restaurants/by-date` to see a mocked response.

## Running in Docker

To run this app on Docker, follow these steps:

1. Ensure that the Docker Daemon is running (Docker Desktop or otherwise)
2. While in the `python` directory, run `docker build -t python-docker:latest .` to build the latest image.
3. Run `docker run -it -p 8080:8080 python-docker` to deploy the image to a container
4. Visit `http://0.0.0.0:8080/restaurants/`