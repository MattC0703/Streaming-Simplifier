const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {MongoClient, ServerApiVersion} = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.static('public'));

const client = new MongoClient(uri, {
    serverApi:{
        version:ServerApiVersion.v1,
        strict: true,
        deprecatedErrors:true
    }
});
const db = client.db("SSLogin");
const users = db.collection("users");


async function start(){
    try{
        await client.connect();
        console.log('connected to mongoDB');
        app.listen(port, () => {
            console.log (`server is running at http://localhost:${port}`)
        });
    } catch (e){
        console.error('failed to connect', e);
    }
}
start();

app.post('/register', async (req, res) => {
    try{
        console.log('button clicked');
        const {email, username, password} = req.body;
        console.log(req.body);
        console.log(req.body.password);
        const existingUser = await users.findOne({$or: [{username}, {email}]});
        if(existingUser){
            return res.status(400).send('Username or Email is already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await users.insertOne({username, email, password:hashedPassword});

        // res.send('Thanks for Joining us!');
        res.json({success:true, message:'Thanks for Joining!'})
        
    } catch(e){
        console.error('failed to register, sorry!', err);
        res.json({ success: false, message: 'Registration failed... Please try again!' });
    }
});

app.post('/login', async (req, res) => {
    const{username, password} = req.body;
    
    const user = await users.findOne({
        username
    });

    if(!user){
        return res.status(401).send('User not found!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).send('Incorrect Password!');
    }

    const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.send(`Nice! You're logged in! Your Token is: ${token}`);
})

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