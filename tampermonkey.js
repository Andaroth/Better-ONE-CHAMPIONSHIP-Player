// ==UserScript==
// @name         Better ONE CHAMPIONSHIP Player
// @namespace    http://live.onefc.com/
// @version      2026-10-30
// @description  Slightly hides language selector one ONE CHAMPIONSHIP video player & Improvements
// @author       Andaroth
// @match        https://live.onefc.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onefc.com
// @grant        none
// ==/UserScript==

(function() {
    // Opacity of language selector:
    const style = document.createElement('style')
    style.type = "text/css"
    const css = `div.nav-pip-selector { opacity: 0.1; } div.nav-pip-selector:hover { opacity: 1; }`
    document.head.appendChild(style)
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));

    let video = document.querySelector("video#bitmovinplayer-video-null");
    let mouseTimeout, findVideoTagInterval;

    function toggleCursor() {
        clearTimeout(mouseTimeout);
        document.body.style.setProperty("cursor", "auto", "important");
        mouseTimeout = setTimeout(() => {
            if (!video.paused) document.body.style.setProperty("cursor", "none", "important")
        }, 1000);
    }

    function initBetterVideo() {
        // Hide mouse on video play:
        video.addEventListener("mouseenter", toggleCursor);
        video.addEventListener("mousemove", toggleCursor);
        video.addEventListener("mouseleave", () => {
            clearTimeout(mouseTimeout);
            document.body.style.setProperty("cursor", "auto", "important");
        });

        // play/pause on space key
        video.addEventListener("keyup", (event) => {
            if (event.code === "Space") {
                if (video.paused) video.play()
                else video.pause()
            }
        })
        clearInterval(findVideoTagInterval)
    }

    findVideoTagInterval = setInterval(function() {
        video = document.querySelector("video#bitmovinplayer-video-null");
        if (!!video) initBetterVideo()
    }, 1000)
})();
