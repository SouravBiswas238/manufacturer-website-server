const express = require('express')
const app = express();
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middle wire
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xv9wx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const productCollection = client.db("flash-electronic").collection("product");
        const orderCollection = client.db("flash-electronic").collection("order");
        const userCollection = client.db("flash-electronic").collection("user");

        // post user information
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email }
            const exists = await orderCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, user: exists })
            }
            const result = await userCollection.insertOne(newUser);
            res.send({ success: true, result });
        })
        // get all product
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            products = await cursor.toArray();
            res.send(products);
        })
        // get single id data
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // post ordering data
        app.post('/order', async (req, res) => {
            const order = req.body;
            const query = { orderName: order.orderName, minOrder: order.minOrder }
            const exists = await orderCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, order: exists })
            }
            const result = await orderCollection.insertOne(order);
            res.send({ success: true, result });
        })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})