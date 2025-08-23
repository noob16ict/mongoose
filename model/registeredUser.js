const mongoose = require("mongoose");

const mySchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required: true,
  }
  
});
module.exports = mongoose.model("registeredUserModel", mySchema);
