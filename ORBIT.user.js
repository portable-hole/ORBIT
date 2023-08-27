// ==UserScript==
// @name         ORBIT
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Old Reddit Ban Insertion Tool -- Autofill ban fields on the Old Reddit ban page based on made-up URL parameters.
// @author       portable-hole
// @match        https://old.reddit.com/r/DadsGoneWild/about/banned/*
// @downloadURL  https://github.com/portable-hole/ORBIT/raw/main/ORBIT.user.js
// @updateURL    https://github.com/portable-hole/ORBIT/raw/main/ORBIT.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Parse URL parameters
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Fill ban form fields
    function fillBanFields() {
        console.log("Running the script...");

        let username = getParameterByName('user');
        console.log("Username:", username);

        if (!username) {
            console.log("Username parameter not passed.");
            return; // Parameter not passed
        }

        let realAgeString = getParameterByName('agetrue');
        let ageFakeString = getParameterByName('agefake');
        let realAge = parseInt(realAgeString, 10);
        let ageFake = parseInt(ageFakeString, 10);

        if (isNaN(realAge) || isNaN(ageFake) || realAge >= 30) {
            console.log("Invalid or missing age parameters.");
            return; // Invalid or missing age parameters
        }

        console.log("Real Age:", realAge);
        console.log("Age Fake:", ageFake);

        let banDuration = ''; // Blank ban duration by default

        if (realAge >= 27 && realAge <= 29) {
            banDuration = Math.max(330 * (30 - realAge), 1);
        }

        let banMessage = "You have been banned for violating **Rule 2**. All content must depict men **aged 30+ only**. Do not post content outside this scope. You are " + realAge + ".";

        // Fill fields
        document.querySelector('.friend-name').value = username;
        document.querySelector('#note').value = realAge + " as " + ageFake + " to evade bot";
        document.querySelector('#duration').value = banDuration;
        document.querySelector('#ban_message').value = banMessage;

        console.log("Filled all required fields.");

        // Clear junk field if all required fields are filled
        if (document.querySelector('.friend-name') && document.querySelector('#note') && document.querySelector('#duration') && document.querySelector('#ban_message')) {
            document.querySelector('#user').value = '';
            console.log("Cleared the unused field.");
        }
    }

    // Run the script
    fillBanFields();
})();
