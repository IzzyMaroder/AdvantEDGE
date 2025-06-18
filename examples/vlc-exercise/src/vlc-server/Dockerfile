FROM debian

RUN apt-get update && apt-get install -y ffmpeg net-tools procps

# EXPOSE 31116

COPY videocartoon.mp4 ./videocartoon.mp4

COPY streaming.html ./streaming.html

COPY start-server.sh ./start-server.sh

RUN chmod +x ./start-server.sh

ENTRYPOINT ["/bin/bash", "./start-server.sh"]
