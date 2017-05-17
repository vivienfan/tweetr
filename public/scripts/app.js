/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  // This helper function checks the created time of the tweet,
  // and to return the appropriate message in the form "{#} {unit} ago"
  // input: date in milliseconds since 1970
  // output: string, "{#} {unit} ago"
  function getDate(date) {
    let createdAt = new Date(date);
    let now = new Date();

    // find the difference in year,
    // if more than 1, return unit in years
    let yDiff  = now.getFullYear() - createdAt.getFullYear();
    if (yDiff > 0) {
      return `${yDiff} years ago`;
    }

    // find the difference in month,
    // if more than 1, return unit in months
    let monDiff = now.getMonth() - createdAt.getMonth();
    if (monDiff > 0) {
      return `${monDiff} months ago`;
    }

    // find the difference in day,
    // if more than 1, return unit in days
    let dDiff = now.getDate() - createdAt.getDate();
    if (dDiff > 0) {
      return `${dDiff} days ago`;
    }

    // find the difference in hours,
    // if more than 1, return unit in hours
    let hDiff = now.getHours() - createdAt.getHours();
    if (hDiff > 0) {
      return `${hDiff} hours ago`;
    }

    // find the difference in minutes,
    // if more than 1, return unit in minutes
    let minDiff = now.getMinutes() - createdAt.getMinutes();
    if (minDiff > 0) {
      return `${minDiff} minutes ago`;
    }

    // created in less than a minute ago
    return `Just now`;
  }

  // This function create a html article with the content of a tweet post
  // input: object - tweet
  // output: object - nested html article tag
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

  // This function renders all the tweet posts given
  // in descending order according to their created time, lastest at the top
  // input: tweets - sorted array (ascending according to created time)
  // output: none
  function renderTweets(tweets) {
    tweets.forEach((tweet) => {
      $('#tweets-container').prepend(createTweetElement(tweet));
    });
  }

  // This function creates a ajax get request to get all the tweets in db,
  // then calls renderTweets on success
  // input: option (optional) - to indicate whether is to add new tweet or refresh
  // output: none
  function loadTweets(option) {
    // This ajax request returns a sorted array of tweet objects on success
    $.ajax({
      url: "/tweets",
      method: "GET",
      data: {get_param: 'value'},
      dataType: 'json',
      success: function (tweets) {
        if (option === 1) {
          // to only prepend the lastest tweet post
          // since ascending, last element is therefore the lastest
          renderTweets([tweets.pop()]);
        } else {
          // on page load/refresh, render all tweets
          renderTweets(tweets);
        }
      }
    });
  }

  // This function is to clear the textarea,
  // called after sucessfully post a new tweet
  // input: none
  // output: none
  function refreshTextarea() {
    let limit = $(".new-tweet").data("limit");
    $(".new-tweet textarea").val("");
    $(".new-tweet .counter").text(limit);
  }

  // Event listener: send a ajax post request after passing validation check
  // target: #submit (button)
  // event: on click
  $("#submit").on("click", function(event) {
    // check if the tweet content is empty, or exceeded the limit
    // if error, display flash message and return
    let counter = +$(this).siblings(".counter").text();
    let limit = +$(this).closest(".new-tweet").data("limit");
    if (counter < 0 ) {
      $(this).siblings(".flashMsg").text("Content too long.");
    // overriding the html form tag behaviour
    event.preventDefault();
          return;
    }
    if (counter === limit) {
      $(this).siblings(".flashMsg").text("No content.");
    // overriding the html form tag behaviour
    event.preventDefault();
          return;
    }

    // send a ajax request, replacing the request from original html form
    // clear the textarea and load the new tweet on sucess
    $.ajax({
      url: $(this).closest("form").attr('action'),
      method: $(this).closest("form").attr('method'),
      data: $(this).siblings("textarea").serialize(),
      success: function() {
          refreshTextarea();
          loadTweets(1);
      }
    });
        // overriding the html form tag behaviour
    event.preventDefault();
  });

  // Event listener: slide toggle the new-tweet section, and give focus on the textarea
  // targer: #compose (button)
  // event: on click
  $("#compose").on("click", function() {
    $(".new-tweet").slideToggle();
    $(".new-tweet textarea").focus();
  })

  // Event listener: change textarea's border color and shadow
  // targer: .new-tweet textarea
  // event: on focus
  $(".new-tweet").on("focus", "textarea", function() {
    $(this).css("border-color", "#719ECE");
    $(this).css("box-shadow", "0 0 10px #719ECE");
  })

  // Event listener: undo textare focus effect
  // targer: .new-tweet textare
  // event: on blur
  $(".new-tweet").on("blur", "textarea", function() {
    $(this).css("border-color", "#eee");
    $(this).css("box-shadow", "none");
  })

  // page initialization
  loadTweets();
});