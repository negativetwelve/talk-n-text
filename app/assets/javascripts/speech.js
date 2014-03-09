$(document).ready(function() {
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true; // speech pause stops recording
        recognition.interimResults = true; //access to interim text
        recognition.lang = "en";

        var textbox = $('#test');

        recognition.start();

        recognition.onstart=function(event) {
            console.log("on start");
            console.log(event);

            //var pos = textArea.getCursorPosition() - interimResult.length;
            }
        /* the input */
        recognition.onresult = function (event) {
            var results = event.results;
            console.log(results);
            for (var i=0; i < results.length; i++) {
                var word = results[i][0].transcript;
                console.log(results[i][0].transcript);
                textbox.val(word);
            }
        }
        



        recognition.stop();
    }
});
