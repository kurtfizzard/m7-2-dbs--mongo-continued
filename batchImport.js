const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

// const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const fs = require("fs");

const generateSeats = () => {
  // Code that is generating the seats.
  // ----------------------------------
  const seats = {};
  const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
      seats[`${row[r]}-${s}`] = {
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
      };
    }
  }

  return Object.values(seats);
};

const batchImport = async () => {
  // TODO: connect...
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // TODO: declare 'db'
    // We are using the 'day_2' database
    const db = client.db("day_2");
    console.log("connected!");
    // and creating a new collection 'seats'
    const result = await db.collection("seats").insertMany(generateSeats());
    console.log(result);
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }
  // TODO: close...
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

batchImport();
