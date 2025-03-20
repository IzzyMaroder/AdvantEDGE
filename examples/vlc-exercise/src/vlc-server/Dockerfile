FROM debian

RUN apt-get update && apt-get install -y vlc

RUN useradd -m -d /home/vlcuser -s /bin/bash vlcuser

# EXPOSE 31116

COPY video10m.mp4 /home/vlcuser/video10m.mp4

COPY start-server.sh /home/vlcuser/start-server.sh

RUN chmod +x /home/vlcuser/start-server.sh

RUN chown -R vlcuser:vlcuser /home/vlcuser

USER vlcuser

WORKDIR /home/vlcuser


CMD ["/bin/bash", "/home/vlcuser/start-server.sh"]
