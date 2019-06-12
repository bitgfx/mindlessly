var classFaded = "faded";
var sources = {
    1: {
        audio: "https://storage.cloud.google.com/mindlessly/voice.mp3",
        video: "https://storage.cloud.google.com/mindlessly/scene-720.mp4",
        title: "Northern Lights"
    },
    2: {
        audio: "https://storage.cloud.google.com/mindlessly/Japan-Audio.mp3",
        video: "https://storage.cloud.google.com/mindlessly/Japan-Video.mp4",
        title: "Japan"
    },
    3: {
        audio: "https://storage.cloud.google.com/mindlessly/Chile-Audio.mp3",
        video: "https://storage.cloud.google.com/mindlessly/Chile-Video.mp4",
        title: "Chile"
    },
    4: {
        audio: "https://storage.cloud.google.com/mindlessly/Iceland-Audio.mp3",
        video: "https://storage.cloud.google.com/mindlessly/Iceland-Video.mp4",
        title: "Iceland"
    },
    5: {
        audio: "https://storage.cloud.google.com/mindlessly/Brazil-Audio.mp3",
        video: "https://storage.cloud.google.com/mindlessly/Brazil-Video.mp4",
        title: "Brazil"
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
function setupSceneSelection() {
    var sceneList = document.getElementById("scene-list");
    for (var key in sources) {
        var name_1 = sources[key].title;
        var link = document.createElement("a");
        link.setAttribute("href", "?scene=" + key);
        link.appendChild(document.createTextNode(name_1));
        var li = document.createElement("li");
        li.appendChild(link);
        sceneList.appendChild(li);
    }
    document.getElementById("close").onclick = function () {
        var aa = document.getElementById("scene-selection");
        aa.classList.add("hidden");
    };
    document.getElementById("button-settings").onclick = function () {
        var aa = document.getElementById("scene-selection");
        aa.classList.remove("hidden");
    };
}
(function () {
    updateSources();
    scaleVideo();
    setupControls();
    setupFading();
    window.onresize = scaleVideo;
    setupSceneSelection();
})();
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
// TODO: Arbitrary number of videos. Need to rename videos and ceate folders in G cloud
// TODO: Split up media in segments: https://medium.com/canal-tech/how-video-streaming-works-on-the-web-an-introduction-7919739f7e1
