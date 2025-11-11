const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require("cors");
require('dotenv').config()

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_SECRET}@cluster0.jeqeofo.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    await client.connect();
// all operation are here
    const db = client.db('myDB');
    const habitsCollection = db.collection('HabitsCollection');
    

    app.get('/', (req,res) => {
        res.send('Server is running')
    })
    app.get('/all-habits' ,async(req,res) => {
      const result = await habitsCollection.find().toArray();
      res.send(result)
    })
    app.get('/latest-fatures',async(req,res) => {
      const result = await habitsCollection.find().limit(6).sort({"created_at" : -1}).toArray();
      res.send(result)
    })
    // get my habits with query
    app.get('/my-habits',async (req,res) => {
      try{
      const email = req.query.email;
      let filter = {};
      
      if(email){
        filter = {user_email : email}
        console.log(email,filter)
        const result = await habitsCollection.find(filter).sort({created_at: -1}).toArray();
        res.send(result)   
        console.log(result)
      }
    }
    catch{
      err => {
        console.log(err)
      }
    }
     
    })
    // get by id
    app.get('/current-product/:id',async (req,res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const result = await habitsCollection.findOne(filter);
      res.send(result)
    })
    // post operation
    app.post('/add-habit',async (req,res) => {
      const result = await habitsCollection.insertOne(req.body);
      res.send(result);
      console.log(result,req.body)
    })
    // patch

    app.patch('/update-my-habit/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const update = {
        $set : {
              title: req.body.title,
              description:req.body.description,
              category: req.body.category,
              reminderTime: req.body.reminderTime,
              created_at: new Date().toLocaleString(),
              image: req.body.image,
              user_email: req.body.user_email,
              user_name: req.body.user_name,
        }
      }
      const result = await habitsCollection.updateOne(filter,update);
      res.send(result);
      console.log(result,update)
    })


    app.delete('/delet-this-habit/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const result = await habitsCollection.deleteOne(filter);
      res.send(result)
    })






  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log("Server is runnig on port:", port)
})