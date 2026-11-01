// ==UserScript==
// @name         Better ONE CHAMPIONSHIP Player
// @namespace    http://live.onefc.com/
// @version      1.0.1-2026-11-01
// @description  Slightly hides language selector and brings mouse & keyboard improvements to web player
// @author       Andaroth
// @match        https://live.onefc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onefc.com
// ==/UserScript==

(function() {
    "use strict"
    let video, mouseTimeout, enabled;
    function improveLanguagePicker() {
        if (!!document.head.querySelector("andaroth-better-player")) return;
        const [style, css] = [document.createElement('style'), `div.nav-pip-selector { opacity: 0.1; } div.nav-pip-selector:hover { opacity: 1; }`];
        style.id = "andaroth-better-player";
        style.type = "text/css";
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    function toggleCursor() {
        clearTimeout(mouseTimeout);
        document.body.style.setProperty("cursor", "auto", "important");
        mouseTimeout = setTimeout(function() {
            if (video && !video.paused) document.body.style.setProperty("cursor", "none", "important")
        }, 1000);
    }
    function findVideo() { return document.querySelector("video#bitmovinplayer-video-null") }
    function toggleVideoPlay() { if (video) (function() { video.paused ? video.play() : video.pause() })() }
    function changeVideoTime(delta) { if (video) video.currentTime += delta }
    function changeVideoVolume(delta) { if (video) video.volume = Math.min(Math.max((video.volume || 0) + delta, 0), 1) }
    function toggleVideoMute() { if (video) video.muted = !video.muted }
    function improveVideo() {
        video = findVideo();
        if (!video) return;
        video.addEventListener("click", toggleVideoPlay);
        video.addEventListener("mouseenter", toggleCursor);
        video.addEventListener("mousemove", toggleCursor);
        video.addEventListener("mouseleave", function() {
            clearTimeout(mouseTimeout);
            document.body.style.setProperty("cursor", "auto", "important");
        });
    }
    function initBetterVideo() {
        if (enabled) return;
        improveLanguagePicker();
        improveVideo();
        enabled = !!video;
    }
    // player generic events:
    window.addEventListener("keyup", function(event) {
        (({
            [event.code === "Space"]: toggleVideoPlay,
            [event.key === "m"]: toggleVideoMute
        })[!!true] || (() => {}))();
    });
    window.addEventListener("keydown", function(event) {
        (({
            [event.key === "ArrowUp"]: function() { changeVideoVolume(0.1) },
            [event.key === "ArrowDown"]: function() { changeVideoVolume(-0.1) },
            // [event.key === "ArrowLeft"]: function() { changeVideoTime(-10) }, // Breaks stream (Issue #1)
            // [event.key === "ArrowRight"]: function() { changeVideoTime(10) } // Issue #1
        })[!!true] || (() => {}))();
    });
    // Search player in page:
    setInterval(function() {
        if (!!findVideo() && !enabled) initBetterVideo();
        else if (!findVideo()) enabled = false;
    }, 1000);
})();
