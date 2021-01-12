const axios = require('axios');

exports.handler = async function (event, context) {
  const { httpMethod, queryStringParameters } = event
  const { TRELLO_KEY, TRELLO_TOKEN } = process.env
  const name = queryStringParameters.name || 'john'

  try {
    const resp = await axios.post(`https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=5ffd586cf0085f1ec5ca65be&name=${name}`)

    const { id } = resp.data
    return {
      statusCode: 200,
      body: JSON.stringify({ ticketId: id })
    };
  } catch (error) {
    console.log(err)
    return {
      statusCode: 400
    };
  }


}