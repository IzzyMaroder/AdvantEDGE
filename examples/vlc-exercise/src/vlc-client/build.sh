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

cp $BASEDIR/start-client.sh $BINDIR

mkdir -p $BINDIR