
$(document).ready(function() {
    var socket = io.connect('http://localhost');
    socket.on('buttonState', function(stateObject) {
        triggerAnswer(stateObject);
    });
    var restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", function() {
        $("#restartButton").css({"borderWidth": "3px"});
        window.location = "/";
    });
});


function triggerAnswer(stateObject) {
    
    var options = [19, 6, 5, 13, 26];
    var found = false;
    for (var i = 0; i < options.length; i++) {
        if (options[i] == stateObject["pin"]) {
            found = true;
            if (stateObject["state"] > 0) {
                $("#restartButton").css({"borderWidth": "3px"});
                window.location = "/";
            }
            break;
        }
    }
    if (!found) console.error("Unknown button pressed");
}