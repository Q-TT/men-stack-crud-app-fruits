// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

//import the data model we created in fruit.js
const Fruit = require("./models/fruit.js");
// When a user submits the form on the /fruits/new page, the browser sends a request to our server with the form data. To access this data in Express, we need to use middleware. Specifically, we’ll use express.urlencoded

// ========= MIDDLEWARE ============ //
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
//!why??
app.use(morgan("dev")); //new
//!why??


app.get("/", (req,res) => {
    res.render("index.ejs")
})

app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    console.log(allFruits); // log the fruits!
    res.render("fruits/index.ejs", {fruits: allFruits});
  });

app.get("/fruits/new", (req,res) => {
    res.render("fruits/new.ejs")
})

app.get("/fruits/:fruitId", async (req,res) => {
    const fondFruit = await Fruit.findById(req.params.fruitId)
    // res.send(
    //     `This route renders the show page for fruit ID: ${req.params.fruitId}`
    // )
    res.render("fruits/show.ejs", {fruit: fondFruit})
})

app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId)
    res.redirect("/fruits")
})


// post /fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    console.log(req.body)
    await Fruit.create(req.body);
    res.redirect("/fruits/new")
})


// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log(foundFruit);
    // res.send(`This is the edit route for ${foundFruit.name}`);
    res.render("fruits/edit.ejs", {
        fruit: foundFruit
    })
  });

app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });

  
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
