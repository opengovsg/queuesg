const axios = require('axios');
const { TICKET_STATUS, FIREBASE_URL } = require('../constants')

const getTicketsInQueue = async (queueCode) => {
  const resp = await axios.get(`${FIREBASE_URL}/queues/${queueCode}.json`)
  const queue = resp.data
  if (queue == null) {
    return null
  }

  let tickets = []
  for (const key in queue.tickets) {
    if (queue.tickets[key].status === TICKET_STATUS.ALERTED ||
      queue.tickets[key].status === TICKET_STATUS.PENDING) {
      tickets.push({ ticketId: key, status: queue.tickets[key].status })
    }
  }
  return tickets
}

exports.getTicketsInQueue = getTicketsInQueue;