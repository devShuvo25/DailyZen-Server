const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

// all operation are here
    const db = client.db('myDB');
    console.log(db)
    app.get('/', (req,res) => {
        res.send('Server is running')
    })







  } finally {
    await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log("Server is runnig on port:", port)
})