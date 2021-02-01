# Architecture for this API

For our _Time Capsule_ Project we are working with a __RESTful API__ built with _Express_ on _Node.js_. We are storing our data in a Mongo Database.
Server deployed to _Heroku_ and _MongoDB_ store in the cloud in _Atlas_.

We work with 3 main collections in our database: __User__, __BabyProfile__ and __DailyEntry__.
We have connected the collections by creating a relation to the User model, so for example each DailyEntry entry includes an entryBy property, which lists
the ID of the user who authored this entry.

We have implemented validation where possible on each of our models, in order to control that the data stored in our database is clean and proper.
Project developed by Sofia Vaz Sousa & Vanessa Sue Smith

## CORE ROUTES - Documentation
Restricted endpoints, these should can only be accessed after they have signed up or logged in. In order for it to be validated, these endpoints expect the user's valid access token included in the POST request's authorization header.
# Base URL
https://time-capsule-final.herokuapp.com/
# GET /
Home Page, shows a list of the endpoints.

# GET /entries/latest
_Restricted endpoint_: Endpoint to show the last 5 daily entries for a specific baby.

# GET /profiles
_Restricted endpoint_: Endpoint to show the baby details (BabyProfile data) for a specific baby.

# POST /users
_Registration endpoint_: creates a new user (Sign Up) This endpoint expects a name and password in the client's POST request body in order to create a new User in the database.

# POST /sessions
_Login endpoint_: login for an already existing user. This endpoint expects a username and password in the client's POST request in order to authenticate an already existing User.

# POST /profiles
_Restricted endpoint_: Endpoint to create a new Baby Profile.
The POST request done in the Frontend must include in the body: babyName, dateOfBirth, timeOfBirth, gestationalAge, sex, weight and length values.

# POST /entries
_Restricted endpoint_: Endpoint to create a new Daily Entry.
The POST request done in the Frontend must include in the body: dailyActivities, dailyWeight and dailyReflection values.

# POST /profile/image
_Restricted endpoint_: Endpoint to add a personalised profile picture.
The POST request done in the Frontend must include multipart form data for image handling.

# DELETE /entries/:entryId
_Restricted endpoint_: Endpoint to delete a specific entry.
It takes the ID from the entry the user wants to delete and removes it from the database.

# PATCH /entries/:entryId
_Restricted endpoint_: Endpoint to edit a specific daily entry.
It takes the entry ID from the entry the user wants to update, included in the request URL and updates it.


