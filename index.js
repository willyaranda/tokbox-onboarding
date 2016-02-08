var path = require('path')
var OpenTok = require('opentok')
var winston = require('winston')
var express = require('express')
var handlebars = require('express-handlebars')
var app = express()

const config = require('./config.json')

const apiKey = config.tokens.apiKey
const apiSecret = config.tokens.apiSecret
const LISTEN_PORT = config.server.port

var opentok = new OpenTok(apiKey, apiSecret)

opentok.createSession((err, session) => {
  if (err) {
    winston.error(`Oops, error while creating session ${err}`)
    process.exit(1)
    return
  } else {
    winston.info(`Session created correctly ${session.sessionId}`)
    app.set('opentok-sessionId', session.sessionId)
    startListening()
  }
})

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('assets'))

const startListening = () => {
  app.listen(LISTEN_PORT, () => {
    winston.info(`Server listening on port ${LISTEN_PORT}`)
  })
}

// Configure routes
app.get('/', (req, res) => {
  const sessionId = app.get('opentok-sessionId')
  const token = opentok.generateToken(sessionId)

  res.render('home', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  })
})
