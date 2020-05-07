const ffmpeg = require('fluent-ffmpeg')
const _ = require('lodash')
const fs = require("fs")

interface VideoSize {
    width: number
    height: number
}

const SOURCE_COMPAT: [VideoSize] = [
    { width: 1920, height: 1080 }
]

function exitAndError(code: number, message?: string) {
    if (message) console.error(message)
    process.exit(code)
}

function getVideoSize(path: string): Promise<VideoSize> {
    let promise = new Promise<VideoSize>((resolve, reject) => {
        ffmpeg.ffprobe(path, function (err: any, metadata: any) {
            if (err) {
                reject(err)
            }

            let stream = metadata.streams.find((x: any) => x.profile === "Main")
            if (stream) {
                resolve({ width: stream.width, height: stream.height })
            } else {
                reject("Couldn't find stream data")
            }
        });
    })

    return promise
}

class Args {
    source: string
    destination: string

    constructor(argv: string[]) {
        if (argv.length < 1) exitAndError(1, "Usage: node transcode.js SOURCE [DESTNATION]")

        this.source = argv[0]
        this.destination = _.trimEnd(_.defaultTo(argv[1], "out/"), "/")

        if (!fs.existsSync(this.source)) exitAndError(1, `File not found: ${this.source}`)
        if (fs.existsSync(this.destination)) exitAndError(1, `Destination, <${this.destination}> already exists`)
    }
}

async function watermark(source: string, destination: string): Promise<void> {
    console.log(`Starting watermarking of ${source}`)

    return new Promise<void>((resolve, reject) => {
        var lastProgress = 0

        ffmpeg()
            .input(source)
            .input("../overlays/1080.png")
            .complexFilter([
                "overlay=W-w-5:H-h-5"
            ])
            .audioCodec("copy")
            .output(destination)
            .on('progress', (progress: any) => {
                if (Math.floor(progress.percent) != lastProgress) {
                    lastProgress = Math.floor(progress.percent)
                    console.log('Watermarking: ' + lastProgress + '% done')
                }
            })
            .on('error', (err: any) => {
                console.log('An error occurred: ' + err.message)
                reject(err)
            })
            .on('end', () => {
                console.log(`Finished watermarking of ${source}`)
                resolve()
            })
            .run()
        })
}

async function resize(source: string, destination: string, newSize: VideoSize): Promise<void> {
    console.log(`Starting resizing of ${source} to ${newSize}`)

    return new Promise<void>((resolve, reject) => {
        var lastProgress = 0

        ffmpeg()
            .input(source)
            .size(`${newSize.width}x${newSize.height}`)
            .audioCodec("copy")
            .output(destination)
            .on('progress', (progress: any) => {
                if (Math.floor(progress.percent) != lastProgress) {
                    lastProgress = Math.floor(progress.percent)
                    console.log('Resizing: ' + lastProgress + '% done')
                }
            })
            .on('error', (err: any) => {
                console.log('An error occurred: ' + err.message)
                reject(err)
            })
            .on('end', () => {
                console.log(`Finished resizing ${source}`)
                resolve()
            })
            .run()
        })
}

async function main() {
    let args = new Args(process.argv.slice(2))

    let videoSize: VideoSize = await getVideoSize(args.source)
    if (SOURCE_COMPAT.findIndex((i) => _.isEqual(i, videoSize)) < 0) exitAndError(1, `Invalid resolution of source file. ${videoSize} is not one of ${SOURCE_COMPAT}`)

    if (!fs.existsSync(args.destination)){
        fs.mkdirSync(args.destination);
    }

    await watermark(args.source, `${args.destination}/${videoSize.height}.mp4`)

    let outputs: VideoSize[] = [
        { width: 1280, height: 720 },
        { width: 640, height: 360 }
    ]

    outputs.forEach(async (size: VideoSize) => {
        await resize(`${args.destination}/${videoSize.height}.mp4`, `${args.destination}/${size.height}.mp4`, size)
    })

    console.log("Done")
}

main()
