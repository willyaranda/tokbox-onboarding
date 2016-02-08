/* global OT */
const apiKey = document.getElementById('apiKey').innerHTML
const sessionId = document.getElementById('sessionId').innerHTML
const token = document.getElementById('token').innerHTML

const ownVideoElement = document.getElementById('videoMine')

let session = null
if (OT.checkSystemRequirements() === 1) {
  session = OT.initSession(apiKey, sessionId)
} else {
  // The client does not support WebRTC.
  // You can display your own message.
}

// Replace with the replacement element ID:
let publisher = OT.initPublisher(ownVideoElement)
publisher.on({
  streamCreated: function (event) {
    console.log('Publisher started streaming.')
  },
  streamDestroyed: function (event) {
    console.log(`Publisher stopped streaming. Reason: ${event.reason}`)
  }
})

if (session) {
  session.connect(token, (error) => {
    if (error) {
      console.log('Error connecting: ', error.code, error.message)
    } else {
      console.log('Connected to the session.')
      if (session.capabilities.publish === 1) {
        session.publish(publisher)
      } else {
        console.log('You cannot publish an audio-video stream.')
      }
    }
  })
}
