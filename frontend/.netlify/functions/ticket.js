const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    if (httpMethod === 'GET') {
      // params: ticketId
      const { id } = queryStringParameters

      // return object
      let res = {
        queueId: '',
        queueName: '',
        ticketId: id,
        ticketDesc: '',
        numberOfTicketsAhead: -1
      }
      const getListofCard = await axios.get(`https://api.trello.com/1/cards/${id}/list?fields=name&${tokenAndKeyParams}`)
      const { id: queueId, name: queueName } = getListofCard.data
      res.queueId = queueId
      res.queueName = queueName
      const getCardDesc = await axios.get(`https://api.trello.com/1/cards/${id}?fields=desc,idShort&${tokenAndKeyParams}`)
      const { desc } = getCardDesc.data
      if (desc !== '') {
        res.ticketDesc = JSON.parse(desc)
      }
      //If list isn't any of the special markers, check for position
      if (!(queueName.includes('[ALERT]') || queueName.includes('[DONE]') || queueName.includes('[MISSED]'))) {
        // To check position in queue
        // Get list and all the cards in it to determind queue position
        const getCardsOnList = await axios.get(`https://api.trello.com/1/lists/${queueId}/cards?${tokenAndKeyParams}`)
        const ticketsInQueue = getCardsOnList.data

        res.numberOfTicketsAhead = ticketsInQueue.findIndex(val => val.id === id)
      }

      return {
        statusCode: 200,
        body: JSON.stringify(res)
      };
    } else if (httpMethod === 'POST') {
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
    } else if (httpMethod === 'PUT') {
      const { id, queue } = queryStringParameters
      if (id && queue) {
        await axios.put(`https://api.trello.com/1/cards/${id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${queue}&pos=bottom`)
      }
      return {
        statusCode: 200,
      };
    } else if (httpMethod === 'DELETE') {
      const id = queryStringParameters.id
      if (id) {
        await axios.delete(`https://api.trello.com/1/cards/${id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`)
      }
      return {
        statusCode: 200,
      };
    }

  } catch (err) {
    console.log(err.response)
    return { statusCode: 400 };
  }


}