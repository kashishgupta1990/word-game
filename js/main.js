// MVC Structure Init
window.APP = {
    MODEL: {},
    VIEW: {},
    CONTROLLER: {}
};

window.UTIL = {
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    wordCount: function (word) {
        var obj = {};
        for (var i = 0; i < word.length; i++) {
            if (!obj[word[i]]) {
                obj[word[i]] = 0;
            }
            obj[word[i]]++;
        }
        return obj;
    }
};

jQuery(document).ready(init);

function init() {
    var removedAlphabetEle = $('#removedAlphabet');
    var answerEle = $('#answer');
    var txtRemovedAlphabet = document.getElementById('removedAlphabet');

    // VIEW Methods
    window.APP.VIEW.createBalloon = function (alphabet) {
        var _that = this;
        _that.alphabet = alphabet;

        // Create Balloon
        _that.element = jQuery('<div>', {
            id: alphabet
        }).addClass('balloon').append('<span>' + alphabet + '</span>').appendTo('#mainBody');

        // Click event bind
        _that.element.bind('click', (function (alph) {
            return function (e) {
                window.APP.MODEL.RESULT_WORD = removedAlphabetEle.val();
                window.APP.MODEL.RESULT_WORD += _that.alphabet;
                removedAlphabetEle.val(window.APP.MODEL.RESULT_WORD);
                _that.remove();
                _that.showPopUp();
            };
        })(alphabet));

        _that.remove = function () {
            _that.element.remove();
        };
    };

    window.APP.VIEW.createBalloon.prototype.showPopUp = function () {
        var flag, flag2;
        var balloonEl = $('.balloon');
        if (window.APP.MODEL.CURRENT_WORD.length === window.APP.MODEL.RESULT_WORD.length) {
            balloonEl.remove();
            if (window.APP.MODEL.CURRENT_WORD === window.APP.MODEL.RESULT_WORD) {
                flag = confirm('Good Job!, Do you want new word');
                if (flag) {
                    window.APP.MODEL.UI_ALPHABET_LIST = [];
                    flag2 = window.APP.CONTROLLER.fetchNewWork();
                    if (!flag2) {
                        alert('Thanks for playing!, Words are finished');
                    }
                } else {
                    alert('Thanks for playing!');
                    //window.APP.CONTROLLER.init();
                }
            } else {
                flag = confirm('Opps! Wrong Answer, Want to try again ?');
                if (flag) {
                    window.APP.MODEL.UI_ALPHABET_LIST = [];
                    window.APP.CONTROLLER.reTry();
                } else {
                    answerEle.val(window.APP.MODEL.CURRENT_WORD);
                }
            }
        }
    };

    // CONTROLLER Methods
    window.APP.CONTROLLER.init = function () {

        // MODEL
        window.APP.MODEL.CURRENT_WORD = '';
        window.APP.MODEL.RESULT_WORD = '';
        window.APP.MODEL.ALPHABET_LIST = [];
        window.APP.MODEL.UI_ALPHABET_LIST = [];

        window.APP.CONTROLLER.fetchNewWork();
    };

    window.APP.CONTROLLER.fetchNewWork = function () {
        var wordList = window.APP.MODEL.WORD_LIST;
        window.APP.MODEL.RESULT_WORD = '';
        window.APP.MODEL.ALPHABET_LIST = [];
        window.APP.MODEL.UI_ALPHABET_LIST = [];
        window.APP.CONTROLLER.clearUIAlphabetList();
        removedAlphabetEle.val('');
        var alphaList;
        if (wordList.length > 0) {
            wordList = window.UTIL.shuffle(wordList);
            window.APP.MODEL.CURRENT_WORD = wordList.pop();
            alphaList = window.APP.CONTROLLER.wordToShuffleAlphabetArray(window.APP.MODEL.CURRENT_WORD);
            window.APP.CONTROLLER.renderWord(alphaList);
            return true;
        } else {
            return false;
        }
    };

    window.APP.CONTROLLER.wordToShuffleAlphabetArray = function (word) {
        var alphArray = word.split('');
        alphArray = window.UTIL.shuffle(alphArray);
        return alphArray;
    };

    window.APP.CONTROLLER.reTry = function () {
        var currentWord = window.APP.MODEL.CURRENT_WORD;
        removedAlphabetEle.val('');
        window.APP.CONTROLLER.clearUIAlphabetList();
        window.APP.MODEL.ALPHABET_LIST = currentWord = window.APP.CONTROLLER.wordToShuffleAlphabetArray(currentWord);

        window.APP.CONTROLLER.renderWord(currentWord);
        return currentWord;
    };

    window.APP.CONTROLLER.clearUIAlphabetList = function () {
        if (window.APP.MODEL.UI_ALPHABET_LIST.length > 0) {
            var tmp;
            for (var index = 0; index < window.APP.MODEL.UI_ALPHABET_LIST.length; index++) {
                tmp = window.APP.MODEL.UI_ALPHABET_LIST[index];
                tmp.remove();
            }
        }
        window.APP.MODEL.UI_ALPHABET_LIST = [];
    };

    window.APP.CONTROLLER.renderWord = function (alphabetList) {
        window.APP.MODEL.ALPHABET_LIST = alphabetList = window.UTIL.shuffle(alphabetList);
        window.APP.MODEL.RESULT_WORD = '';
        window.APP.CONTROLLER.clearUIAlphabetList();
        window.APP.MODEL.UI_ALPHABET_LIST = [];
        for (var index = 0; index < alphabetList.length; index++) {
            window.APP.MODEL.UI_ALPHABET_LIST.push(new window.APP.VIEW.createBalloon(alphabetList[index]));
        }
    };

    window.APP.CONTROLLER.alphabetEnter = function (event) {

        // Ignore back button press effect
        if (event.keyCode === 8 || event.keyCode === 46) {
            return;
        }

        var secretWord = window.APP.MODEL.CURRENT_WORD;
        var removedAlphabetText = window.APP.MODEL.RESULT_WORD = removedAlphabetEle.val().toUpperCase();
        var lastAlphabetTyped = removedAlphabetText[removedAlphabetText.length - 1];
        var remainingWord = removedAlphabetText.length - 1 > 0 ? removedAlphabetText.substr(0, removedAlphabetText.length - 1) : '';

        // No unwanted word pls :)
        if (secretWord.indexOf(lastAlphabetTyped) < 0) {
            removedAlphabetEle.val(remainingWord);
            return;
        }

        var index;
        for (index = 0; index < window.APP.MODEL.UI_ALPHABET_LIST.length; index++) {
            if (lastAlphabetTyped.toUpperCase() === window.APP.MODEL.UI_ALPHABET_LIST[index].alphabet.toUpperCase()) {
                window.APP.MODEL.UI_ALPHABET_LIST[index].remove();
                window.APP.MODEL.UI_ALPHABET_LIST[index].showPopUp();
                break;
            }
        }
        window.APP.MODEL.UI_ALPHABET_LIST.splice(index, 1);
        window.APP.VIEW.createBalloon.prototype.showPopUp();
    };
    txtRemovedAlphabet.addEventListener('keyup', window.APP.CONTROLLER.alphabetEnter);

    window.APP.CONTROLLER.alphabetBeforeEnter = function (event) {
        if (event.keyCode === 8 || event.keyCode === 46) {
            var secretWord = window.APP.MODEL.CURRENT_WORD;
            var removedAlphabetText = window.APP.MODEL.RESULT_WORD = removedAlphabetEle.val().toUpperCase();
            var lastAlphabetTyped = removedAlphabetText.length - 1 >= 0 ? removedAlphabetText[removedAlphabetText.length - 1].toUpperCase() : '';
            var remainingWord = removedAlphabetText.length - 1 >= 0 ? removedAlphabetText.substr(0, removedAlphabetText.length - 1) : lastAlphabetTyped;

            // Check If Balloon creating is required
            var secretWordObjCount = window.UTIL.wordCount(secretWord.toUpperCase());
            var remainingWordObjCount = window.UTIL.wordCount(remainingWord.toUpperCase());
            if ((lastAlphabetTyped && secretWordObjCount[lastAlphabetTyped] > remainingWordObjCount[lastAlphabetTyped]) ||
                (lastAlphabetTyped && !remainingWordObjCount[lastAlphabetTyped] )) {
                // If yes then create Balloon
                window.APP.MODEL.UI_ALPHABET_LIST.push(new window.APP.VIEW.createBalloon(lastAlphabetTyped));
            }
        }
    };
    txtRemovedAlphabet.addEventListener('keydown', window.APP.CONTROLLER.alphabetBeforeEnter);


    // Loading JSON
    $.getJSON('js/words.json', function (words) {
        window.APP.MODEL.WORD_LIST = words.words;

        window.APP.CONTROLLER.init();
    });

}

