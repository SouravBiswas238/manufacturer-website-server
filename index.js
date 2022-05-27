const express = require('express')
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');

// middle wire
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xv9wx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}


async function run() {
    try {
        await client.connect();

        const productCollection = client.db("flash-electronic").collection("product");
        const orderCollection = client.db("flash-electronic").collection("order");
        const userCollection = client.db("flash-electronic").collection("user");
        const reviewCollection = client.db("flash-electronic").collection("review");

        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'Forbidden' });
            }
        }

        // post user information
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email }

            const token = jwt.sign({ email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
            const exists = await userCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, user: exists, token })
            }
            const result = await userCollection.insertOne(newUser);
            res.send({ success: true, result, token });
        });

        // get all users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            users = await cursor.toArray();
            res.send(users);
        });

        // get single email
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            res.send(user);
        })
        // get admin email
        app.get('/user/admin/:email', async (req, res) => {

            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        // put single email information in database
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // Put user admin email
        app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // post Single product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const query = { name: newProduct.name }
            console.log(query)
            const exists = await productCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, product: exists })
            }
            const result = await productCollection.insertOne(newProduct);
            res.send({ success: true, result });
        });

        // delete Single product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);


        });

        // get all product
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            products = await cursor.toArray();
            res.send(products);
        })

        // get single id product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // post ordering data
        app.post('/order', verifyJWT, verifyAdmin, async (req, res) => {
            const order = req.body;
            const query = { orderName: order.orderName, minOrder: order.minOrder }
            const exists = await orderCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, order: exists })
            }
            const result = await orderCollection.insertOne(order);
            res.send({ success: true, result });
        })
        // get all product
        app.get('/order', async (req, res) => {
            const query = {}
            const result = await orderCollection.find(query).toArray();
            return res.send(result);
        })
        // get single email order
        app.get('/order/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;

            const decodedEmail = req.decoded.email;
            if (email === decodedEmail) {
                const query = { email: email }
                const result = await orderCollection.find(query).toArray();
                return res.send(result);
            }
            else {
                return res.status(403).send({ message: 'forbidden access' });
            }


        })


        // post review data
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });
        // get review data
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            reviews = await cursor.toArray();
            res.send(reviews);
        });

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