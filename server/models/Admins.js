const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
})

//model(a,b): a: what you want to extract   b: how to extract  
const AdminModel = mongoose.model("admins",AdminSchema)

//to use this model in the server side we have to exporst it HOW?
module.exports=AdminModel