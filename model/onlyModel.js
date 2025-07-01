const fs = require("fs");
const rootDir = require("../util/pathUtils");
const path = require("path");
const dataDestination = path.join(rootDir, "data", "storage.json");
const { getDB } = require("../util/databaseUtil");
const { ObjectId } = require("mongodb");

const mongoose = require("mongoose");

const mySchema = mongoose.Schema({
  stId: {
    type: Number,
    required: true,
  },
  personName: {
    type: String,
    required: true,
  },
  deptName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("studentModel", mySchema);

/* module.exports = class onlyModel {
  constructor(stId, personName, deptName, gender, contactNo, address, _id) {
    this.stId = stId;
    this.personName = personName;
    this.deptName = deptName;
    this.gender = gender;
    this.contactNo = contactNo;
    this.address = address;
    
  }

  save() {
    const db = getDB();

      return db.collection("firstOne").insertOne(this);
    
    
  }
  static fetchAll(callback) {
    const db = getDB();
    return db.collection("firstOne").find().toArray();
  }
  static findById(uniqueIdOfMongo) {
    const db = getDB();
    return db
      .collection("firstOne")
      .find({ _id: new ObjectId(String(uniqueIdOfMongo)) })
      .next();
  }
  static deleteById(uniqueIdOfMongo) {
    const db = getDB();
    return db
      .collection("firstOne")
      .deleteOne({ _id: new ObjectId(String(uniqueIdOfMongo)) });
  }
}; */
