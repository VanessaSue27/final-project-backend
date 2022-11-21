# Time Capsule Backend 🚀 - Architecture for this API

**"Time Capsule"** is a student project developed by <a href="https://sofiavazs.netlify.app/">Sofia Vaz Sousa</a> and <a href="https://vanessa-portfolio.netlify.app/">Vanessa Sue Smith</a>.

**Read more about Time Capsule here:** https://time-capsule-final.netlify.app/about

For our _Time Capsule_ Backend we are working with a __RESTful API__ built with _Express_ on _Node.js_. We are storing our data in a Mongo Database structured with mongoose.
~~Server deployed to _Heroku_~~ and _MongoDB_ stored in _Atlas_.

**⚠ UPDATE:** Unfortunately, due to the removal of Heroku's free dynos, we had to shut this server down 💔 So the server is momentarily not deployed, and the app is only partially functional.

We work with 3 main collections in our database: __User__, __BabyProfile__ and __DailyEntry__.
We have connected the collections by creating a relation to the User model, so for example each DailyEntry entry includes an entryBy property, which lists
the ID of the user who authored this entry.

We have implemented validation where possible on each of our models, in order to control that the data stored in our database is clean and proper ✨

## Frontend - See it in Action 💥

You can find the Time Capsule Frontend repository here, where we have put this API to the test 💪: https://github.com/VanessaSue27/final-project-frontend

And a deployed LIVE version of it here: https://time-capsule-final.netlify.app/

## CORE ROUTES - Documentation ⭐
_Restricted endpoints_ : These can only be accessed after the user has successfully signed up or logged in. In order for it to be validated, these endpoints expect the user's valid access token included in the POST request's authorization header.
### Base URL 👶
~~https://time-capsule-final.herokuapp.com/~~
### GET /
Home Page, shows a list of the endpoints.

### GET /entries/latest
_Restricted endpoint_: Endpoint to show the last 5 daily entries for a specific baby.

### GET /profiles
_Restricted endpoint_: Endpoint to show the baby details (BabyProfile data) for a specific baby.

### POST /users
_Registration endpoint_: creates a new user (Sign Up) This endpoint expects a name and password in the client's POST request body in order to create a new User in the database.

### POST /sessions
_Login endpoint_: login for an already existing user. This endpoint expects a username and password in the client's POST request in order to authenticate an already existing User.

### POST /profiles
_Restricted endpoint_: Endpoint to create a new Baby Profile.
The POST request done in the Frontend must include in the body: babyName, dateOfBirth, timeOfBirth, gestationalAge, sex, weight and length values.

### POST /entries
_Restricted endpoint_: Endpoint to create a new Daily Entry.
The POST request done in the Frontend must include in the body: dailyActivities, dailyWeight and dailyReflection values.

### POST /profile/image
_Restricted endpoint_: Endpoint to add a personalised profile picture.
The POST request done in the Frontend must include multipart form data for image handling.

### DELETE /entries/:entryId
_Restricted endpoint_: Endpoint to delete a specific entry.
It takes the ID from the entry the user wants to delete and removes it from the database.

### PATCH /entries/:entryId
_Restricted endpoint_: Endpoint to edit a specific daily entry.
It takes the entry ID from the entry the user wants to update, included in the request URL and updates it.
The PATCH request done in the Frontend must include in the body: dailyActivities, dailyWeight, dailyReflection.


