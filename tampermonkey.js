// ==UserScript==
// @name         Better ONE CHAMPIONSHIP Player
// @namespace    http://live.onefc.com/
// @version      1.0.0-2026-10-31
// @description  Slightly hides language selector one ONE CHAMPIONSHIP video player & Improvements
// @author       Andaroth
// @match        https://live.onefc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onefc.com
// @grant        none
// ==/UserScript==

(function() {
    "use strict"
    let video, mouseTimeout, findVideoTagInterval;

    function improveLanguagePicker() {
        const style = document.createElement('style');
        style.type = "text/css";
        const css = `div.nav-pip-selector { opacity: 0.1; } div.nav-pip-selector:hover { opacity: 1; }`;
        document.head.appendChild(style);
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
    }

    function toggleCursor() {
        clearTimeout(mouseTimeout);
        document.body.style.setProperty("cursor", "auto", "important");
        mouseTimeout = setTimeout(() => {
            if (!video.paused) document.body.style.setProperty("cursor", "none", "important");
        }, 1000);
    }

    function toggleVideoPlay() {
        if (video.paused) video.play()
        else video.pause()
    }

    function changeVideoTime(delta) { video.currentTime += delta }

    function changeVideoVolume(delta) { video.volume = Math.min(Math.max((video.volume || 0) + delta, 0), 1) }

    function toggleVideoMute() { video.muted = !video.muted }

    function initBetterVideo() {
        improveLanguagePicker(); // Opacity of language selector
        video.addEventListener("click", toggleVideoPlay); // play/pause on video click
        // Hide mouse on video play:
        video.addEventListener("mouseenter", toggleCursor);
        video.addEventListener("mousemove", toggleCursor);
        video.addEventListener("mouseleave", () => {
            clearTimeout(mouseTimeout);
            document.body.style.setProperty("cursor", "auto", "important");
        });
        // player generic events:
        window.addEventListener("keyup", (event) => {
            (({
                [event.code === "Space"]: toggleVideoPlay,
                [event.key === "ArrowUp"]: (() => changeVideoVolume(0.1)),
                [event.key === "ArrowDown"]: (() => changeVideoVolume(-0.1)),
                // [event.key === "ArrowLeft"]: (() => changeVideoTime(-10)), // Breaks stream (Issue #1)
                // [event.key === "ArrowRight"]: (() => changeVideoTime(10)), // Issue #1
                [event.key === "m"]: toggleVideoMute
            })[!!true] || (() => {}))()
        })
        clearInterval(findVideoTagInterval)
    }

    findVideoTagInterval = setInterval(function() {
        video = document.querySelector("video#bitmovinplayer-video-null");
        if (!!video) initBetterVideo()
    }, 1000)
})();
