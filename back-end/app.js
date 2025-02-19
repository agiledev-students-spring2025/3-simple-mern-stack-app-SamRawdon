require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the database models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route for the about us page content
app.get('/aboutus', (req, res) => {
  try {
    const content = {
      title: "About Us",
      description: `Hi, my name is Sam and here I'll tell you a little about myself. I'm 21 years old and I'm from Saint Paul, MN. I have been doing computer science for about 8 years now. I'm a current intern at Incisive Computing Solutions in Minneapolis which I do remote work for. There I work full stack, with a team of about 8 on the Omni~View product. I use mostly C#, Java, and Python but I've dabbled in JavaScript in the past. As for data management, I've only ever used SQL so MongoDB will be an exciting new journey for me.\n
      Outside of CS I'm minoring in philosophy and math. I love reading philosophy and discussing ideas. I also love math. Outside of classes I enjoy ultimate frisbee with NYU Purple Haze, I enjoy listening to music, djing, video games, and fashion. I hope to use this class to spread my wings and learn a new development stack, as well as bring my scrum abilities to an even greater level! I'm very excited to put some of my skills to use and build a fun app!`,
      imageUrl: "https://github.com/SamRawdon/resume.github.io/raw/refs/heads/main/photoOfSam.jpg"
    }
    res.json(content); // Send JSON response
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve about us section data',
    })
  }
});

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
