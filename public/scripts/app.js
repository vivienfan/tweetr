/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  function getDate(date) {
    let createdAt = new Date(date);
    let now = new Date;
    let yDiff  = now.getFullYear() - createdAt.getFullYear();
    if (yDiff > 0) {
      return `${yDiff} years ago`;
    }
    let monDiff = now.getMonth() - createdAt.getMonth();
    if (monDiff > 0) {
      return `${monDiff} months ago`;
    }
    let dDiff = now.getDate() - createdAt.getDate();
    if (dDiff > 0) {
      return `${dDiff} days ago`;
    }
    let minDiff = now.getMinutes() - createdAt.getMinutes();
    if (minDiff > 0) {
      return `${minDiff} minutes ago`;
    }
    return `Just now`
  }

  function createTweetElement(tweet) {
     // header section
    let $header = $("<header>");
    let $avatar = $("<img>", { class: "avatar", src: tweet.user.avatars.small });
    let $name = $("<h2>", { class: "name" }).text(tweet.user.name);
    let $handle = $("<p>", { class: "handle" }).text(tweet.user.handle);
    $header.append($avatar);
    $header.append($name);
    $header.append($handle);

    // body section
    let $tweet = $("<p>", { class: "tweet" }).text(tweet.content.text);

    // footer section
    let $footer = $("<footer>");
    let $time = $("<p>").text(getDate(tweet.created_at));
    let $hover0 = $("<img>", { src: "https://www.teachforamerica.org/sites/default/files/styles/list_thumbnail/public/thumbnails/image/2016/07/assignment_icon.png?itok=GpRV4LEE" });
    let $hover1 = $("<img>", { src: "https://www.teachforamerica.org/sites/default/files/styles/list_thumbnail/public/thumbnails/image/2016/07/assignment_icon.png?itok=GpRV4LEE" });
    let $hover2 = $("<img>", { src: "https://www.teachforamerica.org/sites/default/files/styles/list_thumbnail/public/thumbnails/image/2016/07/assignment_icon.png?itok=GpRV4LEE" });
    $footer.append($time);
    $footer.append($hover0);
    $footer.append($hover1);
    $footer.append($hover2);

    // entire article
    let $article = $("<article>");
    $article.append($header);
    $article.append($tweet);
    $article.append($footer);

    return $article;
  }

  function renderTweets(tweets) {
    tweets.forEach((tweet) => {
      $('#tweets-container').prepend(createTweetElement(tweet));
    });
  }

  function loadTweets() {
    $.ajax({
      url: "/tweets",
      method: "GET",
      data: {get_param: 'value'},
      dataType: 'json',
      success: function (tweets) {
        renderTweets(tweets);
      }
    });
  }

  $("#submit").on("click", function(event) {
    let counter = +$(this).siblings(".counter").text();
    let limit = +$(this).closest(".new-tweet").data("limit");
    if (counter < 0 ) {
      $(this).siblings(".flashMsg").text("Content too long.");
      event.preventDefault();
      return;
    }
    if (counter === limit) {
      $(this).siblings(".flashMsg").text("No content.");
      event.preventDefault();
      return;
    }

    $.ajax({
      url: $(this).closest("form").attr('action'),
      method: $(this).closest("form").attr('method'),
      data: $(this).siblings('textarea').serialize(),
      complete: function(res) {
        if (res.status === 201) {
          console.log("loadTweets!!!");
          loadTweets();
        }
      }
    });
    event.preventDefault();
  });


  loadTweets();
});