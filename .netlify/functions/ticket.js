const axios = require('axios');

/**
 * Netlify function for Ticket / Card Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET ./netlify/functions/ticket
     * - Retrieves info about a ticket and its position in queue
     * @param  {string} id The id of the ticket
     * @param  {string} queue The id of the queue
     * @return {queueId: string, queueName: string, ticketId: string, ticketDesc: string, numberOfTicketsAhead: Number}
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === 'GET') {
      const { id, queue: queueId } = queryStringParameters

      // return object
      let res = {
        queueId: '',
        queueName: '',
        ticketId: id,
        ticketDesc: '',
        numberOfTicketsAhead: -1
      }

      const batchUrls = [
        `/cards/${id}/list?fields=name`,
        `/cards/${id}`,
        `/lists/${queueId}/cards`]
        .join(',')
      const batchAPICall = await axios.get(`https://api.trello.com/1/batch?urls=${batchUrls}&${tokenAndKeyParams}`)

      const [getListofCard, getCardDesc, getCardsOnList] = batchAPICall.data

      //Check that all Batch apis returned 200
      if (!getListofCard['200'] || !getCardDesc['200'] || !getCardsOnList['200']) {
        return { statusCode: 400, message: "Batch error" };
      }

      const { id: newQueueId, name: queueName } = getListofCard['200']
      res.queueId = newQueueId
      res.queueName = queueName

      const { desc } = getCardDesc['200']
      if (desc !== '') res.ticketDesc = JSON.parse(desc)

      //If list isn't any of the special markers, check for position
      if (!(queueName.includes('[ALERT]') || queueName.includes('[DONE]') || queueName.includes('[MISSED]'))) {
        // To check position in queue
        const ticketsInQueue = getCardsOnList['200']
        res.numberOfTicketsAhead = ticketsInQueue.findIndex(val => val.id === id)
      }

      return {
        statusCode: 200,
        body: JSON.stringify(res)
      };
    }
    /**
     * POST ./netlify/functions/ticket
     * - Creates a new ticket/card in queue with provided description
     * @param  {string} desc JSON string of user submitted info
     * @return {ticketId: string, ticketNumber: string}
     *  Returns the id and number of the created ticket
     */
    else if (httpMethod === 'POST') {
      const { desc } = JSON.parse(body)

      const name = desc.name || 'unknown user'
      const descString = JSON.stringify(desc)

      const queue = queryStringParameters.queue
      if (queue) {
        const createCard = await axios.post(
          `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${queue}&desc=${descString}`)

        const { id, idShort } = createCard.data
        // Update newly created card with number-name and desc
        await axios.put(
          `https://api.trello.com/1/cards/${id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&name=${idShort}-${name}`)

        return {
          statusCode: 200,
          body: JSON.stringify({ ticketId: id, ticketNumber: idShort })
        };
      }
    }
    /**
     * PUT ./netlify/functions/ticket
     * - Moves ticket to the bottom of the queue. Used for rejoining the queue
     * @param  {string} id The id of the ticket
     * @param  {string} queue The id of the queue
     * @return {statusCode: Number } Returns 200 if successful
     */
    else if (httpMethod === 'PUT') {
      const { id, queue } = queryStringParameters
      if (id && queue) {
        await axios.put(`https://api.trello.com/1/cards/${id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${queue}&pos=bottom`)
      }
      return {
        statusCode: 200,
      };
    }
    /**
     * DELETE ./netlify/functions/ticket
     * - Moves ticket to the bottom of the queue. Used for rejoining the queue
     * @param  {string} id The id of the ticket
     * @return {statusCode: Number } Returns 200 if successful
     */
    else if (httpMethod === 'DELETE') {
      const id = queryStringParameters.id
      if (id) {
        await axios.delete(`https://api.trello.com/1/cards/${id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`)
      }
      return {
        statusCode: 200,
      };
    }
    return { statusCode: 404 }
  } catch (err) {
    console.log(err.response)
    return { statusCode: 400 };
  }


}