"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'day_2' database
    const db = client.db("day_2");
    console.log("connected!");
    // and creating a new collection 'seats'
    const seats = await db.collection("seats").find().toArray();
    const seatResponse = {};
    seats.forEach((seat) => {
      seatResponse[seat._id] = seat;
    });
    if (seats.length > 0) {
      return res.status(200).json({
        status: 200,
        seats: seatResponse,
        numOfRows: 8,
        seatsPerRow: 12,
      });
    } else {
      return res.status(404).json({ status: 404, data: "Not Found" });
    }
  } catch (err) {
    console.log(err.stack);
  }
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

const bookSeat = async (req, res) => {
  const { seatId, fullName, email } = req.body;

  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("day_2");
    console.log("connected!");
    const seat = await db.collection("seats").findOne({ _id: seatId });
    if (seat.isBooked) {
      res.status(400).json({
        status: 400,
        message: "The seat is already booked.",
      });
    } else {
      const query = {
        _id: seatId,
      };
      const newValues = {
        $set: { isBooked: true, fullName: fullName, email: email },
      };
      const result = await db.collection("seats").updateOne(query, newValues);
      res.status(200).json({
        status: 200,
        message: "The seat is successfully booked.",
        data: { _id: seatId, price: seat.price, isBooked: true },
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

const deleteBooking = async (req, res) => {
  const { _id } = req.body;

  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("day_2");
    console.log("connected!");
    const seat = await db.collection("seats").findOne({ _id: _id });
    console.log(seat);
    if (!seat.isBooked) {
      res.status(400).json({
        status: 400,
        message:
          "The seat is already available. There is no booking to delete.",
      });
    } else {
      const query = {
        _id: _id,
      };
      const newValues = {
        $set: { isBooked: false, fullName: "", email: "" },
      };
      const result = await db.collection("seats").updateOne(query, newValues);
      res.status(200).json({
        status: 200,
        message: "The seat is available again.",
        data: { _id: _id, price: seat.price, isBooked: newValues.isBooked },
      });
    }
  } catch (err) {
    console.log(err.stack);
    console.log("failure");
  }
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

const updateBooking = async (req, res) => {
  const { _id, fullName, email } = req.body;

  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("day_2");
    console.log("connected!");
    const seat = await db.collection("seats").findOne({ _id: _id });
    if (!seat.isBooked) {
      res.status(400).json({
        status: 400,
        message: "This seat is not booked.",
        data: {
          _id: _id,
          price: seat.price,
          isBooked: seat.isBooked,
        },
      });
    } else {
      const query = { _id: _id };
      const newValues = {
        $set: { fullName: fullName, email: email },
      };
      const result = await db.collection("seats").updateOne(query, newValues);
      res.status(200).json({
        status: 200,
        message: "The booking is successfully updated.",
        data: {
          _id: _id,
          price: seat.price,
          isBooked: seat.isBooked,
          fullName: fullName,
          email: email,
        },
      });
    }
  } catch (err) {
    console.log(err.stack);
    console.log("failure");
  }
};

module.exports = { getSeats, bookSeat, deleteBooking, updateBooking };
