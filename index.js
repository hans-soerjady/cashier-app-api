require("dotenv").config();
const PORT = process.env.PORT || 2000;
const express = require("express");
const app = express();
const cors = require("cors");
const bearerToken = require("express-bearer-token");

app.use(cors());
app.use(express.json());
app.use(bearerToken());

app.get("/", (req, res) => {
    return res.status(200).send("API RUNNING")
})


// DEFINE ROUTER DISINI
const { accountsRouter, categoriesRouter, productsRouter, transactionsRouter } = require("./routers");
app.use("/account", accountsRouter)
app.use("/category", categoriesRouter)
app.use("/product", productsRouter)
app.use("/transaction", transactionsRouter)

// ERROR HANDLING DISINI
app.use((error, req, res, next) => {
    return res.status(error.rc || 500).send(error)
})

// BUAT ACCESS PUBLIC FOLDER
app.use("/public", express.static("public"))

app.listen(PORT, () => {
    console.log("API RUNNING ON PORT", PORT);
})