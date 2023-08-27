// ==UserScript==
// @name         ORBIT
// @namespace    http://tampermonkey.net/
// @version      1.035
// @description  Old Reddit Ban Insertion Tool -- Autofill ban fields on the Old Reddit ban page based on made-up URL parameters.
// @author       portable-hole
// @match        https://old.reddit.com/r/*/about/banned/*
// @downloadURL  https://github.com/portable-hole/ORBIT/raw/main/ORBIT.user.js
// @updateURL    https://github.com/portable-hole/ORBIT/raw/main/ORBIT.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define your key-pair dictionary here
    // BE SURE to list subreddit in all lowercase, as the script does a comparison to lowercase.
    const subredditBanConfig = {
        "dadsgonewild": {
            "requiredAge": 30,
            "reasons": {
                1: "You have been banned for violating **Rule 2**. All content must depict men **aged 50+ only**. Do not post content outside this scope. You are ",  // age related
                2: "You have been banned for using inappropriate language.",
                3: "You have been banned for not following subreddit guidelines."
                // Add other reasons as needed
            }
        },
        "daddypics": {
            "requiredAge": 40,
            "reasons": {
                1: "You have been banned for violating **Rule 2**. All content must depict men **aged 50+ only**. Do not post content outside this scope. You are ",  // age related
                2: "You have been banned for using inappropriate language.",
                3: "You have been banned for not following subreddit guidelines."
                // Add other reasons as needed
            }
        },
        "olddicks": {
            "requiredAge": 40,
            "reasons": {
                1: "You have been banned for violating **Rule 2**. All content must depict men **aged 50+ only**. Do not post content outside this scope. You are ",  // age related
                2: "You have been banned for using inappropriate language.",
                3: "You have been banned for not following subreddit guidelines."
                // Add other reasons as needed
            }
        },
        "grandpasgonewild": {
            "requiredAge": 50,
            "reasons": {
                1: "You have been banned for violating **Rule 2**. All content must depict men **aged 50+ only**. Do not post content outside this scope. You are ",  // age related
                2: "You have been banned for using inappropriate language.",
                3: "You have been banned for not following subreddit guidelines."
                // Add other reasons as needed
            }
        }
        // Add other subreddits as needed
    };

    const defaultBanMessage = "You have been banned for violating the subreddit rules.";

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

        let reasonCode = parseInt(getParameterByName('reason'), 10);

        let realAgeString = getParameterByName('agetrue');
        let ageFakeString = getParameterByName('agefake');
        let realAge = parseInt(realAgeString, 10);
        let ageFake = parseInt(ageFakeString, 10);

        if (isNaN(realAge) || isNaN(ageFake)) {
            console.log("Invalid or missing age parameters.");
            return; // Invalid or missing age parameters
        }

        console.log("Real Age:", realAge);
        console.log("Age Fake:", ageFake);

        let subredditMatch = window.location.href.match(/https:\/\/old\.reddit\.com\/r\/(.*?)\//);
        let subreddit = (subredditMatch && subredditMatch[1]) ? subredditMatch[1].toLowerCase() : null;

        let config = subredditBanConfig[subreddit];

        let banMessage, banDuration;

        if (config) {
            let messageTemplate = config.reasons[reasonCode];
            if (reasonCode === 1) { // If reason is age related
                banMessage = messageTemplate + realAge + ".";
                let ageDifference = config.requiredAge - realAge;
                if (ageDifference === 3) {
                    banDuration = 999;
                } else if (ageDifference >= 1 && ageDifference <= 2) {
                    banDuration = Math.max(330 * ageDifference, 1);
                } else {
                    banDuration = ''; // Permanent ban
                }
            } else {
                banMessage = messageTemplate;  // For other reasons, use the message as it is
                banDuration = ''; // Default is permanent ban, adjust if needed
            }
        } else {
            banMessage = defaultBanMessage;
            banDuration = ''; // Default is permanent ban
        }

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
