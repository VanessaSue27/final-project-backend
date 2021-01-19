# Architecture for this API

For our Baby Time Capsule Project we are working with a RESTful API built with Express on Node.js. We are storing our data in a Mongo Database.
Server deployed to Heroku and MongoDB store in the cloud in Atlas.

We work with 3 main collections in our database: User, BabyProfile and DailyEntry.
We have connected the collections by creating a relation to the User model, so for example each DailyEntry entry includes an entryBy property, which lists
the ID of the user who authored this entry.

We have implemented validation where possible on each of our models, in order to control that the data stored in our database is clean and proper.

## CORE ROUTES - Documentation

# Base URL: include here URL for deployed Heroku app

# GET /
Home Page, shows a list of our endpoints.

# POST /users
Registration endpoint: create a new user (Sign Up) This endpoint expects a name and password in the client's POST request body in order to create a new User in the database.

# POST /sessions
Login endpoint: login for already existing users This endpoint expects a username and password in the client's POST request in order to authenticate an already existing User.

# POST /profiles/new-profile/:userId
Endpoint to create a new Baby Profile.
Restricted endpoint: only available after a user has successfully signed up. The user's ID must be included in the POST request URL. In order for it to be validated, this endpoint expects the user's valid access token included in the POST request's Authorization header.
The POST request done in the Frontend must include in the body: babyName, dateOfBirth, timeOfBirth, gestationalAge, weight and length values.

# POST /entries/new-entry/:userId
Endpoint to create a new Daily Entry
This endpoint is also restricted, follow instructions explained above.
The user's ID must be included in the POST request URL.
The POST request done in the Frontend must include in the body: dailyActivities, dailyWeight and dailyReflection values.

# GET /entries/:userId/latest
Endpoint to show the last 5 daily entries for a specific baby.
Restricted endpoint, follow the instructions explained above.
We use the userID to get the latest 5 daily entries for that specific user.

# GET /profiles/:userId
Endpoint to show the baby details (BabyProfile data) for a specific baby.
Restricted endpoint, follow the instructions explained above.

# DELETE /entries/:entryId
Endpoint to delete a specific entry.
Restricted endpoint, follow the instructions explained above.
It takes the ID from the entry the user wants to delete and removes it from the database.

## View it Live

Link to deployed serve in Heroku.
