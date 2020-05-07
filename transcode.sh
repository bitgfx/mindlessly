#!/usr/bin/env bash
set -e
SCALE_FACTOR="1.5"

confirm() {
    read -r -p "${1:-Are you sure? [y/N]} " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            true;;
        *)
            false;;
    esac
}

check_source_resolution() {
    local source=$1
    echo "Source is $source"
    local resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${source}")
    local resolution_width=$(echo "${resolution}" | cut -f1 -d 'x')
    local resolution_height=$(echo "${resolution}" | cut -f2 -d 'x')

    if [[ "${resolution_width}" != "1920" ]] || [[ "${resolution_height}" != "1080" ]]; then
        echo "${resolution_width}x${resolution_height} is not 1920x1080"
        exit 1
    fi
}

generate_lod() {
    local source=$1
    local extension="${source##*.}"
    local filename=$(basename "${source}" ".${extension}")
    local dest="${2:-out/${filename}/}"
    local lod="${3:-2}"

    echo "Source $1"
    echo "Transcoding videos to ${dest}"

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

watermark() {
    local source=$1
    local destination=$2

    ffmpeg -i ${source} -i "overlays/1080.png" -filter_complex "overlay=W-w-5:H-h-5" -c:a copy "${destination}"
}


split() {
    
}

# TODO: Split up in segments

main() {
    local source="$1"
    local dest="${2%/}"

    check_source_resolution "${source}"

    if [[ -d "${dest}" ]]; then
        confirm "File already exists. Overwrite?" && rm -rf "${dest}" || exit 0
    fi
    mkdir -p "${dest}"

    watermark "${source}" "${dest}/1080p.mp4"
    generate_lod "${dest}/1080p.mp4" "${dest}"
}

main "$@"




# local duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${source}")

