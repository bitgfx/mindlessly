(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.manifest = {
    chapters: {
        test: {
            title: "Test Title",
            description: "This is the test description",
            episodes: {
                1: {
                    title: "First test episode",
                    description: "This describes the first test episode",
                    category: "Mindfulness",
                    src: "http://localhost:8080/output/manifest.mpd"
                }
            },
            hidden: true
        },
        brazil: {
            title: "Brazil",
            episodes: {
                1: {
                    title: "The Lagoon",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/brazil/1/manifest.mpd"
                }
            }
        },
        chile: {
            hidden: true,
            title: "Chile",
            episodes: {
                1: {
                    title: "The Pacific Coast",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/chile/1/manifest.mpd"
                }
            }
        },
        iceland: {
            hidden: true,
            title: "Iceland",
            episodes: {
                1: {
                    title: "Black Sands",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/iceland/1/manifest.mpd"
                }
            }
        },
        japan: {
            hidden: true,
            title: "Japan",
            episodes: {
                1: {
                    title: "Green Garden",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/japan/1/manifest.mpd"
                }
            }
        },
        norway: {
            hidden: true,
            title: "Norway",
            episodes: {
                1: {
                    title: "Northern Lights",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/norway/1/manifest.mpd"
                },
                2: {
                    title: "Summer Midnight",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/norway/2/manifest.mpd"
                },
                3: {
                    title: "Mountain Lake",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/norway/3/manifest.mpd"
                },
                4: {
                    title: "Mountain Lake 2",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/norway/4/manifest.mpd"
                },
                5: {
                    title: "Sognefjorden",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/norway/5/manifest.mpd"
                },
                6: {
                    title: "Helgøya",
                    category: "Mindfulness",
                    src: "https://storage.googleapis.com/mindlessly/norway/6/manifest.mpd"
                }
            }
        }
    }
};

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var manifest_1 = require("./manifest");
var util_1 = require("./util");
var DOM = {
    ButtonFullscreen: document.getElementById("button-fullscreen"),
    ButtonPlay: document.getElementById("button-playpause"),
    Video: document.getElementById("video-player"),
    Container: document.getElementById("video-container"),
    Overlay: document.getElementById("overlay"),
    IconPlayPause: document.getElementById("playpause-icon"),
    LanguageSelector: document.getElementById("language-selector"),
    QualitySelector: {
        "auto": document.getElementById("quality-auto"),
        "360p": document.getElementById("quality-360"),
        "720p": document.getElementById("quality-720"),
        "1080p": document.getElementById("quality-1080")
    },
    VideoTitle: document.getElementById("video-title"),
    VideoDescription: document.getElementById("video-subtitle")
};
var urlParams = new URLSearchParams(window.location.search);
function showError(errorText) {
    var errorDialog = document.getElementById("error-dialog");
    errorDialog.style.display = "block";
    var errorDesc = errorDialog.getElementsByTagName("p")[0];
    errorDesc.innerText = errorText;
}
var VideoController = (function () {
    function VideoController() {
        var _this = this;
        var _a;
        this.languages = new Map();
        this.initialized = false;
        var paramChapter = urlParams.get("chapter");
        var paramEpisode = Number(urlParams.get("episode"));
        var episode = (_a = manifest_1.manifest.chapters[paramChapter]) === null || _a === void 0 ? void 0 : _a.episodes[paramEpisode];
        if (!episode) {
            showError("Unable to resolve video for chapter '" + paramChapter + "', episode '" + paramEpisode + "'");
            return;
        }
        if (episode.disabled) {
            showError("The video for chapter '" + paramChapter + "', episode '" + paramEpisode + "' is currently disabled");
        }
        this.episode = episode;
        this.player = dashjs.MediaPlayer().create();
        this.player.initialize(DOM.Video, episode.src, true);
        this.player.on("streamInitialized", function (e) { return _this.init(); });
        this.player.on("playbackPlaying", function (e) { return _this.onPlay(); });
        this.player.on("playbackPaused", function (e) { return _this.onPause(); });
    }
    VideoController.prototype.resolveSource = function () {
        return "http://localhost:8080/preprocessor/content/dash/output/manifest.mpd";
    };
    VideoController.prototype.scaleVideo = function () {
        var yOffset = DOM.Video.clientHeight - DOM.Video.clientHeight;
        var xOffset = DOM.Video.clientWidth - DOM.Video.clientWidth;
        DOM.Video.setAttribute("style", "margin-top: " + (-yOffset / 2) + "px; margin-left: " + (-xOffset / 2) + "px");
    };
    VideoController.prototype.init = function () {
        var _this = this;
        if (this.initialized)
            return;
        this.player.getTracksFor("audio").forEach(function (e) {
            var lang = e.lang;
            var langName = "Unknown";
            switch (lang) {
                case "en":
                    langName = "English";
                    break;
                case "no":
                    langName = "Norwegian";
                    break;
                default:
                    console.warn("Unknown language: " + lang);
                    break;
            }
            _this.languages.set(lang, e);
            var node = document.createElement("a");
            node.title = langName;
            node.href = "#";
            node.setAttribute("lang", lang);
            node.onclick = function (e) { return _this.setLanguage(lang); };
            var img = document.createElement("img");
            img.src = "assets/icons/" + lang + ".svg";
            img.classList.add("icon-flag");
            node.appendChild(img);
            DOM.LanguageSelector.appendChild(node);
        });
        var selectedLanguage = util_1.getCookie("language") || "en";
        this.setLanguage(selectedLanguage);
        this.scaleVideo();
        this.setupControls();
        DOM.VideoTitle.innerText = this.episode.title;
        if (this.episode.description) {
            DOM.VideoDescription.innerText = this.episode.description;
        }
        this.initialized = true;
    };
    VideoController.prototype.onPlay = function () {
        DOM.Overlay.classList.add("faded");
        DOM.IconPlayPause.src = "assets/pause.svg";
    };
    VideoController.prototype.onPause = function () {
        DOM.Overlay.classList.remove("faded");
        DOM.IconPlayPause.src = "assets/play.svg";
    };
    VideoController.prototype.setupControls = function () {
        var _this = this;
        DOM.ButtonPlay.onclick = function (e) {
            if (_this.player.isPaused()) {
                _this.player.play();
            }
            else {
                _this.player.pause();
            }
        };
        DOM.ButtonFullscreen.onclick = function (e) {
            DOM.Video.requestFullscreen();
        };
        DOM.Container.onmousemove = function (e) {
            if (DOM.Overlay.classList.contains("faded")) {
                DOM.Overlay.classList.remove("faded");
            }
            else {
                clearTimeout(_this.fadingTimer);
                _this.fadingTimer = setTimeout(function () {
                    DOM.Overlay.classList.add("faded");
                }, 2000);
            }
        };
        DOM.QualitySelector["auto"].onclick = function (e) { return _this.setQuality("auto"); };
        DOM.QualitySelector["360p"].onclick = function (e) { return _this.setQuality("360p"); };
        DOM.QualitySelector["720p"].onclick = function (e) { return _this.setQuality("720p"); };
        DOM.QualitySelector["1080p"].onclick = function (e) { return _this.setQuality("1080p"); };
    };
    VideoController.prototype.setLanguage = function (lang) {
        var selectedLanguage;
        if (this.languages.has(lang)) {
            selectedLanguage = lang;
        }
        else {
            selectedLanguage = this.languages.keys().next().value;
            console.warn("Trying to set unknown language <" + lang + ">. Defaulting to " + selectedLanguage);
        }
        Array.from(DOM.LanguageSelector.children).forEach(function (element) {
            element.classList.remove("selected");
            if (selectedLanguage === element.getAttribute("lang")) {
                element.classList.add("selected");
            }
        });
        this.player.setCurrentTrack(this.languages.get(selectedLanguage));
        util_1.setCookie("language", selectedLanguage);
    };
    VideoController.prototype.setQuality = function (quality) {
        DOM.QualitySelector["auto"].classList.remove("selected");
        DOM.QualitySelector["360p"].classList.remove("selected");
        DOM.QualitySelector["720p"].classList.remove("selected");
        DOM.QualitySelector["1080p"].classList.remove("selected");
        DOM.QualitySelector[quality].classList.add("selected");
        if (quality === "auto") {
            this.player.updateSettings({
                streaming: {
                    abr: {
                        autoSwitchBitrate: {
                            video: true
                        }
                    }
                }
            });
        }
        else {
            this.player.updateSettings({
                streaming: {
                    abr: {
                        autoSwitchBitrate: {
                            video: false
                        }
                    }
                }
            });
            if (quality === "360p")
                this.player.setQualityFor("video", 0);
            else if (quality === "720p")
                this.player.setQualityFor("video", 1);
            else if (quality === "1080p")
                this.player.setQualityFor("video", 2);
            else
                console.log("Should never happen");
        }
    };
    return VideoController;
}());
document.addEventListener("DOMContentLoaded", function () {
    var controller = new VideoController();
    window.videoController = controller;
});

},{"./manifest":1,"./util":3}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function getCookie(name) {
    var nameLenPlus = (name.length + 1);
    return document.cookie
        .split(';')
        .map(function (c) { return c.trim(); })
        .filter(function (cookie) {
        return cookie.substring(0, nameLenPlus) === name + "=";
    })
        .map(function (cookie) {
        return decodeURIComponent(cookie.substring(nameLenPlus));
    })[0] || null;
}
exports.getCookie = getCookie;
function setCookie(name, val) {
    var date = new Date();
    var value = val;
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/; SameSite=Lax";
}
exports.setCookie = setCookie;
function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}
exports.deleteCookie = deleteCookie;

},{}]},{},[2]);
