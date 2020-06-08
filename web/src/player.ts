/*
TODO:
- Write manuscripts for content
- Get the watermark from Eirik
- Start recording voice-over in english
*/

import {manifest, Chapter, Episode} from "./manifest"
import {setCookie, getCookie} from "./util"


const DOM = {
    ButtonFullscreen: document.getElementById("button-fullscreen") as HTMLLinkElement,
    ButtonPlay: document.getElementById("button-playpause") as HTMLButtonElement,
    Video: document.getElementById("video-player") as HTMLVideoElement,
    Container: document.getElementById("video-container") as HTMLDivElement, // TODO: Change to document.querySelector("body") as HTMLBodyElement
    Overlay: document.getElementById("overlay"),
    IconPlayPause: document.getElementById("playpause-icon") as HTMLImageElement,

    LanguageSelector: document.getElementById("language-selector") as HTMLDivElement,
    QualitySelector: {
        "auto": document.getElementById("quality-auto") as HTMLLinkElement,
        "360p": document.getElementById("quality-360") as HTMLLinkElement,
        "720p": document.getElementById("quality-720") as HTMLLinkElement,
        "1080p": document.getElementById("quality-1080") as HTMLLinkElement
    },

    VideoTitle: document.getElementById("video-title") as HTMLHeadingElement,
    VideoDescription: document.getElementById("video-subtitle") as HTMLParagraphElement,
}

type Quality = "auto" | "360p" | "720p" | "1080p"


const urlParams = new URLSearchParams(window.location.search)

function showError(errorText: string) {
    let errorDialog = document.getElementById("error-dialog") as HTMLDivElement
    errorDialog.style.display = "block"
    let errorDesc = errorDialog.getElementsByTagName("p")[0] as HTMLParagraphElement
    errorDesc.innerText = errorText
}

class VideoController {
    // @ts-ignore
    player: dashjs.MediaPlayerClass
    private fadingTimer: number
    private languages = new Map()
    private initialized = false
    private episode: Episode

    constructor() {
        let paramChapter = urlParams.get("chapter")
        let paramEpisode = Number(urlParams.get("episode"))
        let episode = manifest.chapters[paramChapter]?.episodes[paramEpisode]
        
        if (!episode) {
            showError(`Unable to resolve video for chapter '${paramChapter}', episode '${paramEpisode}'`)
            return
        }

        if(episode.disabled) {
            showError(`The video for chapter '${paramChapter}', episode '${paramEpisode}' is currently disabled`)
        }

        this.episode = episode

        // @ts-ignore
        this.player = dashjs.MediaPlayer().create()
        this.player.initialize(DOM.Video, episode.src, true);

        this.player.on("streamInitialized", (e: any) => this.init()) // TODO: Look into not calling this on language selection
        this.player.on("playbackPlaying", (e: any) => this.onPlay())
        this.player.on("playbackPaused", (e: any) => this.onPause())
    }

    resolveSource(): string { // TODO: Should read using id or something from params
        return "http://localhost:8080/preprocessor/content/dash/output/manifest.mpd";
    }

    scaleVideo() { // TODO: Should scale to avoid overfitting screen
        let yOffset = DOM.Video.clientHeight - DOM.Video.clientHeight
        let xOffset = DOM.Video.clientWidth - DOM.Video.clientWidth
        DOM.Video.setAttribute("style", "margin-top: " + (-yOffset / 2) + "px; margin-left: " + (-xOffset / 2) + "px")
    }

    init() {
        if (this.initialized) return

        this.player.getTracksFor("audio").forEach((e: any) => { // TODO: Consider using type: dashjs.MediaInfo
            let lang = e.lang
            var langName = "Unknown"
            switch (lang) {
                case "en": langName = "English"; break
                case "no": langName = "Norwegian"; break
                default: console.warn("Unknown language: " + lang); break
            }

            this.languages.set(lang, e)

            let node = document.createElement("a") as HTMLAnchorElement
            node.title = langName
            node.href = "#"
            node.setAttribute("lang", lang)
            node.onclick = (e) => this.setLanguage(lang)

            let img = document.createElement("img") as HTMLImageElement
            img.src = `assets/icons/${lang}.svg`
            img.classList.add("icon-flag")

            node.appendChild(img)
            DOM.LanguageSelector.appendChild(node)
        })

        let selectedLanguage = getCookie("language") || "en"
        this.setLanguage(selectedLanguage)
        
        this.scaleVideo()
        this.setupControls()

        DOM.VideoTitle.innerText = this.episode.title
        if(this.episode.description) {
            DOM.VideoDescription.innerText = this.episode.description
        }

        this.initialized = true
    }

    onPlay() {
        DOM.Overlay.classList.add("faded")
        DOM.IconPlayPause.src = "assets/pause.svg"
    }

    onPause() {
        DOM.Overlay.classList.remove("faded")
        DOM.IconPlayPause.src = "assets/play.svg"
    }

    setupControls() {
        // Play / pause
        DOM.ButtonPlay.onclick = (e) => {
            if (this.player.isPaused()) {
                this.player.play();
            } else {
                this.player.pause();
            }
        }

        // Fullscreen
        DOM.ButtonFullscreen.onclick = (e) => {
            DOM.Video.requestFullscreen()
        }

        // Fading
        DOM.Container.onmousemove = (e: any) => {
            if (DOM.Overlay.classList.contains("faded")) {
                DOM.Overlay.classList.remove("faded")
            } else {
                clearTimeout(this.fadingTimer)
                this.fadingTimer = setTimeout(function () {
                    DOM.Overlay.classList.add("faded")
                }, 2000)
            }
        }

        DOM.QualitySelector["auto"].onclick = (e) => this.setQuality("auto")
        DOM.QualitySelector["360p"].onclick = (e) => this.setQuality("360p")
        DOM.QualitySelector["720p"].onclick = (e) => this.setQuality("720p")
        DOM.QualitySelector["1080p"].onclick = (e) => this.setQuality("1080p")
    }

    setLanguage(lang: string) {
        if(this.languages.has(lang)) {
            this.player.setCurrentTrack(this.languages.get(lang))
        } else {
            let defaultValue = this.languages.entries().next().value
            lang = defaultValue
            console.warn("Trying to set unknown language " + lang + ". Defaulting to " + defaultValue)
        }

        Array.from(DOM.LanguageSelector.children).forEach(element => {
            element.classList.remove("selected")

            if(lang === element.getAttribute("lang")) {
                element.classList.add("selected")
            }
        })

        this.player.setCurrentTrack(this.languages.get(lang))
        setCookie("language", lang)
    }

    setQuality(quality: Quality) {
        DOM.QualitySelector["auto"].classList.remove("selected")
        DOM.QualitySelector["360p"].classList.remove("selected")
        DOM.QualitySelector["720p"].classList.remove("selected")
        DOM.QualitySelector["1080p"].classList.remove("selected")

        DOM.QualitySelector[quality].classList.add("selected")

        if (quality === "auto") {
            this.player.updateSettings({
                streaming: {
                    abr: {
                        autoSwitchBitrate: {
                            video: true
                        }
                    }
                }
            })
        } else {
            this.player.updateSettings({
                streaming: {
                    abr: {
                        autoSwitchBitrate: {
                            video: false
                        }
                    }
                }
            })

            if (quality === "360p") this.player.setQualityFor("video", 0)
            else if (quality === "720p") this.player.setQualityFor("video", 1)
            else if (quality === "1080p") this.player.setQualityFor("video", 2)
            else console.log("Should never happen")
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    let controller = new VideoController()

    // @ts-ignore
    window.videoController = controller
})