$(document).ready(function() {
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true; // speech pause stops recording
        recognition.interimResults = true; //access to interim text
        recognition.lang = "en";

        var textbox = $('#editor');

        recognition.start();

        recognition.onstart=function(event) {
            console.log("on start");

            //var pos = textArea.getCursorPosition() - interimResult.length;
            }
        /* the input */
        
        recognition.onresult = function (event) {
            var results = event.results;
            var final_tran = "";
            var interim_tran = "";
            for (var i=event.resultIndex; i < results.length; i++) {
                if (event.results[i].isFinal) {
                    final_tran += event.results[i][0].transcript;
                } else {
                    interim_tran += event.results[i][0].transcript;
                }
                var word = results[i][0].transcript;

                if (word == "hello") {
                    word = "hi";
                }
                console.log(word);
                editor.insert(final_tran);
            }
        }
        



        recognition.stop();
    }
});
