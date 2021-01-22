import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import listEndpoints from 'express-list-endpoints';

// Set up MongoDB
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/time-capsule';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Using a userSchema in order to implement validation for the password before it is hashed
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

// Mongoose models: 3 collections: User, BabyProfile and DailyEntry
// User Model
const User = mongoose.model('User', userSchema);

// BabyProfile Model
const BabyProfile = mongoose.model('BabyProfile', {
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  babyName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  timeOfBirth: {
    type: String,
    required: true
  },
  gestationalAge: {
    type: Number,
    min: 23,
    max: 50,
    required: true
  },
  sex: { 
    type: String,
    required: true
  },
  weight: {
    type: Number,
    min: 500,
    required: true
  },
  length: {
    type: Number,
    min: 10,
    max: 200,
    required: true
  }
});

// DailyEntry Model
const DailyEntry = mongoose.model('DailyEntry', {
  entryBy: {
    type: String,
    unique: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dailyActivities: {
    type: Array,
    required: true
  },
  dailyWeight: {
    type: Number,
    min: 500,
    required: true
  },
  dailyReflection: {
    type: String,
    maxLength: 300
  }
});

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Authenticator middleware to validate access to restricted endpoints
const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ accessToken: req.header('Authorization') });

    if (user) {
      // if the user is found, we attach the user to the request object and call
      // the next() function so they can access the restricted page
      req.user = user;
      next();
    } else {
      res.status(401).json({ loggedOut: true, message: 'Please try logging in again' });
    }
  } catch (err) {
    res.status(403).json({ message: 'Access token is missing or wrong', errors: err });
  }
};

// ROUTES
// Landing Page: will show a list of the existing endpoints (using express-list-endpoints library)
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// SIGN UP ENDPOINT - to create a NEW account
// This endpoint expects a name and password in the body from the POST request from the Frontend
app.post('/users', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await new User({ name, password }).save();

    // if the user was saved successfully, the response will include the newly saved user's ID and their access token
    res.status(201).json({ userId: user._id, accessToken: user.accessToken });
  } catch (error) {
    res.status(400).json({ message: 'Could not create user', error });
  }
});

// LOGIN ENDPOINT - login for already existing users
// This endpoint expects a name and password from frontend POST request's body
app.post('/sessions', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (user && bcrypt.compareSync(password, user.password)) {
      // if the user is found and the password matches, we respond with the user ID and their access token
      res.status(201).json({ userId: user._id, accessToken: user.accessToken });
    } else {
      res.status(404).json({ notFound: true, message: 'Verify username and password is correct' });
    }
  } catch (err) {
    res.status(500).json({ notFound: true, message: 'Internal Server Error' });
  }
});

// Endpoint to CREATE A NEW BABY PROFILE
// RESTRICTED ENDPOINT: only accesible after user has signed up successfully
// The user's access token must be included in the POST request's 
// Authorization header done in the Frontend
// The POST request done in the Frontend must include in the body: babyName, dateOfBirth, timeOfBirth, gestationalAge, sex, weight, length
app.post('/profiles', authenticateUser);
app.post('/profiles', async (req,res) => {
  const userId = req.user.id;
  const { babyName, dateOfBirth, timeOfBirth, sex, gestationalAge, weight, length } = req.body;

  const babyProfile = new BabyProfile({ userId, babyName, dateOfBirth, timeOfBirth, sex, gestationalAge, weight, length });

  try {
    const savedBabyProfile = await babyProfile.save();
    res.status(200).json({ message: "Baby profile saved successfully." });
  } catch (error) {
    res.status(400).json({ message: "Could not save BabyProfile to the database", error });
  };
});

// Endpoint to CREATE A NEW DAILY ENTRY
// RESTRICTED ENDPOINT: only accesible after user has logged in or signed up successfully
// The user's access token must be included in the POST request's 
// Authorization header done in the Frontend
// The POST request done in the Frontend must include in the body: dailyActivities, dailyWeight, dailyReflection
app.post('/entries', authenticateUser);
app.post('/entries', async (req,res) => {
  const userId = req.user.id;

  const { dailyActivities, dailyWeight, dailyReflection } = req.body;

  const dailyEntry = new DailyEntry({ entryBy: userId, dailyActivities, dailyWeight, dailyReflection });

  try {
    const savedDailyEntry = await dailyEntry.save();

    // if saved successfully to the database, we send the whole daily entry back? Or what should we send back?
    res.status(200).json(savedDailyEntry);
  } catch (error) {
    res.status(400).json({ message: "Could not save DailyEntry to the database", error });
  };
});

// GET: Endpoint to show the last 5 daily entries for a specific baby
// The path includes the user ID, so we can do a search for the latest 5 daily entries
// by that specific user ID
// Restricted endpoint: Make sure user's accessToken is included in Authorization header
app.get('/entries/latest', authenticateUser);
app.get('/entries/latest', async (req,res) => { 
  const userId = req.user.id; 

  try { 
    const entries = await DailyEntry.find({ entryBy: userId }).sort({ createdAt: 'desc' }).limit(5).exec();
    res.json(entries);
  } catch (err) { 
    res.status(500).json(err);
  };
});

// GET: endpoint to show baby profile details for a specific baby
// The path includes the user ID so we can do a search for the BabyProfile
// entry having that specific user ID
// Restricted endpoint: Make sure user's accessToken is included in Authorization header
app.get('/profiles', authenticateUser);
app.get('/profiles', async (req,res) => { 
  const userId = req.user.id; 

  try { 
    const profile = await BabyProfile.findOne({ userId });
    res.json(profile);
  } catch (err) { 
    res.status(500).json(err);
  };
});

// DELETE: Endpoint to delete a specific entry on the database. It takes the ID from the entry that the 
// user wants to remove
app.delete('/entries/:entryId', authenticateUser);
app.delete('/entries/:entryId', async (req, res) => {
  try { 
    await DailyEntry.deleteOne({ _id: req.params.entryId });
    res.status(200).json({ success: "Entry deleted!" });
  } catch (error) {
    res.status(500).json({ message:"Could not delete entry" });
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
