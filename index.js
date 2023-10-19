const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// midleware
app.use(cors());
app.use(express.json());

// database uri



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.inxe5k5.mongodb.net/?retryWrites=true&w=majority`;

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

        const automotiveCollection = client.db('automotiveDB').collection('automotive');
        const categoryCollection = client.db("automotiveDB").collection("category");
        // for show product
        app.get('/products', async (req, res) => {

            const cursor = automotiveCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // for show category data
        app.get('/categoryList', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)

        })


        app.get('/productLists/:brandName', async (req, res) => {
            const brandName = res.params.brandName;
            const cursor = automotiveCollection.find();
            const result = await cursor.toArray();
            res.send(result)

        })


        // create product 
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await automotiveCollection.insertOne(newProduct)
            res.send(result);
        })
        // create category
        app.post('/category', async (req, res) => {
            const newCategory = req.body;
            console.log(newCategory);
            const result = await categoryCollection.insertOne(newCategory);
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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})