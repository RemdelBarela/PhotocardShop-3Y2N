const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require("dotenv/config");


app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));


//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");

const usersRoutes = require("./routes/users");
const photosRoutes = require("./routes/photos");
const materialsRoutes = require("./routes/materials");

const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/photos`, photosRoutes);
app.use(`${api}/materials`, materialsRoutes);

app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // dbName: "eshop",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(4000, () => {
  console.log("server is running http://localhost:4000");
});
