FROM debian

RUN apt-get update && apt-get install -y ffmpeg net-tools procps nodejs npm

# EXPOSE 31116

COPY video10m.mp4 ./video10m.mp4

COPY streaming.html ./streaming.html

COPY streaming.js ./streaming.js

COPY start-server.sh ./start-server.sh

RUN npm init -y && npm install axios

RUN chmod +x ./start-server.sh


ENTRYPOINT ["/bin/bash", "./start-server.sh"]
