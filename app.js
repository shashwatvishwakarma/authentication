require("./database/database").connect()
require('dotenv').config
const User = require('./model/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const auth = require("./middleware/auth")
const {JWT_SECRET} = process.env    

const app = express();
app.use(express.json())
app.use(cookieParser())

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
        const existingUser = await User.findOne({email})
        if (existingUser) {
            res.json(401).send('User already exists with this email')
        }
        
        // encrypt the password
        const encryptedPassword = await bcrypt.hash(password, 10)

        // save the user in DB
        const user = await User.create({firstname, lastname, email, password: encryptedPassword})
        
        // generate a token for user and send it
        const token = jwt.sign({id: user._id, email}, JWT_SECRET, {expiresIn: "2h"})

        // sending data in frontend
        user.token = token
        user.password = undefined

        res.status(201).json(user)

    } catch (error) {
        console.log(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        // take data from body
        const {email, password} = req.body

        // all the data should exist
        if(!(email && password)) {
            res.status(400).send('All fields are compulsory')
        }

        // check if user exists & match password
        let token;
        const user = await User.findOne({email})
        if(user && (await bcrypt.compare(password, user.password))) {
            token = jwt.sign({id: user._id, }, JWT_SECRET, {expiresIn: "2h"})
        }

        user.token = token
        user.password = undefined

        // cookie section
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
        })

    } catch (error) {
        console.log(error)
    }
})

app.get("/dashboard", auth, (req, res) => {

    const {decode} = req.user
    console.log(decode)

    res.send("Welcome to dashboard")
})

module.exports = app