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
    let $avatar = $("<img>",
      {
        class: "avatar",
        src: tweet.user.avatars.small
      });
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
      $('#tweets-container').append(createTweetElement(tweet));
    });
  }

  // Fake data taken from tweets.json
  var data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];

  renderTweets(data);
});