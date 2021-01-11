const axios = require('axios');
const FIREBASE_URL = 'https://hack-queuesg-default-rtdb.firebaseio.com'
const TICKET_STATUS = {
  PENDING: 'pending',
  REMOVED: 'removed',
  ALERTED: 'alerted',
  SERVED: 'served',
  EXPIRED: 'expired'
}
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