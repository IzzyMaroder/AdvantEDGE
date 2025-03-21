#!/bin/bash

# Get full path to script directory
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

SERVERBIN=$BASEDIR/bin/vlc-server
CLIENTBIN=$BASEDIR/bin/vlc-client

echo ""
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>> Dockerizing VLC Server"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ""


# Copy Dockerfile to bin folder
cp $BASEDIR/src/vlc-server/Dockerfile $SERVERBIN

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
echo ">>> Demo Service dockerize completed"