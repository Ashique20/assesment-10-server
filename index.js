const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const express = require('express')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0b46zlg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
  

    const artCollection = client.db('artDb').collection('art')
    const categoryCollection = client.db('artDb').collection('categoryCollection')
    const craftCollection = client.db('artDb').collection('craftCollection')


    app.get('/category', async (req, res) => {
        const result = await categoryCollection.find({}).toArray()
        res.send(result)
      })

    app.get('/arts', async (req, res) => {
      const queryEmail = req.query.email;
      console.log(queryEmail)
      if (queryEmail) {
        const filter = { email: queryEmail };
        const result = await artCollection.find(filter).toArray();
        res.send(result);
      } else {
        const arts = await artCollection.find({}).toArray();
        res.send(arts);
      }
    });

    app.get('/craft/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result)
    })

    app.get('/craft', async (req, res) => {
      const name = req.query.name;
      console.log(name); // Output: Landscape%20Painting
  
      // Decode the name parameter to get the original value
      const decodedName = decodeURIComponent(name);
      console.log(decodedName); // Output: Landscape Painting
  
      if (decodedName) {
          const filter = { Subcategory_name: decodedName }; // Use decodedName in filter
          const result = await craftCollection.find(filter).toArray();
          res.send(result);
      } else {
          const result = await craftCollection.find({}).toArray();
          res.send(result);
      }
  });
  




    app.get('/arts/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await artCollection.findOne(filter)
      res.send(result)
    })

    app.post('/arts', async (req, res) => {
      const body = req.body
      const result = await artCollection.insertOne(body)
      res.send(result)
    })
    app.put('/arts/:id', async (req, res) => {
      const body = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          url: body.url,
          name: body.name,
          subName: body.subName,
          description: body.description,
          price: body.price,
          rate: body.rate,
          customize: body.customize,
          time: body.time,
          status: body.status,
          userName: body.userName,
        },
      };
      const result = await artCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    app.delete('/arts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await artCollection.deleteOne(query)
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
  res.send('port is running')
})

app.listen(port, () => {
  console.log('kortese kaaj')
})