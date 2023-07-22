require("./database/database").connect()
require('dotenv').config
const express = require('express')

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is working")
})

app.post("/register", async (req, res) => {
    try {
        // get all data from body
        const {firstname, lastname, email, password} = req.body
        // all the data should exist
        if(!(firstname && lastname && email && password)) {
            res.status(400).send('All fields are compulsory')
        }
        // check if user already exists
        // encrypt the password
        // save the user in DB
        // generate a token for user and send it
    } catch (error) {
        console.log(error);
    }
})

module.exports = app