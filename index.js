const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");
const toolsRoutes = require("./routes/v1/tools.route.js");
const productsRoute = require("./routes/v1/products.route.js");
const userRoute = require("./routes/v1/user.route.js");
const orderRoute = require("./routes/v1/order.route.js");
const reviewRoute = require("./routes/v1/review.route.js");
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnect");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// app.use(viewCount);

// Apply the rate limiting middleware to all requests
// app.use(limiter);

connectToServer((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } else {
        console.log(err);
    }
});

// app.use("/api/v1/tools", toolsRoutes);
app.use("/api/v1/products", productsRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/review", reviewRoute);





app.all("*", (req, res) => {
    res.send("NO route found.");
});

app.use(errorHandler);

process.on("unhandledRejection", (error) => {
    console.log(error.name, error.message);
    app.close(() => {
        process.exit(1);
    });
});
