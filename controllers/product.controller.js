const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");



module.exports.getAllProducts = async (req, res, next) => {
    try {
        const { limit, page } = req.query;
        const db = getDb();

        // cursor => toArray(), forEach()
        const products = await db.collection("product").find({})
            // .project({ _id: 0 })
            // .skip(+page * limit)
            // .limit(+limit)
            .toArray();
        console.log(products)
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

module.exports.postAProduct = async (req, res, next) => {
    try {
        // post Single product
        const db = getDb();
        const newProduct = req.body;
        const query = { name: newProduct.name }
        const exists = await db.collection("product").findOne(query);
        if (exists) {
            return res.send({ success: false, product: exists })
        }

        const result = await db.collection("product").insertOne(newProduct);

        if (!result.insertedId) {
            return res.status(400).send({ status: false, error: "Something went wrong!" });
        }

        res.send({ success: true, message: `Products added ` });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteProduct = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        console.log(id)
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: "Not a valid product id." });
        }

        const product = await db.collection("product").deleteOne({ _id: ObjectId(id) });
        console.log(product)
        if (!product.deletedCount) {
            return res.status(400).json({ success: false, error: "Couldn't delete the products" });
        }

        res.status(200).json({ success: true, message: "Successfully deleted the products" });
    } catch (error) {
        next(error);
    }
};
module.exports.getSingleProduct = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;

        console.log(id)
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: "Not a valid product id." });
        }

        const product = await db.collection("product").findOne({ _id: ObjectId(id) });

        res.status(200).json({ success: true, product: product });
    } catch (error) {
        next(error);
    }
};

