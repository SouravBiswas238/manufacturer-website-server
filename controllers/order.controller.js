const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");



module.exports.getAllOrder = async (req, res, next) => {
    try {
        const db = getDb();

        const orders = await db.collection("order").find({}).toArray();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};
module.exports.addAOrder = async (req, res, next) => {
    try {
        const db = getDb();
        // post ordering data
        const order = req.body;
        const query = { orderName: order.orderName, myOrder: order.myOrder }
        const exists = await db.collection("order").findOne(query);
        if (exists) {
            return res.send({ success: false, order: exists })
        }
        const result = await db.collection("order").insertOne(order);
        res.send({ success: true, result });

    } catch (error) {
        next(error);
    }
};

module.exports.getOrderByEmail = async (req, res, next) => {
    try {
        const db = getDb();
        // get single email order
        const email = req.params.email;

        const decodedEmail = req.decoded.email;
        if (email === decodedEmail) {
            const query = { email: email }
            const result = await db.collection("order").find(query).toArray();
            return res.send(result);
        }
        else {
            return res.status(403).send({ message: 'forbidden access' });
        }

    } catch (error) {
        next(error);
    }
};
module.exports.deleteOrder = async (req, res, next) => {
    try {
        const db = getDb();
        // delete Single order
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await db.collection("order").deleteOne(query);
        return res.status(403).send({ message: 'deleted successfully', result });

    } catch (error) {
        next(error);
    }
};

