require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.COKOLET}:${process.env.KPAOSLEST}@cluster0.z8w3emk.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json())


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolatesCollection = client.db('chocolatesDb').collection('chocolates')

    // first step add data in mongodb
    app.post('/chocolates', async (req, res) => {
      const chocolate = req.body;
      // console.log(chocolate)
      const result = await chocolatesCollection.insertOne(chocolate)
      res.send(result)
    })

    // second step
    app.get('/chocolates', async (req, res) => {
      const cursor = chocolatesCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // third step single data access
    app.get('/chocolates/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await chocolatesCollection.findOne(query)
      res.send(result)
    })

    // forth step delete data
    app.delete('/chocolates/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await chocolatesCollection.deleteOne(query)
      res.send(result)
    })

    // fifth step update data
    app.put('/chocolates/:id', async (req, res) => {
      const id = req.params.id;
      const chocolate = req.body;
      console.log(chocolate)
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true}
      const updateChocolate = {
        $set:{
          name:chocolate.name,
          country:chocolate.country,
          category:chocolate.category,
          photo:chocolate.photo
        }
      }
      const result = await chocolatesCollection.updateOne(filter,updateChocolate,options);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Chocolate management is running on server')
})
app.listen(port, (req, res) => {
  console.log(`Chocolate management is running on PORT: ${port}`)
})