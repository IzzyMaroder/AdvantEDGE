#!/bin/bash

vlc -vvv video10m.mp4 --sout '#transcode{vcodec=h264,acodec=mpga,ab=128,channels=2,samplerate=44100,scodec=none}:duplicate{dst=http{mux=ffmpeg{mux=flv},dst=:31116/}' --no-sout-all --sout-keep