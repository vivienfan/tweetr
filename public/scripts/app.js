/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  var HANDLE;
  var USERNAME;
  var AVATAR;

/*------------------------------ Functions ------------------------------*/

  // This helper function checks the created time of the tweet,
  // and to return the appropriate message in the form "{#} {unit} ago"
  // input: date in milliseconds since 1970
  // output: string, "{#} {unit} ago"
  function getDate(date) {
    var createdAt = new Date(date);
    var now = new Date();

    // find the difference in year,
    // if more than 1, return unit in years
    var yDiff  = now.getFullYear() - createdAt.getFullYear();
    if (yDiff > 0) {
      return `${yDiff} years ago`;
    }

    // find the difference in month,
    // if more than 1, return unit in months
    var monDiff = now.getMonth() - createdAt.getMonth();
    if (monDiff > 0) {
      return `${monDiff} months ago`;
    }

    // find the difference in day,
    // if more than 1, return unit in days
    var dDiff = now.getDate() - createdAt.getDate();
    if (dDiff > 0) {
      return `${dDiff} days ago`;
    }

    // find the difference in hours,
    // if more than 1, return unit in hours
    var hDiff = now.getHours() - createdAt.getHours();
    if (hDiff > 0) {
      return `${hDiff} hours ago`;
    }

    // find the difference in minutes,
    // if more than 1, return unit in minutes
    var minDiff = now.getMinutes() - createdAt.getMinutes();
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
    var $header = $("<header>");
    var $avatar = $("<img>", { class: "avatar", src: tweet.user.avatars.small });
    var $name = $("<h2>", { class: "name" }).text(tweet.user.name);
    var $handle = $("<p>", { class: "handle" }).text(tweet.user.handle);
    $header.append($avatar, $name, $handle);

    // body section
    var $tweet = $("<div>", { class: "tweet" }).text(tweet.content.text);

    // footer section
    var $footer = $("<footer>");
    var $time = $("<span>").text(getDate(tweet.created_at));
    var $div = $("<div>", { class: "footer-div" });
    var $count = $("<span>", { class: "like-count" }).text(tweet.likes.length);
    var $like = $("<img>", { class: "like-tweet clickable hide" });
    var $span = $("<span>", { class: "like-text" }).text("likes");
    // allows like button once user is logged in
    if (HANDLE && tweet.user.handle !== HANDLE) {
      $like.removeClass("hide");
      $span.addClass("hide");
      // diaplay "liked" and "not-liked" image for the button
      if (tweet.likes.includes(HANDLE)) {
        $like.attr("src", "/images/heart.png");
      } else {
        $like.attr("src", "/images/heart-outline.png");
      }
    }
    $div.append($count, $span, $like);
    $footer.append($time, $div);

    // entire article
    var $article = $("<article>");
    $article.attr("data-tid", tweet._id);
    $article.attr("data-uid", HANDLE);
    $article.append($header, $tweet, $footer);
    return $article;
  }

  function clearTweets(){
    $("#tweets-container").empty();
  }

  // This function renders all the tweet posts given
  // in descending order according to their created time, lastest at the top
  // input: tweets - sorted array (ascending according to created time)
  // output: none
  function renderTweets(tweets) {
    tweets.forEach(function(tweet) {
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
      data: { getUserInfo: HANDLE },
      dataType: 'json',
      success: function (res) {
        if(res.userInfo) {
          // on refresh, if the user cookie exists,
          // server sends back the info, client displays accordingly
          USERNAME = res.userInfo.name;
          HANDLE = res.userInfo.handle;
          AVATAR = res.userInfo.avatar;
          displayLogin();
        }
        // console.log(res.tweets);
        if (option === 1) {
          // to only prepend the lastest tweet post
          // since ascending, last element is therefore the lastest
          renderTweets([res.tweets.pop()]);
        } else {
          // on page load/refresh, render all tweets
          renderTweets(res.tweets);
        }
      }
    });
  }

  // This function is to clear the textarea,
  // called after sucessfully post a new tweet
  // input: none
  // output: none
  function refreshTextarea() {
    var limit = $(".new-tweet").data("limit");
    $(".new-tweet textarea").val("");
    $(".new-tweet .counter").text(limit);
  }

  function checkRegParams(fname, lname, username, email, password) {
    var pass = true;
    if (!fname) {
      $("#r_fn_miss").removeClass("hide");
      pass = false;
    }
    if (!lname) {
      $("#r_ln_miss").removeClass("hide");
      pass = false;
    }
    if (!username) {
      $("#r_un_miss").removeClass("hide");
      pass = false;
    }
    if (!email) {
      $("#r_e_miss").removeClass("hide");
      pass = false;
    }
    if (!password) {
      $("#r_p_miss").removeClass("hide");
      pass = false;
    }
    return pass;
  }

  function checkLogParams(key, password) {
    var pass = true;
    if (!key) {
      $("#l_eu_miss").removeClass("hide");
      pass = false;
    }
    if (!password) {
      $("#l_p_miss").removeClass("hide");
      pass = false;
    }

    return pass;
  }

  function clearRegAsterisk() {
    $("#r_fn_miss").addClass("hide");
    $("#r_ln_miss").addClass("hide");
    $("#r_un_miss").addClass("hide");
    $("#r_e_miss").addClass("hide");
    $("#r_p_miss").addClass("hide");
    $("#r_email_err").addClass("hide");
    $("#r_uname_err").addClass("hide");
  }

  function clearRegMsg() {
    $("#r_email_err").addClass("hide");
    $("#r_uname_err").addClass("hide");
  }

  function clearRegVal() {
    $("#r_fname").val("");
    $("#r_lname").val("");
    $("#r_username").val("");
    $("#r_email").val("");
    $("#r_password").val("");
  }

  function clearLogAsterisk() {
    $("#l_eu_miss").addClass("hide");
    $("#l_p_miss").addClass("hide");
  }

  function clearLogMsg() {
      $("#l_err").addClass("hide");
  }

  function clearLogVal() {
    $("#l_eu").val("");
    $("#l_password").val("");
  }

  function displayLogin(){
    // disappear
    $("#logged-menu").slideUp();
    $("#show-register").addClass("hide");
    $("#show-login").addClass("hide");
    // show
    $("#user-handle").text(HANDLE);
    $("#user-handle").removeClass("hide");
    $("#m_avatar").attr("src", AVATAR);
    $("#img-dropdown").removeClass("hide");
    $("#compose").css("display", "block");
    $("#tweets-container").find(".like-tweet").removeClass("hide");
  }

  function displayLogout() {
    // disappear
    $("#user-handle").text(HANDLE);
    $("#user-handle").addClass("hide");
    $("#img-dropdown").addClass("hide");
    $("#compose").css("display", "none");
    $(".new-tweet").slideUp();
    $("#tweets-container").find(".like-tweet").addClass("hide");
    // show
    $("#show-register").removeClass("hide");
    $("#show-login").removeClass("hide");
    $("#tweets-container").find(".like-text").removeClass("hide");
  }


/*------------------------------ Event Handlers ------------------------------*/

  // Send a ajax post request after passing validation check
  // target: #submit (button)
  // event: on click
  $("#submit").on("click", function(event) {
    // overriding the html form tag behaviour
    event.preventDefault();

    // check if the tweet content is empty, or exceeded the limit
    // if error, display flash message and return
    var counter = +$(this).siblings(".counter").text();
    var limit = +$(this).closest(".new-tweet").data("limit");
    if (counter < 0 ) {
      $(this).siblings(".flashMsg").text("Content too long.");
        return;
    }
    if (counter === limit) {
      $(this).siblings(".flashMsg").text("No content.");
        return;
    }

    // send a ajax request, replacing the request from original html form
    // clear the textarea and load the new tweet on sucess
    $.ajax({
      url: $(this).closest("form").attr('action'),
      method: $(this).closest("form").attr('method'),
      data: {
        name: USERNAME,
        handle: HANDLE,
        avatar: AVATAR,
        content: $(this).parent().siblings("textarea").val()
      },
      dataType: "json",
      compvare: function() {
        refreshTextarea();
        loadTweets(1);
      }
    });
  });

  // Slide toggle the new-tweet section, and give focus on the textarea
  // targer: #compose (button)
  // event: on click
  $("#compose").on("click", function() {
    $(".new-tweet").slideToggle();
    $(".new-tweet textarea").focus();
  })

  // Change textarea's border color and shadow
  // targer: .new-tweet textarea
  // event: on focus
  $(".new-tweet").on("focus", "textarea", function() {
    $(this).addClass("highlight");
  })

  // Undo textare focus effect
  // targer: .new-tweet textare
  // event: on blur
  $(".new-tweet").on("blur", "textarea", function() {
    $(this).removeClass("highlight");
  })

  $("#tweets-container").on("click", ".like-tweet", function(event) {
    // send a ajax request, replacing the request from original html form
    // highlight or undo highlight on sucess
    var tid = $(this).closest("article").data("tid");
    $.ajax({
      url: `/tweets/${tid}/${HANDLE}`,
      method: "POST",
      data: { id: tid, option: HANDLE },
      dataType: "json",
      success: function(like) {
        var prev = +$(event.target).siblings(".like-count").text();
        // if the action is a like, display a heart, increament counter
        // else, display a heart outline, decreament counter
        if (like) {
          $(event.target).attr("src", "/images/heart.png");
          $(event.target).siblings(".like-count").text(prev + 1);
        } else {
          $(event.target).attr("src", "/images/heart-outline.png");
          $(event.target).siblings(".like-count").text(prev - 1);
        }
      }
    });
  });

  $("#m_avatar").on("click", function() {
    $("#logged-menu").slideToggle();
  });

  $("#show-login").on("click", function() {
    $("#login-modal").removeClass("hide");
  });

  $("#show-register").on("click", function() {
    $("#register-modal").removeClass("hide");
  });

  $(".close").on("click", function(event) {
    $(event.target).closest(".modal").addClass("hide");
  });

  $("#register").on("click", function(event) {
    clearRegMsg();
    clearRegAsterisk();

    var fname = $(this).siblings("#r_fname").val();
    var lname = $(this).siblings("#r_lname").val();
    var username = $(this).siblings("#r_username").val().toLowerCase();
    var email = $(this).siblings("#r_email").val().toLowerCase();
    var password = $(this).siblings("#r_password").val();

    // check if the inputs are missing,
    // if so, return straight the way, do not send the request
    if (!checkRegParams(fname, lname, username, email, password)) {
      return;
    }

    $.ajax({
      url: "/register",
      method: "POST",
      data: {
        fname: fname,
        lname: lname,
        username: username,
        email: email,
        password: password
      },
      dataType: "json",
      error: function(request, status, err) {
        // if the email or username already registered,
        // display error message accordingly
        if (!$.parseJSON(request.responseText).emailOk){
          $("#r_email_err").removeClass("hide");
        }
        if (!$.parseJSON(request.responseText).usernameOk) {
          $("#r_uname_err").removeClass("hide");
        }
      },
      success: function(res) {
        // clear all the input field, close the modal dialog
        // store and update user info
        // display logged in nav, and reload tweets
        clearRegVal();
        $(event.target).closest(".modal").addClass("hide");
        HANDLE = res.handle;
        AVATAR = res.avatar;
        USERNAME = res.name;
        displayLogin();
        clearTweets();
        loadTweets();
      }
    });
  });

  $("#login").on("click", function(event) {
    clearLogMsg();
    clearLogAsterisk();

    var key = $(this).siblings("#l_eu").val().toLowerCase();
    var password = $(this).siblings("#l_password").val();
    console.log(key);

    // check if the inputs are missing,
    // if so, return straight the way, do not send the request
    if (!checkLogParams(key, password)) {
      return;
    }

    $.ajax({
      url: "/login",
      method: "POST",
      data: {key: key, password: password},
      dataType: "json",
      error: function() {
        // if the email/username and password does not match,
        // display error message accordingly
        $("#l_err").removeClass("hide");
      },
      success: function(res) {
        // on success, clear all the user input, close the modal window
        // update user info into global varaibale
        // change nav bar, and reload the tweets, shows like button
        clearLogVal();
        $(event.target).closest(".modal").addClass("hide");
        HANDLE = res.handle;
        AVATAR = res.avatar;
        USERNAME = res.name;
        displayLogin();
        clearTweets();
        loadTweets();
      }
    });
  });

  $("#logout").on("click", function() {
    $.ajax({
      url: "/logout",
      method: "POST",
      success: function() {
        // on success, clear all user info
        // change nav bar
        HANDLE = null;
        AVATAR = null;
        USERNAME = null;
        displayLogout();
      }
    });
  });

  // $("#settings").on("click", function() {
  //   $.ajax({
  //     url: "/settings",
  //     method: "PUT",
  //     data: ,
  //     dataType: ,
  //     compvare: function() {

  //     }
  //   });
  // });


/*------------------------------ Page Initialization ------------------------------*/
  loadTweets();   // loadTweets updates user info too

  if (!HANDLE) {
    displayLogout();
  } else {
    displayLogin();
  }
});