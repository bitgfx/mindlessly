const classFaded = "faded"

const sources = {
    0: {
        audio: "https://storage.cloud.google.com/mindlessly/bensound-epic.mp3",
        video: "https://storage.cloud.google.com/mindlessly/joaqina.mp4",
        title: "Joaqina Test"
    },
    1: {
        audio: "https://storage.cloud.google.com/mindlessly/voice.mp3",
        video: "https://storage.cloud.google.com/mindlessly/scene-720.mp4",
        title: "Northern Lights"
    }
}

const voiceOver = new Audio()

var fadingTimer
var faded = false
var playing = false

Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})


function scaleVideo() {
    let videoContainer = document.getElementById("video-container")
    let videoPlayer = document.getElementById("video-player")

    let yOffset = videoPlayer.clientHeight - videoContainer.clientHeight
    let xOffset = videoPlayer.clientWidth - videoContainer.clientWidth
    videoPlayer.setAttribute("style", "margin-top: " + (-yOffset / 2) + "px; margin-left: " + (-xOffset / 2) + "px")
}

function setupControls() {
    let videoContainer = document.getElementById("video-container")
    let videoPlayer = document.getElementById("video-player")
    let buttonPlayPause = document.getElementById("button-playpause")

    buttonPlayPause.onclick = function() {
        if (videoPlayer.isPlaying) {
            videoPlayer.pause()
            voiceOver.pause()
            buttonPlayPause.childNodes[0].src = "assets/play.svg"
            videoContainer.classList.add("paused")
        } else {
            videoPlayer.play()
            voiceOver.play()
            buttonPlayPause.childNodes[0].src = "assets/pause.svg"
            videoContainer.classList.remove("paused")
        }
    }
}



function setupFading() {
    let videoContainer = document.getElementById("video-container")

    videoContainer.onmousemove = function() {
        if (faded) {
            videoContainer.classList.remove(classFaded)
            faded = false
        } else {
            clearTimeout(fadingTimer)
            fadingTimer = setTimeout(function() {
                videoContainer.classList.add(classFaded)
                faded = true
                
            }, 2000)
        }
    }
}

function updateSources() {
    let url = new URL(window.location.href)
    let scene = url.searchParams.get("scene")
    let source = sources[(scene == null) ? 1 : scene]
   
    if (source == null) {
        alert("Invalid scene <" + scene + ">")
    }
    
    let videoPlayer = document.getElementById("video-player")
    
    let node = document.createElement("source")
    node.setAttribute("type", "video/mp4")
    node.setAttribute("src", source.video)

    videoPlayer.appendChild(node)

    voiceOver.src = source.audio

    document.getElementById("video-title").innerText = source.title
}

(function() {
    updateSources()
    scaleVideo()
    setupControls()
    setupFading()
    window.onresize = scaleVideo
 })()

// TODO: When voiceover is done, stop video
// TODO: Loop video as long as voice is playing
/* TODO: Handle buffering
    video.onwaiting = function(){
        showPlaceholder(placeholder, this);
    };
    video.onplaying = function(){
        hidePlaceholder(placeholder, this);
    };
*/