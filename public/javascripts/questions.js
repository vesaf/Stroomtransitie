$(document).ready(function() {
    var Qno = window.location.hash.substring(4);
    console.log(Qno);
    jQuery.ajax({
        type: "GET",
        url: "/quiz/single",
        data: {Qno: Qno},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, status, jqXHR) {
            var timer = setTimer();
            // TODO: When buttons, need different event
            document.addEventListener("mousemove", function() {
                clearTimeout(timer);
                timer = setTimer();
            });
            console.log(typeof(data) == "object");
            $("#question").html("<p id=questionText>Vraag: " + data.Question + "</p>");
            var answerKeys = Object.keys(data.Answers)
            var list = "";
            for (var i = 0; i < answerKeys.length; i++) {
                list += "<li class='answerText' id=answer" + answerKeys[i] + ">" + data["Answers"][answerKeys[i]]["Answer"] + "</li>";
            }
            $("#answers").html("<ul>Keuzes:" + list + "</ul>");
            document.addEventListener("click", function(e) {
                if (e.target.id.substring(0, 6) == "answer") {
                    var answerId = e.target.id.substring(6);
                    $("#answer" + answerId).css({"borderWidth": "3px"});
                    
                    var nextQ = data["Answers"][answerId]["Goto"];

                    jQuery.ajax({
                        type: "POST",
                        url: "/quiz/send",
                        data: JSON.stringify({
                            Score: data["Answers"][answerId]["Score"],
                            Answer: answerId,
                            Question: Qno
                        }),
                        success: function(data, status, jqXHR) {
                            console.log("succes");
                            window.location = "/quiz#no=" + nextQ;
                            location.reload();
                        },
                        error: function() {
                            console.error("Could not send question");
                        }
                    });
                }
            });

        },
        error: function() {
            window.location = "/quiz/result";
        }
    });
});

function setTimer() {
    return timer = setTimeout(function() {
        jQuery.ajax({
            type: "POST",
            url: "/quiz/reset",
            success: function(data, status, jqXHR) {
                window.location = "/";
            },
            error: function() {
                console.error("Could not reset quiz");
            }
        });
    }, 120000);
}