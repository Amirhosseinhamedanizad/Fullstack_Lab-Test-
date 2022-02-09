const mongoose = require('mongoose')
const express = require('express')

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)

const session = require('express-session')
const bodyParser = require('body-parser')

let Messages = require('./models/message')
let User = require('./models/user')

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))


io.on('connection', (socket) => {
  console.log('socket has connected')
  io.emit('room', 'welcome')
})

app.get('/messages', (req, res) => {
  Messages.find({}, (err, msgs) => {
    res.send(msgs)
  })
})





app.get('/privatearea', (request, response) => {

  if (!request.session.user) {
    return response.status(401).send('You are not authorized to use this resource')
  }
  return response.status(200).send("Admin area")
})

app.get('/logout', (request, response) => {
  request.session.destroy()
  return response.status(200).send('logout successfully')
})

app.post('/messages', (request, response) => {

  let message = new Messages(request.body)

  message.save((err) => {
    if (err) {
      console.log(err)
    }
    io.emit('message', request.body)
    response.sendStatus(200)
  })
})

app.post('/register', (request, response) => {


  var username = request.body.username
  var password = request.body.password

  var firstname = request.body.firstname
  var lastname = request.body.lastname

  var new_user = new User()

  new_user.username = username
  new_user.password = password

  new_user.firstname = firstname
  new_user.lastname = lastname

  new_user.save(function (error, savedUser) {
    if (error) {
      console.log(error)
      return response.status(500).send('user could not be saved')
    }
    return response.status(200).send('user saved!')
  })

})

app.post('/login', (request, response) => {

  let username = request.body.username
  let password = request.body.password

  User.find({ username: username, password: password }, (err, user) => {

    if (err) {
      console.log(err)
      return response.status(500).send('something went wrong in backend')
    }
    if (!user) {
      return response.status(404).send('unauthorized')
    }

    req.session.user = user
    return response.status(200).send('login successfull')
  })
})

const port = 3000
const connString = 'mongodb+srv://Diyako:1234@cluster0.edpoh.mongodb.net/Cluster0?retryWrites=true&w=majority'

mongoose.connect(connString, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('database did not connect', err)
  } else {
    console.log('database connected')
  }
})



const server = http.listen(port, () => {
  console.log(`find app at http://localhost:${port}/`)
})