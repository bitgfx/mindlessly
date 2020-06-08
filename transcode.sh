#!/usr/bin/env bash
set -e

# Usage:
#
# Install ffmpeg
# Install Bento4 SDK https://www.bento4.com/downloads/
#
# Video file should be named video.mp4
# Audio tracks should be named audio-<en|no|..>.mp3
#
# Upload files using gsutil -m cp -r output/* gs://mindlessly/<chapter>/<episode>/


VIDEO="video.mp4"
AUDIO_TRACKS=($(ls audio-*))

if [[ ! -f $VIDEO ]]; then
    echo "Video file <$VIDEO> does not exist"
    exit 1
fi

echo "Found video: ${VIDEO}"
for audio in "${AUDIO_TRACKS[@]}"; do
    echo "Found audio: ${audio}"
done

read -p "Press enter to continue"
mkdir -p "tmp/video" "tmp/audio"


echo "### Transcoding video to 1080p"
ffmpeg -i "${VIDEO}" -an -sn -c:0 libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 5300k -maxrate 5300k -bufsize 2650k -vf 'scale=-1:1080' "tmp/video/video-1080.mp4"
echo "### Transcoding video to 720p"
ffmpeg -i "${VIDEO}" -an -sn -c:0 libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 2400k -maxrate 2400k -bufsize 1200k -vf 'scale=-1:720' "tmp/video/video-720.mp4"
echo "### Transcoding video to 360p"
ffmpeg -i "${VIDEO}" -an -sn -c:0 libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 600k -maxrate 600k -bufsize 300k -vf 'scale=-1:360' "tmp/video/video-360.mp4"


echo "### Fragmenting videos"
mp4fragment tmp/video/video-1080.mp4 tmp/video/frag-video-1080.mp4
mp4fragment tmp/video/video-720.mp4 tmp/video/frag-video-720.mp4
mp4fragment tmp/video/video-360.mp4 tmp/video/frag-video-360.mp4


manifest_cmd="mp4dash --mpd-name=manifest.mpd tmp/video/frag-video-1080.mp4 tmp/video/frag-video-720.mp4 tmp/video/frag-video-360.mp4"


for audio in "${AUDIO_TRACKS[@]}"; do
    basename=$(basename -- "$audio")
    extension="${basename##*.}"
    filename="${basename%.*}"
    language="${filename##*-}"


    echo "### Transcoding audio track ${audio}"
    ffmpeg -i "${audio}" -ac 2 -ab 192k -vn -sn "tmp/audio/${filename}.mp4"

    echo "### Fragmenting audio track ${audio}"
    mp4fragment "tmp/audio/${filename}.mp4" "tmp/audio/frag-${filename}.mp4"

    manifest_cmd+=" \[+language=${language}\]tmp/audio/frag-${filename}.mp4"
done


echo "### Generating manifest"
eval ${manifest_cmd}


echo "Generating thumbnails"
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 -s 1920x1080 "output/thumbnail-1080.jpg"
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 -s 1280x720 "output/thumbnail-720.jpg"
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 -s 640x360 "output/thumbnail-360.jpg"


echo "### Cleaning up"
rm -rf tmp
command -v beep && beep -r 3 -l 500
