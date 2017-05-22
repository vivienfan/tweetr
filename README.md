# Tweetr Project

Tweetr is a simple, single-page Twitter clone.

This repository is the starter code for the project: Students will fork and clone this repository, then build upon it to practice their HTML, CSS, SCSS, JS, jQuery and AJAX front-end skills, and their Node, Express and MongoDB back-end skills.

## Final Product
!["main"](https://github.com/vivienfan/tweetr/blob/master/document/main.png?raw=true)

When a user is logged-in, the user can compose a new tweet, like or unlike a tweet posted by other tweeter. When a user clicks on their avatar, a drop-down menu shows more options.

!["main(logged-out)"](https://github.com/vivienfan/tweetr/blob/master/document/main(logged-out).png?raw=true)

When a user is logged out, the user can only read tweets, register or login.

!["modal-view"](https://github.com/vivienfan/tweetr/blob/master/document/modal-view.png?raw=true)

Register and login form uses modal view on the same page.

!["error-registration"](https://github.com/vivienfan/tweetr/blob/master/document/error-registration.png?raw=true)

On registration, the server does error checkings for duplicated email and username, gaurantees the uniqueness.

!["error-login"](https://github.com/vivienfan/tweetr/blob/master/document/error-login.png?raw=true)

On login, user can login use either the email or the username they registered with. The server then checks if the pair matches with the database.


!["medium-screen"](https://github.com/vivienfan/tweetr/blob/master/document/medium-screen.png?raw=true) !["small-screen"](https://github.com/vivienfan/tweetr/blob/master/document/small-screen.png?raw=true)

Responsive deisgn, allows different looks on different sizes of devices.

## How To Run Locally

1. Define MONGODB_URL in .env file to indicate the url for the mongoDB database that you are using.
    e.g. MONGODB = mongodb://localhost:27017/tweeter

2. Run one of the following command in the terminal to start the server:
  - npm start
  - npm run local

3. Open browser, and go to http://localhost:8080/

## Dependencies

- Express
- Node 5.10.x or above
- bcypt
- body-parser
- cookie-session
- dotenv
- md5
- mongodb
- morgan
- node-sass
- node-sass-middleware
