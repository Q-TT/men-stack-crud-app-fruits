// import mongoose
const mongoose = require("mongoose");

const friutSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean
})

//To create a model, we use the mongoose.model method. This method takes two arguments: the name of the model and the schema to apply to that model.
const Fruit = mongoose.model("Fruit", friutSchema)

//export the registered data model
module.exports = Fruit