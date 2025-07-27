const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midleware
app.use(cors());
app.use(express.json());

// database uri

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.inxe5k5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const automotiveCollection = client
      .db("automotiveDB")
      .collection("automotive");
    const categoryCollection = client.db("automotiveDB").collection("category");
    const productDataCollection = client
      .db("automotiveDB")
      .collection("productData");
    // for show product
    app.get("/products", async (req, res) => {
      const cursor = automotiveCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for show category data
    app.get("/categoryList", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for show products data in dynamic
    app.get("/products/:brand", async (req, res) => {
      const brandName = req.params.brand;
      const cursor = automotiveCollection.find({ brandName });
      const result = await cursor.toArray();
      res.send(result);
    });

    //get products
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await automotiveCollection.findOne(query);
      res.send(result);
    });

    // get Products data
    app.get("/productData", async (req, res) => {
      const cursor = productDataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // create product
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await automotiveCollection.insertOne(newProduct);
      res.send(result);
    });
    // update product data
    app.put("/product/:id", async (req, res) => {
      const { id } = req.params;
      const options = { upsert: true };
      const updatedProduct = req.body;
      console.log(updatedProduct);
      const filter = { _id: new ObjectId(id) };
      const updateOperation = {
        $set: {
          name: updatedProduct.name,
          brandName: updatedProduct.brandName,
          type: updatedProduct.type,
          price: updatedProduct.price,
          shortDescription: updatedProduct.shortDescription,
          rating: updatedProduct.rating,
          imgUrl: updatedProduct.imgUrl,
        },
      };
      const result = await automotiveCollection.updateOne(
        filter,
        updateOperation,
        options
      );
      res.send(result);
    });

    // create category
    app.post("/category", async (req, res) => {
      const newCategory = req.body;
      console.log(newCategory);
      const result = await categoryCollection.insertOne(newCategory);
      res.send(result);
    });
    // create add to cart product data
    app.post("/productData", async (req, res) => {
      const productData = req.body;
      console.log(productData);
      const result = await productDataCollection.insertOne(productData);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Automotive server is running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
