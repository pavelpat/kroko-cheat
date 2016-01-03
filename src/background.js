"use strict";

var krokoUrl = 'http://188.93.22.210/kroko/newKroko*';


function toWord(wordEnc) {
    var result = '',
        items = wordEnc.split(',');
    for(var i = 0; i < items.length - 5; i++) {
        result += String.fromCharCode(items[i] - i);
    }

    return result;
}

function parseWords(xml){
    var parser = new DOMParser(),
        xmlDoc = parser.parseFromString(xml, 'text/xml'),
        wordEnc1 = xmlDoc.querySelector('word').textContent,
        wordEnc2 = xmlDoc.querySelector('word2').textContent,
        wordEnc3 = xmlDoc.querySelector('word3').textContent;

    return [wordEnc1, wordEnc2, wordEnc3];
}

chrome.webRequest.onCompleted.addListener(function(details) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', details.url, false);
    xhr.send(null);

    var words = parseWords(xhr.responseText).map(toWord).filter(Boolean);
    if (!words.length) return;

    chrome.tabs.query({active: true}, function(tabs) {
        if (!tabs) return;
        var wordsLiteral = JSON.stringify(words.join(', '));
        chrome.tabs.executeScript(tabs[0].id, {
            code: 'document.title = ' + wordsLiteral + ';'
        });
    });
}, {
    urls: [krokoUrl]
}, []);
