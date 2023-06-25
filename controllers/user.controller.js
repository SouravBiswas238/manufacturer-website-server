const { getDb } = require("../utils/dbConnect");
const jwt = require('jsonwebtoken');

module.exports.getAllUser = async (req, res, next) => {
    try {
        const db = getDb();

        const users = await db.collection("user").find({}).toArray();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

module.exports.postUser = async (req, res, next) => {
    try {
        // post user information
        const db = getDb();
        const newUser = req.body;
        const query = { email: newUser.email }

        const token = jwt.sign({ email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
        const exists = await db.collection("user").findOne(query);
        if (exists) {
            return res.send({ success: false, user: "user already exists", token })
        }
        const result = await db.collection("user").insertOne(newUser);
        res.send({ success: true, result, token });

    } catch (error) {
        next(error);
    }
};

module.exports.getSingleUser = async (req, res, next) => {
    try {
        // get single email

        const db = getDb();
        const email = req.params.email;
        const query = { email: email };

        const user = await db.collection("user").findOne(query);
        res.send({ success: true, user });

    } catch (error) {
        next(error);
    }
};

module.exports.updateSingleUser = async (req, res, next) => {
    try {
        // update single user information in database
        const db = getDb();
        const email = req.params.email;
        const user = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: user,
        };
        const result = await db.collection("user").updateOne(filter, updateDoc, options);
        res.send({ success: true, result });




    } catch (error) {
        next(error);
    }
};

module.exports.getAAdminINfo = async (req, res, next) => {
    try {
        // get admin email
        const db = getDb();
        const email = req.params.email;
        const query = { email: email };
        const user = await db.collection("user").findOne(query);
        const isAdmin = user.role === 'admin';

        res.send({ success: true, admin: isAdmin });

    } catch (error) {
        next(error);
    }
};
module.exports.makeAdmin = async (req, res, next) => {
    try {
        // get admin email
        const db = getDb();
        // Put user admin email
        const email = req.params.email;
        const filter = { email: email };
        const updateDoc = {
            $set: { role: 'admin' },
        };
        const result = await db.collection("user").updateOne(filter, updateDoc);
        res.send({ success: true, result });

    } catch (error) {
        next(error);
    }
};