$(document).ready(function() {
  // Event listener:
  // targer: .new-tweet textarea
  // event: on keyup
  $(".new-tweet textarea").on("keyup", function(event) {
    // clear the flash message when user changed the tweet content
    $(this).siblings(".flashMsg").text("");

    // update the counter as user changes the tweet content
    var limit = +$(this).closest(".new-tweet").data("limit");
    var length = $(this).val().length;
    var remain = limit - length;
    var counter = $(this).closest(".new-tweet").find(".counter");
    counter.text(remain);

    // if the content is too long, change the color to red
    // else change the color to default;
    if (remain < 0) {
      counter.css("color", "red");
    } else {
      counter.css("color", "#244751");
    }
  });
});