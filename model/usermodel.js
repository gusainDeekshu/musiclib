const mongoose = require("mongoose");

const userScema = new mongoose.Schema(
  {
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    roles: { type: [String], default: ['','viewer',''] },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const usermodel = mongoose.model("user", userScema);

module.exports = usermodel;
