'use strict';

//create a new tab

(function (doc) {
    chrome.tabs.create({
        url: './history.html'
    });
})(document);