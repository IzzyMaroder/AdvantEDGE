#!/bin/bash

# Get full path to script directory
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

SERVERBIN=$BASEDIR/bin/vlc-server
CLIENTBIN=$BASEDIR/bin/vlc-client

echo ""
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>> Dockerizing VLC Server & VLC Client"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ""


# Copy Dockerfile to bin folder
cp $BASEDIR/src/vlc-server/Dockerfile $SERVERBIN
cp $BASEDIR/src/vlc-client/Dockerfile $CLIENTBIN

echo ""
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>> Dockerizing VLC Server"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ""

# Dockerize server
cd $SERVERBIN
echo ">>> Building VLC Server"
docker build --no-cache --rm -t meep-docker-registry:30001/vlc-server .
docker push meep-docker-registry:30001/vlc-server

echo ""
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>> Dockerizing VLC Client"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ""

# Dockerize client
cd $CLIENTBIN
echo ">>> Building VLC Client"
docker build --no-cache --rm -t meep-docker-registry:30001/vlc-client .
docker push meep-docker-registry:30001/vlc-client


echo ""
echo ">>> Demo Service dockerize completed"