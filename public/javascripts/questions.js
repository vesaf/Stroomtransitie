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
            console.log(typeof(data) == "object");
            $("#question").html("<p>" + data.Question + "</p>");
            var answerKeys = Object.keys(data.Answers)
            var list = "";
            for (var i = 0; i < answerKeys.length; i++) {
                list += "<li id=answer" + answerKeys[i] + ">" + data["Answers"][answerKeys[i]]["Answer"] + "</li>";
            }
            $("#answers").html("<ul>" + list + "</ul>");
            document.addEventListener("click", function(e) {
                console.log(e.target.id.substring(0, 6));
                if (e.target.id.substring(0, 6) == "answer") {
                    var answerId = e.target.id.substring(6);
                    var nextQ = data["Answers"][answerId]["Goto"];
                    console.log(data["Answers"][answerId]["Score"]);

                    jQuery.ajax({
                        type: "POST",
                        url: "/quiz/send",
                        data: JSON.stringify({Score: data["Answers"][answerId]["Score"]}),
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