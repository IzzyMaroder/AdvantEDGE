FROM debian

RUN apt-get update && apt-get install -y ffmpeg net-tools

# EXPOSE 31116

COPY video10m.mp4 ./video10m.mp4

COPY start-server.sh ./start-server.sh

RUN chmod +x ./start-server.sh


CMD ["/bin/bash", "./start-server.sh"]
