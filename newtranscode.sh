#!/usr/bin/env bash

# Usage
#
# Install ffmpeg
# Install Bento4 SDK https://www.bento4.com/downloads/ 

set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

mkdir "tmp"
mkdir "tmp/video"
mkdir "tmp/audio"

echo "### Watermarking video"
ffmpeg -i video.mp4 -i "${DIR}/overlay.png" -filter_complex "overlay=W-w-5:H-h-5" -c:a copy "tmp/video.mp4"

echo "### Transcoding video"
ffmpeg -i "tmp/video.mp4" -an -sn -c:0 libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 5300k -maxrate 5300k -bufsize 2650k -vf 'scale=-1:1080' "tmp/video/video-1080.mp4"
ffmpeg -i "tmp/video.mp4" -an -sn -c:0 libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 2400k -maxrate 2400k -bufsize 1200k -vf 'scale=-1:720' "tmp/video/video-720.mp4"
ffmpeg -i "tmp/video.mp4" -an -sn -c:0 libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 600k -maxrate 600k -bufsize 300k -vf 'scale=-1:360' "tmp/video/video-360.mp4"

echo "### Transcoding audio"
ffmpeg -i audio-en.mp3 -ac 2 -ab 192k -vn -sn tmp/audio/audio-en.mp4
ffmpeg -i audio-no.mp3 -ac 2 -ab 192k -vn -sn tmp/audio/audio-no.mp4

echo "### Fragmenting video"
mp4fragment tmp/video/video-1080.mp4 tmp/video/f-video-1080.mp4
mp4fragment tmp/video/video-720.mp4 tmp/video/f-video-720.mp4
mp4fragment tmp/video/video-360.mp4 tmp/video/f-video-360.mp4

echo "### Fragmenting audio"
mp4fragment tmp/audio/audio-no.mp4 tmp/audio/f-audio-no.mp4
mp4fragment tmp/audio/audio-en.mp4 tmp/audio/f-audio-en.mp4

echo "### Generating manifest and fragments"
mp4dash --mpd-name=manifest.mpd tmp/video/f-video-1080.mp4 tmp/video/f-video-720.mp4 tmp/video/f-video-360.mp4 \[+language=no\]tmp/audio/f-audio-no.mp4 \[+language=en\]tmp/audio/f-audio-en.mp4

echo "Generating thumbnails"
ffmpeg -i video.mp4 -ss 00:00:03 -vframes 1 -s 1920x1080 "output/thumbnail-1080.jpg"
ffmpeg -i video.mp4 -ss 00:00:03 -vframes 1 -s 1280x720 "output/thumbnail-720.jpg"
ffmpeg -i video.mp4 -ss 00:00:03 -vframes 1 -s 640x360 "output/thumbnail-360.jpg"

rm -rf tmp
