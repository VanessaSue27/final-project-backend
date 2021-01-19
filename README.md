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

# POST /baby-profiles/new-baby-profile/:userId
Endpoint to create a new Baby Profile.
Restricted endpoint: only available after a user has successfully signed up. The user's ID must be included in the POST request URL. In order for it to be validated, this endpoint expects the user's valid access token included in the POST request's Authorization header.
The POST request done in the Frontend must include in the body: babyName, dateOfBirth, timeOfBirth, gestationalAge, weight and length values.

# POST /daily-entries/new-daily-entry/:userId
Endpoint to create a new Daily Entry
This endpoint is also restricted, follow instructions explained above.
The user's ID must be included in the POST request URL.
The POST request done in the Frontend must include in the body: dailyActivities, dailyWeight and dailyReflection values.

# GET /daily-entries/:userId/latest

** WRITE DESCRIPTION FOR THIS ENDPOINT **
Endpoint to show the last 5 daily entries for a specific baby.

# GET /baby-profiles/baby/:userId

** WRITE DESCRIPTION FOR THIS ENDPOINT **
Endpoint to show the baby details (BabyProfile data) for a specific baby.

## View it Live

Link to deployed serve in Heroku.
