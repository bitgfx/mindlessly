#!/usr/bin/env bash

confirm() {
    read -r -p "${1:-Are you sure? [y/N]} " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            true;;
        *)
            false;;
    esac
}

generate_lod() {
    local SCALE_FACTOR="1.5"

    local source=$1
    local extension="${source##*.}"
    local filename=$(basename "${source}" ".${extension}")
    local dest="out/${filename}/"
    local lod="${2:-2}"

    echo "Source $1"
    echo "Transcoding videos to ${dest}"

    if [[ -d "${dest}" ]]; then
        confirm "File already exists. Overwrite?" && rm -rf "${dest}" || exit 0
    fi

    mkdir -p "${dest}"

    local original_resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${source}")
    local original_resolution_width=$(echo "${original_resolution}" | cut -f1 -d 'x')
    local original_resolution_height=$(echo "${original_resolution}" | cut -f2 -d 'x')

    echo "Will generate $original_resolution_width x $original_resolution_height"

    for i in $(seq 1 "${lod}"); do
        resolution_y=$(echo "${original_resolution_height} / (${SCALE_FACTOR} * ${i})" | bc)
        resolution_x=$(echo "${original_resolution_width} / (${SCALE_FACTOR} * ${i})" | bc)
        echo "Generating video in ${resolution_x}x${resolution_y}"
        ffmpeg -i "${source}" -vf scale="${resolution_x}:${resolution_y}" "${dest}/${resolution_y}.${extension}"
    done
}


# TODO: Watermark
# ffmpeg -i main.mp4 -i image.png -filter_complex "overlay=W-w-5:H-h-5" -c:a copy output.mp4

# TODO: LOD
# TODO: Split up in segments

generate_lod "$@"



# local duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${source}")

