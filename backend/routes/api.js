const express = require('express')
const { v4: uuid } = require('uuid')
const axios = require('axios');
const { getTicketsInQueue } = require('../classes/helper');
const router = express.Router();
const { TICKET_STATUS, FIREBASE_URL } = require('../constants')



router.get('/', async (req, res) => {
  try {
    // const email = req.user!.id
    console.log('dc');
    global.io.emit('receive-push', 'Test event emitter');
    res.status(200).json({ data: '123' })
  } catch (err) {
    res.status(400)
  }
})

// ADMIN Routes
// Creates a new queue with a 4 char code
router.post('/admin/queue/create', async (req, res) => {
  try {
    // Get generate queue code
    // TODO:Check existing 4letter codes
    const queueId = uuid()
    const queueCode = uuid().slice(0, 4).toUpperCase()

    // Write to firebase
    const createQueue = await axios.put(
      `${FIREBASE_URL}/queues/${queueCode}.json`,
      {
        id: queueId,
      })

    return res.status(200).json({ queueCode, queueId })
  } catch (err) {
    console.log(err);
    return res.status(400)
  }
})

// Alerts a ticket in the queue
router.post('/admin/queue/:queueId/alert/:ticketId', async (req, res) => {
  try {
    // Get queue code & ticketId
    const queueCode = req.params.queueId
    const ticketId = req.params.ticketId

    // Check queue and ticket exist, update ticket status
    await axios.patch(
      `${FIREBASE_URL}/queues/${queueCode}/tickets/${ticketId}.json`,
      {
        status: TICKET_STATUS.ALERTED
      })

    // Get latest tickets for DB
    const tickets = await getTicketsInQueue(queueCode)

    // Update users in that queue via socket
    io.emit(`queue-update-${queueCode}`, { tickets });

    return res.sendStatus(200)
  } catch (err) {
    console.log(err);
    return res.status(400)
  }
})


// For users to join a queue
// Should create a ticket an return the ticket id
router.post('/queue/:queueId/join', async function (req, res) {
  try {
    // Get queue code
    const queueCode = req.params.queueId

    //Check if queue exists
    const resp = await axios.get(`${FIREBASE_URL}/queues/${queueCode}.json?shallow=true`)
    const queue = resp.data
    if (queue === null) {
      return res.status(404).json({ message: "Queue not found" })
    }
    // If so, add ticket to queue
    const createTicket = await axios.post(
      `${FIREBASE_URL}/queues/${queueCode}/tickets.json`,
      {
        createdAt: new Date().getTime(),
        status: 'pending' //active/alerting/expired/complete
      })

    //Firebase will return a unique id as 'name'
    const ticketId = createTicket.data.name

    res.status(200).json({ ticketId })
  } catch (err) {
    console.log(err);
  }
});

// For users and admin check queue length
router.get('/queue/:queueId', async function (req, res) {
  try {
    // Get queue code
    const queueCode = req.params.queueId

    //Check if queue exists
    const resp = await axios.get(`${FIREBASE_URL}/queues/${queueCode}.json`)
    const queue = resp.data
    if (queue === null) {
      return res.status(404).json({ message: "Queue not found" })
    }
    let tickets = []
    for (const key in queue.tickets) {
      tickets.push({
        key,
        createdAt: queue.tickets[key].createdAt,
        status: queue.tickets[key].status
      })
    }
    res.status(200).json({ tickets: tickets })
  } catch (err) {
    //console.log(err);
    res.sendStatus(400)
  }
});

// For admins to remove tickets from queue
router.delete('/queue/:queueId/:ticketId', async function (req, res) {
  try {
    // Get queue code & ticketId
    const queueCode = req.params.queueId
    const ticketId = req.params.ticketId

    //Delete ticket
    const resp = await axios.delete(`${FIREBASE_URL}/queues/${queueCode}/tickets/${ticketId}.json`)

    // Get latest tickets for DB
    const tickets = await getTicketsInQueue(queueCode)

    // Update users in that queue via socket
    io.emit(`queue-update-${queueCode}`, { tickets });

    return res.sendStatus(200)
  } catch (err) {
    //console.log(err);
    return res.sendStatus(400)
  }
});


module.exports = router;
