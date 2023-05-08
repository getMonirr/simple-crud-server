const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 3000;
const password = process.env.PASSWORD;




// middle ware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('simple crud is running')
})

const uri = `mongodb+srv://getmonirr:${password}@cluster0.i5ku26o.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("usersDB");
        const userCollection = database.collection("users")

        // get users
        app.get('/users', async (req, res) => {
            const cursor = await userCollection.find().toArray();
            res.send(cursor)
        })

        // get individual user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)

        })

        // post/insert a user
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result)

        })

        // update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUserInfo = req.body;
            const updateDoc = {
                $set: {
                    name: updatedUserInfo.name,
                    email: updatedUserInfo.email
                }
            }

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);





app.listen(port, () => {
    console.log(`simple crud project running on port ${port}`);
})


