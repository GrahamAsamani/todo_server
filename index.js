import dotenv from "dotenv";
import cors from "cors";
import TodoModel from "./schema/todo_schema.js";
import express from "express";
import mongoose from "mongoose";
//var express = require('express');
//const mongoose = require('mongoose')
//const cors = require('cors')
var app = express();

app.use(express.json());
app.use(cors());
dotenv.config();
const port = 3000;

const db = process.env.DB_URL;
const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;
// defining routes
//connect to local db
//.connect("monogo//localhost/todo_db",)
//usenewurlparser;true;
//useunified topology: true;
//then (()) =>{console.log("connected to monogodb")}
//connecting to online db

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })

  .catch((err) => {
    console.log(err);
  });


  app.get('/', (req, res)=>{
    res.send('Welcome to my Api')
  })
///gey all todos
app.get("/todos", async (req, res) => {
  const todoModel = await TodoModel.Find({});
  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "todo fetched successfully",
      data: TodoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todo not found",
    });
  }
});
// create a todo
app.post("/todo", async (req, res) => {
  const { title, description, date_time } = req.body;
  const todoModel = await TodoModel.create({
    title,
    description,
    date_time,
  });
  if (todoModel) {
    return res.status(201).json({
      status: true,
      message: "todo created",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todo failed to create",
    });
  }
});
//get one todo
app.get("/todo/:id", async (req, res) => {
  const { status } = req.params;
  const todoModel = await TodoModel.find({}).where("status").equals(status);
  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "Todos fetched successfully",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: true,
      message: "Todos not found",
    });
  }
});
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const todoModel = await TodoModel.updateOne({ status: status }).where({
    _id: id,
  });
  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "Todo marked as completede",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Todo failed to update",
    });
  }
});

app.delete("/todos/:id", async(req, res) => {
  const todoModel = await TodoModel.findByIdAndDelete(req.params.id);

  if (todoModel) {
      return res.status(200).json({
          status: false,
          message: "Todos deleted",
          data: todoModel,
      });
  } else {
      return res.status(400).json({
          status: false,
          message: "Todos failed to delete",
      });
  } 
});

//app. listen(port,()=> console.log('graham app listening on port ${port'));
app.listen(port, ()=>{
  console.log("Node server is running.");
});
