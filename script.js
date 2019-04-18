var classFaded = "faded";
var sources = {
    1: {
        audio: "https://storage.cloud.google.com/mindlessly/bensound-epic.mp3",
        video: "https://storage.cloud.google.com/mindlessly/joaqina.mp4",
        title: "Joaqina Test"
    }
};
var voiceOver = new Audio();
var fadingTimer;
var faded = false;
var playing = false;
Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
    get: function () {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});
function scaleVideo() {
    var videoContainer = document.getElementById("video-container");
    var videoPlayer = document.getElementById("video-player");
    var yOffset = videoPlayer.clientHeight - videoContainer.clientHeight;
    var xOffset = videoPlayer.clientWidth - videoContainer.clientWidth;
    videoPlayer.setAttribute("style", "margin-top: " + (-yOffset / 2) + "px; margin-left: " + (-xOffset / 2) + "px");
}
function setupControls() {
    var videoContainer = document.getElementById("video-container");
    var videoPlayer = document.getElementById("video-player");
    var buttonPlayPause = document.getElementById("button-playpause");
    buttonPlayPause.onclick = function () {
        if (videoPlayer.isPlaying) {
            videoPlayer.pause();
            voiceOver.pause();
            buttonPlayPause.childNodes[0].src = "assets/play.svg";
            videoContainer.classList.add("paused");
        }
        else {
            videoPlayer.play();
            voiceOver.play();
            buttonPlayPause.childNodes[0].src = "assets/pause.svg";
            videoContainer.classList.remove("paused");
        }
    };
}
function setupFading() {
    var videoContainer = document.getElementById("video-container");
    videoContainer.onmousemove = function () {
        if (faded) {
            videoContainer.classList.remove(classFaded);
            faded = false;
        }
        else {
            clearTimeout(fadingTimer);
            fadingTimer = setTimeout(function () {
                videoContainer.classList.add(classFaded);
                faded = true;
            }, 2000);
        }
    };
}
function updateSources() {
    var url = new URL(window.location.href);
    var scene = url.searchParams.get("scene");
    var source = sources[(scene == null) ? 1 : scene];
    if (source == null) {
        alert("Invalid scene <" + scene + ">");
    }
    var videoPlayer = document.getElementById("video-player");
    var node = document.createElement("source");
    node.setAttribute("type", "video/mp4");
    node.setAttribute("src", source.video);
    videoPlayer.appendChild(node);
    voiceOver.src = source.audio;
    document.getElementById("video-title").innerText = source.title;
}
(function () {
    updateSources();
    scaleVideo();
    setupControls();
    setupFading();
    window.onresize = scaleVideo;
})();
// TODO: When voiceover is done, stop video
// TODO: Loop video as long as voice is playing
