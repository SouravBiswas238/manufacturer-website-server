const { getDb } = require("../utils/dbConnect");

module.exports.postReview = async (req, res, next) => {
    try {
        const newReview = req.body;
        const result = await db.collection("review").insertOne(newReview);
        res.send({ success: true, result });

    } catch (error) {
        next(error);
    }
};
module.exports.getAllReview = async (req, res, next) => {
    try {
        const db = getDb();
        const query = {};
        const cursor = db.collection("review").find(query);
        reviews = await cursor.toArray();
        res.send({ success: true, reviews });

    } catch (error) {
        next(error);
    }
};