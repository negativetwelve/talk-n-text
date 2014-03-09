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
            console.log("entered result");
            var results = event.results;
            var final_tran = "";
            var interim_tran = "";
            //var define_func = ["define", "a", "function"];
            var define_func = "define a function";
            var args = ["that", "takes", "in"]; 
            var define = false;
            for (var i=event.resultIndex; i < results.length; i++) {
                var curr_word_obj = event.results[i];
                if (curr_word_obj.isFinal) {
                    var curr_word = curr_word_obj[0].transcript;
                

                    console.log("curr_word: " + curr_word + "\n");

                    if (curr_word == define_func) {
                        define = true;
                        editor.insert("def ");
                        console.log("curr_word(in def): " + curr_word);
                    }
                    if (define) { 
                        
                    }

                    //final_tran += curr_word; 
                }

                    
            }
        } 



        recognition.stop();
    }
});
