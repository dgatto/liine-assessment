docker build -t python-docker-project:latest .

docker run -p 8000:8080 \
--env PIPELINE=production \
--env SECRET_KEY=your_value \
--env DB_NAME=. \
--env DB_USER_NM=. \
--env DB_USER_PW=. \
--env DB_IP=0.0.0.0 \
--env DB_PORT=5432 \
python-docker
