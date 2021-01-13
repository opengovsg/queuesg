const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters } = event
    const { TRELLO_KEY, TRELLO_TOKEN } = process.env

    if (httpMethod === 'POST') {
      const name = queryStringParameters.name || 'unknown user'
      const queue = queryStringParameters.queue
      if (queue) {
        const resp = await axios.post(`https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${queue}&pos=top&name=${name}`)

        const { id } = resp.data
        return {
          statusCode: 200,
          body: JSON.stringify({ ticketId: id })
        };
      }

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