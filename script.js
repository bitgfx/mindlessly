var classFaded = "faded";
var sources = {
    1: {
        audio: "https://storage.googleapis.com/mindlessly/norway/1-northern-lights/voice.mp3",
        video: "https://storage.googleapis.com/mindlessly/norway/1-northern-lights/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/norway/1-northern-lights/thumbnail-s.jpg",
        title: "Norway",
        subtitle: "Northern Lights"
    },
    2: {
        audio: "https://storage.googleapis.com/mindlessly/japan/1-japan/voice.mp3",
        video: "https://storage.googleapis.com/mindlessly/japan/1-japan/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/japan/1-japan/thumbnail-s.jpg",
        title: "Japan",
        subtitle: "Untitled"
    },
    3: {
        audio: "https://storage.googleapis.com/mindlessly/chile/1-chile/voice.mp3",
        video: "https://storage.googleapis.com/mindlessly/chile/1-chile/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/chile/1-chile/thumbnail-s.jpg",
        title: "Chile",
        subtitle: "The Pacific Coast"
    },
    4: {
        audio: "https://storage.googleapis.com/mindlessly/iceland/1-iceland/voice.mp3",
        video: "https://storage.googleapis.com/mindlessly/iceland/1-iceland/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/iceland/1-iceland/thumbnail-s.jpg",
        title: "Iceland",
        subtitle: "Untitled"
    },
    5: {
        audio: "https://storage.googleapis.com/mindlessly/brazil/1-brazil/voice.mp3",
        video: "https://storage.googleapis.com/mindlessly/brazil/1-brazil/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/brazil/1-brazil/thumbnail-s.jpg",
        title: "Brazil",
        subtitle: "The lagoon"
    },
    6: {
        audio: "https://storage.googleapis.com/mindlessly/norway/2-summer-midnight/voice.mp3",
        video: "https://storage.googleapis.com/mindlessly/norway/2-summer-midnight/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/norway/2-summer-midnight/thumbnail-s.jpg",
        title: "Norway",
        subtitle: "Summer Midnight"
    },
    7: {
        audio: "https://storage.googleapis.com/mindlessly/default.mp3",
        video: "https://storage.googleapis.com/mindlessly/norway/3-mountain-lake/video.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/norway/3-mountain-lake/thumbnail-s.jpg",
        title: "Norway",
        subtitle: "Mountain Lake"
    },
    8: {
        audio: "https://storage.googleapis.com/mindlessly/default.mp3",
        video: "https://storage.googleapis.com/mindlessly/norway/4-mountain-lake/video-1080.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/norway/4-mountain-lake/thumbnail-s.jpg",
        title: "Norway",
        subtitle: "Mountain Lake 2"
    },
    9: {
        audio: "https://storage.googleapis.com/mindlessly/default.mp3",
        video: "https://storage.googleapis.com/mindlessly/norway/5-sognefjorden/video-1080.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/norway/5-sognefjorden/thumbnail-s.jpg",
        title: "Norway",
        subtitle: "The fjords"
    },
    10: {
        audio: "https://storage.googleapis.com/mindlessly/default.mp3",
        video: "https://storage.googleapis.com/mindlessly/norway/6-helgoya/video-720.mp4",
        thumb: "https://storage.googleapis.com/mindlessly/norway/6-helgoya/thumbnail-s.jpg",
        title: "Norway",
        subtitle: "Helgøya"
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
    document.getElementById("video-subtitle").innerText = source.subtitle;
}
function setupSceneSelection() {
    var sceneList = document.getElementById("scene-list");
    for (var key in sources) {
        var name_1 = key + ". " + sources[key].title + ": " + sources[key].subtitle;
        var link = document.createElement("a");
        link.setAttribute("href", "?scene=" + key);
        link.appendChild(document.createTextNode(name_1));
        var li = document.createElement("li");
        li.appendChild(link);
        sceneList.appendChild(li);
    }

    document.getElementById("button-scenes").onmouseover = function () {
        var aa = document.getElementById("scene-selection");
        aa.classList.remove("hidden");
    };

    document.getElementById("button-scenes").click = function () {
        var aa = document.getElementById("scene-selection");
        aa.classList.remove("hidden");    
        // TODO: Make a if else / toggle between hide and show on click on button-scenes icon
    };

    document.getElementById("scene-selection").onmouseleave = function () {
        var aa = document.getElementById("scene-selection");
        aa.classList.add("hidden");
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


/* Toggle fullscreen */
function toggleFullscreen(elem) {
  elem = elem || document.documentElement;
  var iconFullscreen = document.getElementById('icon-fullscreen');
  var fullscreenIconUrl = 'assets/icon-fullscreen-24px.svg';
  var fullscreenExitIconUrl = 'assets/icon-fullscreen_exit-24px.svg';
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    var newImage = new Image;
    newImage.onload = function (){
        iconFullscreen.src = fullscreenExitIconUrl;
    };
    newImage.src = fullscreenExitIconUrl;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    iconFullscreen.src = fullscreenIconUrl;
  }
}
/* Toggle fullscreen - event listener on button */
document.getElementById('button-fullscreen').addEventListener('click', function() {
  toggleFullscreen();
});


// TODO: Legge inn thumbnails i menyen


// TODO: When voiceover is done , stop video 
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
