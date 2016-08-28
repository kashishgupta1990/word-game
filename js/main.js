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
    }
};

jQuery(document).ready(init);

function init() {
    var removedAlphabetEle = $('#removedAlphabet');
    var answerEle = $('#answer');

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
        var flag;
        if (window.APP.MODEL.CURRENT_WORD.length === window.APP.MODEL.RESULT_WORD.length) {
            if (window.APP.MODEL.CURRENT_WORD === window.APP.MODEL.RESULT_WORD) {
                flag = confirm('Good Job!, Do you want new word');
                if (flag) {
                    window.APP.CONTROLLER.fetchNewWork();
                } else {
                    alert('Thanks for playing!');
                    window.APP.CONTROLLER.init();
                }
            } else {
                flag = confirm('Opps! Wrong Answer, Want to try again ?');
                if (flag) {
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
        window.APP.MODEL.WORD_LIST = ['AMAN', 'KASHISH', 'SHUBHAM', 'REENA'];
        window.APP.MODEL.CURRENT_WORD = '';
        window.APP.MODEL.RESULT_WORD = '';
        window.APP.MODEL.ALPHABET_LIST = [];
        window.APP.MODEL.UI_ALPHABET_LIST = [];

        window.APP.CONTROLLER.fetchNewWork();
    };

    window.APP.CONTROLLER.fetchNewWork = function () {
        var wordList = window.APP.MODEL.WORD_LIST;
        window.APP.MODEL.RESULT_WORD = '';
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

        window.APP.MODEL.ALPHABET_LIST = currentWord = window.APP.CONTROLLER.wordToShuffleAlphabetArray(currentWord);

        window.APP.CONTROLLER.renderWord(currentWord);
        return currentWord;
    };

    window.APP.CONTROLLER.renderWord = function (alphabetList) {
        window.APP.MODEL.ALPHABET_LIST = alphabetList = window.UTIL.shuffle(alphabetList);
        window.APP.MODEL.RESULT_WORD = '';
        if (window.APP.MODEL.UI_ALPHABET_LIST.length > 0) {
            var tmp;
            for (var index = 0; index < window.APP.MODEL.UI_ALPHABET_LIST.length; index++) {
                tmp = window.APP.MODEL.UI_ALPHABET_LIST[index];
                tmp.remove();
            }
        }
        window.APP.MODEL.UI_ALPHABET_LIST = [];
        for (var index = 0; index < alphabetList.length; index++) {
            window.APP.MODEL.UI_ALPHABET_LIST.push(new window.APP.VIEW.createBalloon(alphabetList[index]));
        }
    };

    window.APP.CONTROLLER.alphabetEnter = function () {
        var removedAlphabetText = removedAlphabetEle.val();
        var lastAlphabetTyped = removedAlphabetText[removedAlphabetText.length - 1];
        var index;
        for (index = 0; index < window.APP.MODEL.UI_ALPHABET_LIST.length; index++) {
            if(lastAlphabetTyped.toUpperCase() === window.APP.MODEL.UI_ALPHABET_LIST[index].alphabet.toUpperCase()){
                window.APP.MODEL.UI_ALPHABET_LIST[index].remove();
                window.APP.MODEL.UI_ALPHABET_LIST[index].showPopUp();
                break;
            }
        }
        window.APP.MODEL.UI_ALPHABET_LIST.splice(index, 1);
    };

    window.APP.CONTROLLER.init();
}