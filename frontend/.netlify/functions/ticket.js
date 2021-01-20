const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN } = process.env

    if (httpMethod === 'POST') {
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