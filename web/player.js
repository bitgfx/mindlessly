"use strict";
exports.__esModule = true;
var manifest_1 = require("./manifest");
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
    }
};
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
function setCookie(name, val) {
    var date = new Date();
    var value = val;
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}
function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}
var urlParams = new URLSearchParams(window.location.search);
function getEpisode() {
    var _a;
    var paramChapter = urlParams.get("chapter");
    var paramEpisode = Number(urlParams.get("episode"));
    var chapter = manifest_1.manifest.chapters[paramChapter];
    var episode = (_a = manifest_1.manifest.chapters[paramChapter]) === null || _a === void 0 ? void 0 : _a.episodes[paramEpisode];
    if (chapter && episode) {
        return [chapter, episode];
    }
    else {
        return null;
    }
}
var VideoController = (function () {
    function VideoController() {
        var _this = this;
        this.languages = new Map();
        this.initialized = false;
        var url = this.resolveSource();
        this.player = dashjs.MediaPlayer().create();
        this.player.initialize(DOM.Video, url, true);
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
        console.log(manifest_1.manifest.chapters);
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
        var selectedLanguage = getCookie("language") || "en";
        this.setLanguage(selectedLanguage);
        this.scaleVideo();
        this.setupControls();
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
        if (this.languages.has(lang)) {
            this.player.setCurrentTrack(this.languages.get(lang));
        }
        else {
            var defaultValue = this.languages.entries().next().value;
            lang = defaultValue;
            console.warn("Trying to set unknown language " + lang + ". Defaulting to " + defaultValue);
        }
        Array.from(DOM.LanguageSelector.children).forEach(function (element) {
            element.classList.remove("selected");
            if (lang === element.getAttribute("lang")) {
                element.classList.add("selected");
            }
        });
        this.player.setCurrentTrack(this.languages.get(lang));
        setCookie("language", lang);
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
