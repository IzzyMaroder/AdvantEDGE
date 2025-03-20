#!/bin/bash

# Get full path to script directory
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

SERVERBIN=bin/vlc-server
CLIENTBIN=bin/vlc-client

# Retrieve workdir
# WORKDIR=`grep workdir $HOME/.meepctl.yaml | sed 's/^.*workdir:[ \t]*//'`
# EXvlc=${WORKDIR}/virt-engine/user-charts/exvlc

# Copy demo charts to workdir
# mkdir -p ${EXvlc}
# cp -r ./charts ${EXvlc}
# cp -r ./values ${EXvlc}


mkdir -p $SERVERBIN
mkdir -p $CLIENTBIN

chmod +x $BASEDIR/dockerize.sh

chmod +x $BASEDIR/src/vlc-server/build.sh
$BASEDIR/src/vlc-server/build.sh $SERVERBIN

chmod +x $BASEDIR/src/vlc-client/build.sh
$BASEDIR/src/vlc-client/build.sh $CLIENTBIN
