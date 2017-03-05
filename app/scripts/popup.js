(function () {
    'use strict';
    //create a new tab
    function createTab() {
        var testPage = chrome.extension.getURL('history.html');
        chrome.tabs.create({ 'url': testPage }, function (tab) {
            console.log(tab);
        });
    }
    // getAllHistory();
    createTab();

}());
