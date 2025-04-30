//Code by Matthew Culley

require('dotenv').config();
const { s3, upload, getSignedURL } = require('./aws-config');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {MongoClient, ServerApiVersion} = require('mongodb');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

const uri = process.env.MONGO_URI;
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(uri, { //access my streaming simplifier database tree in mongo
    serverApi:{
        version:ServerApiVersion.v1,
        strict: true,
        deprecatedErrors:true
    }
});
const db = client.db("SSLogin"); //create a dedicated variable for the database
const users = db.collection("users"); //create a dedicated variable for the collection


async function start(){
    try{
        await client.connect(); //connect my database to the express server
        console.log('connected to mongoDB');
        app.listen(port, () => {
            console.log (`server is running at http://localhost:${port}`) //start the express server on port 3000
        });
    } catch (e){
        console.error('failed to connect', e);
    }
}
start();

  //account creation related functions
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


app.post('/register', async (req, res) => {
    try{
        // console.log('button clicked');
        const {email, username, password} = req.body; //allocates variables to the recieved data
        console.log(req.body);
        console.log(req.body.password);
        const existingUser = await users.findOne({$or: [{username}, {email}]}); //checks to ensure that the user doesn't already exist
        if(existingUser){
            return res.json({success:false, message:'That Username or Email is already in use!'});
        }

        const hashedPassword = await bcrypt.hash(password, 10); //encrypts the password ten times
        await users.insertOne({username, email, password:hashedPassword}); //inserts the new user data with the encrypted password

        // res.send('Thanks for Joining us!');
        res.json({success:true, message:'Thanks for Joining!'}) //creates a response that it was successful, attaching the thanks message

    } catch(e){
        console.error('failed to register, sorry!', e);
        res.json({ success: false, message: 'Registration failed... Please try again!' });
    }
});

app.post('/login', async (req, res) => {
    const{username, password} = req.body; // attach variables to the recieved data
    
    const user = await users.findOne({username}); // see if the username is valid

    if(!user){
        return res.json({success:false, message: 'Sorry, that username doesn\'t appear to exist!'});
    }

    const isMatch = await bcrypt.compare(password, user.password); //check the password against the encrypted password on record
    if(!isMatch){
        return res.json({success:false, message: 'Sorry, you don\'t have the right password!'});
    }

    const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '2h'}); //assign the user a login token so they can stay logged in for 2 hours
    res.json({success:true, message:`Nice! You\'re in!`, token});

});

function isAuthenticated(req, res, next) { //token authenticator, necessary for basically all user related functions
  // Get token from authorization header
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1]
  console.log(token);
  

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);   
    
    // Verify user exists in database
    users.findOne({ username: decoded.username })
      .then(user => {
        // console.log("mongo user "+user);
        if (user) {
          req.user = user;
          next();
        } else {
          // console.log('no mongo user'+user);
          res.status(401).json({ message: 'Invalid token. User not found.' });
        }
      })
      .catch(err => {
        console.error('Authentication error:', err);
        res.status(500).json({ message: 'Server error' });
      });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

  //profile picture related functions
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

// Profile picture upload route
app.post('/upload-profile-picture', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
  try {
    const username = req.user.username;
    const key = req.file.key;

    if (!req.file) {
      throw new Error('File not uploaded');
    }

    const profilePictureUrl = req.file.location; // uploaded by multer-s3

    console.log('Uploaded profile picture:', profilePictureUrl);

    await users.updateOne(
      { username: username },
      { $set: { profilePicture: key } }
    );

    res.json({
      success: true,
      imageUrl: profilePictureUrl,
      s3Key: key
    });

    // Remove res.redirect('/profile') - can't send two responses
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).send('Error uploading profile picture');
  }
});

app.get('/profile-picture-url', isAuthenticated, async (req, res) => {
  try {
    const user = await users.findOne({ username: req.user.username }); //grab the user attached to the multer upload

    if (!user || !user.profilePicture) {
      return res.status(404).json({ error: 'Profile picture not found.' }); 
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: user.profilePicture,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); //retrieve a url valid for 1 hour

    res.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).send('Error generating signed URL');
  }
});

  app.get('/profile', isAuthenticated, async(req, res) => {
    try {
      const username = req.user.username; // From JWT token
      
      // Find user in MongoDB
      const user = await users.findOne({username: username});

      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return user data including profile picture URL
      res.json({
        username: user.username,
        profilePicture: user.profilePicture || null,
        // Add any other user fields you want to send
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error });
    }
  });

  //watchlist related functions
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  app.post('/add-to-watchlist', isAuthenticated, async(req, res) =>{
    try{
      const movieId = req.body.movieId; //grab the movieID through the post from the front end
      const username = req.user.username; //grab the authenticated username from the authenticated method

      const result = await users.updateOne(
        {username: username}, //look at username
        {$addToSet: {watchlist: movieId}} //add the movie to that user's watchlist set
      );

      if(result.modifiedCount > 0){ //if something was modified, inform the user of a success
        res.json({success: true, message: 'Added to your Watchlist!'});
      } else { //if nothing was modified, inform the user that it failed, but there was no error
        res.json({success: false, message: 'Addition failed! Is the movie already in your watchlist?'});
      }
    } catch (e){
      console.error('Error adding movie to watchlist: '+e);
      res.status(500).send('There was an internal error adding the movie to your watchlist...');
    }
  });
  app.post('/remove-from-watchlist', isAuthenticated, async(req, res) =>{
    try {
      const movieId = req.body.movieId;
      const username = req.user.username;
      
      
      const result = await users.updateOne(
        { username: username },
        { $pull: { watchlist: movieId } }  // remove the movie from the user's collection
      );
  
      if (result.modifiedCount > 0) { //if something was modified, inform the user of a success
        res.json({ success: true, message: 'Movie removed from watchlist' });
      } else { //if nothing was modified, inform the user that it failed, but there was no error
        res.json({ success: false, message: 'Movie not found in watchlist' });
      }
    } catch (e) {
      console.error('Error removing from watchlist:', e);
      res.status(500).send('There was an internal error removing the movie from your watchlist...');
    }
  });
  app.get('/get-watchlist', isAuthenticated, async (req, res) => {
    try {
      const username = req.user.username;
      
      // Retrieve user data from the database
      const user = await users.findOne({ username: username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const watchlist = user.watchlist || []; //default to a blank watchlist if there is no user.watchlist

      // Fetch movie details from TMDB
      const movieDetails = await Promise.all(watchlist.map(async (movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`);
        const data = await response.json();
        // console.log(data);
        return data;
      }));
      
      // console.log({watchlist: movieDetails});
      res.json({ watchlist: movieDetails});
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).send('Error fetching watchlist');
    }
  });

//testing functions below
//
//

async function run() {
    try {
        //connect client to server
        await client.connect();

        //confirm connection with a ping
        await client.db("admin").command({ping: 1});
        console.log("Pinged deployement, you have successfully connected to the SS Mongo!");
    } finally{
        //close client at finish or error
        await client.close();
    }
}

const getUsers = async () =>{
    try{
        const database = client.db("sample_mflix");
        const users = database.collection("users");

        // const allUsers = await users.find({}).toArray();
        // console.log(allUsers); 
        const result = await users.findOne(
            { name: RegExp('bran', 'i') }, //RegExp takes a string and a setting, I'm looking for "bran" and the i means "ignore caps"      
            { projection: { _id: 1, name: 1 } } //telling mongo which parts of the item to print
          );
          console.log(result);

    } catch (e){
        console.error('couldn\'t log users');
    }
}



// console.log(require('crypto').randomBytes(32).toString('hex'));

// run().catch(console.dir);
// getUsers();