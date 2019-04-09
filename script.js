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
    var videoPlayer = document.getElementById("video-player");
    var buttonPlayPause = document.getElementById("button-playpause");
    var voiceOver = new Audio();
    voiceOver.src = "bensound-epic.mp3";
    buttonPlayPause.onclick = function () {
        if (videoPlayer.isPlaying) {
            videoPlayer.pause();
            voiceOver.pause();
            buttonPlayPause.childNodes[0].src = "assets/play.svg";
        }
        else {
            videoPlayer.play();
            voiceOver.play();
            buttonPlayPause.childNodes[0].src = "assets/pause.svg";
        }
    };
}
(function () {
    scaleVideo();
    setupControls();
    window.onresize = scaleVideo;
})();
// TODO: Add fade in and out controls on mouse move
// TODO: When voiceover is done, stop video
// TODO: Loop video as long as voice is playing
