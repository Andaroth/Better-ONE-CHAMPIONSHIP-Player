// ==UserScript==
// @name         Better ONE CHAMPIONSHIP Player
// @namespace    http://live.onefc.com/
// @version      2026-10-31
// @description  Slightly hides language selector one ONE CHAMPIONSHIP video player & Improvements
// @author       Andaroth
// @match        https://live.onefc.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onefc.com
// @grant        none
// ==/UserScript==

(function() {
    let video, mouseTimeout, findVideoTagInterval;

    function improveLanguagePicker() {
        const style = document.createElement('style')
        style.type = "text/css"
        const css = `div.nav-pip-selector { opacity: 0.1; } div.nav-pip-selector:hover { opacity: 1; }`
        document.head.appendChild(style)
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
    }

    function toggleCursor() {
        clearTimeout(mouseTimeout);
        document.body.style.setProperty("cursor", "auto", "important");
        mouseTimeout = setTimeout(() => {
            if (!video.paused) document.body.style.setProperty("cursor", "none", "important")
        }, 1000);
    }

    function toggleVideoPlay() {
        if (video.paused) video.play()
        else video.pause()
    }

    function changeVideoTimeByDelta(delta) { video.currentTime += delta }
    function changeVideoVolume(value) { video.volume = value }

    function toggleVideoMute() { video.muted = !video.muted }

    function initBetterVideo() {
        // Opacity of language selector:
        improveLanguagePicker()
        // Hide mouse on video play:
        video.addEventListener("click", toggleVideoPlay)
        video.addEventListener("mouseenter", toggleCursor);
        video.addEventListener("mousemove", toggleCursor);
        video.addEventListener("mouseleave", () => {
            clearTimeout(mouseTimeout);
            document.body.style.setProperty("cursor", "auto", "important");
        });

        window.addEventListener("keyup", (event) => {
            (({
                [event.code === "Space"]: toggleVideoPlay,
                [event.key === "ArrowUp"]: (() => changeVideoVolume(Math.min(Math.max((video.volume || 0) + 0.1, 0), 1))),
                [event.key === "ArrowDown"]: (() => changeVideoVolume(Math.min(Math.max((video.volume || 0) - 0.1, 0), 1))),
                // [event.key === "ArrowLeft"]: (() => changeVideoTimeByDelta(-10)), // breaks client player
                // [event.key === "ArrowRight"]: (() => changeVideoTimeByDelta(10)), // breaks client player
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
