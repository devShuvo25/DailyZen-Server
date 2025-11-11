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

const calculateStreak = (dates) => {
  if(!dates.length){
    return 0;
  }
  const sortDate = dates.sort((x,y) => new Date(y) - new Date(x));
  let streak = 1;
  for (let i = 1; i < sortDate.length; i++) {
  const diff = (new Date(sortDate[i - 1]) - new Date(sortDate[i])) / (1000 * 60 * 60 * 24);
  if (diff === 1) streak++;
  else break;
}
return streak;

}




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
      const result = await habitsCollection.find().sort({created_at: -1}).toArray();
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

    app.patch('/habits-complete/:id' , async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const today = new Date().toISOString().split("T")[0];
      console.log(today)
      const habit = await habitsCollection.findOne(filter);
      if(habit.completion_history.includes(today)){
        return res.status(400).send({message: 'Already completed today!'})
      }
      const update = {
        $push : {completion_history : today}
      }
      const result = await habitsCollection.updateOne(filter,update)
      const updated = await habitsCollection.findOne(filter);
      const streak = calculateStreak(updated.completion_history);
      await habitsCollection.updateOne(filter,{$set:{current_streak: streak}})
      res.send({message: "Marked complete", streak})
      console.log(result,streak)

    })




  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log("Server is runnig on port:", port)
})