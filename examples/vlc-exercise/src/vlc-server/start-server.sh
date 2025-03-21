#!/bin/bash

ffmpeg -re -i video10m.mp4 -c:v h264 -b:v 300k -preset ultrafast -c:a aac -b:a 128k -ac 2 -ar 44100 -f flv tcp://0.0.0.0:9090?listen