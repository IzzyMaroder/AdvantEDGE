FROM debian

# Installa netcat
RUN apt-get update && apt-get install -y vlc
RUN useradd -m -d /home/vlcuser -s /bin/bash vlcuser
COPY start-client.sh start-client.sh
RUN chmod +x /start-client.sh
RUN chown -R vlcuser:vlcuser /home/vlcuser

CMD ["/bin/bash"]
