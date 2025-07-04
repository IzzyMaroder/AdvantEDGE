#!/bin/sh

# Get full path to script directory
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

# Create build directory
if [ "$#" -ne 1 ]; then
    echo "Missing bin directory"
    exit
fi
BINDIR=$1


cp $BASEDIR/start-server.sh $BINDIR
cp $BASEDIR/streaming.html $BINDIR
cp $BASEDIR/videocartoon.mp4 $BINDIR

mkdir -p $BINDIR