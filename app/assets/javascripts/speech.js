if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else{
    var recognition - new webkitSpeechRecognition();
    recognition.continuous = true; // speech pause stops recording
    recognition.interimResults = true; //access to interim text
    recognition.lang = "en";

    var input = document.getElementById('textbox');

    recognition.onstart=function(event) {
        var pos = textArea.getCursorPosition() - interimResult.length;
        var final_transcript = '';
        recognition.start();
        

    }
    /* the input */
    var main=startInput();
    recognition.onresult = function (event) {

    }
    



    recognition.stop();
