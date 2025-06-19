#!/bin/bash

ffmpeg -re -i videocartoon.mp4 -c:v h264 -b:v 1200k -preset veryfast -c:a aac -b:a 128k -ac 2 -ar 44100 -f hls -hls_time 10 -hls_list_size 6 -hls_segment_filename "segment_%03d.ts" playlist.m3u8 &

python3 -m http.server 9090