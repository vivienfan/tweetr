$(document).ready(function() {
  $(".new-tweet form textarea").on("keyup", function(event) {
    $(this).siblings(".flashMsg").text("");
    var limit = +$(this).closest(".new-tweet").data("limit");
    var length = $(this).val().length;
    var remain = limit - length;
    var counter = $(this).closest(".new-tweet").find(".counter");
    counter.text(remain);
    if (remain < 0) {
      counter.css("color", "red");
    } else {
      counter.css("color", "#244751");
    }
  });
});