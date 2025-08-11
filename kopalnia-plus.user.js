// ==UserScript==
// @name         Kopalnia Plus
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @description  Dodatek podświetlający kryształy, kilofy oraz ich respy na krwawych kopalniach
// @author       neyluu
// @match        https://*.margonem.pl/*
// @exclude      https://www.margonem.pl/*
// @grant        none
// @require      https://neyluu.github.io/kopalnia-plus/main.js
// @supportURL   https://github.com/neyluu/kopalnia-plus/issues
// ==/UserScript==

(function() {
    window.config = {
        pickaxesSpawns: true,
        pickaxes:       true,
        depositsSpawns: true,
        deposits:       true,
        colors: {
            pickaxe:        "rgba(240, 240, 240, 1)",
            pickaxeSpawn:   "rgba(196, 196, 196, 0.75)",
            deposit:        "rgba(255, 0, 0, 1)",
            depositSpawn:   "rgba(255, 0, 0, 0.75)"
        },
        size: {
            pickaxe:        32,
            pickaxeSpawn:   20,
            deposit:        32,
            depositSpawn:   20
        }
    }

    main();
})();