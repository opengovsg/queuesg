const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    if (httpMethod === 'GET') {
      // params: queueId
      const { id } = queryStringParameters

      const getBoardQueueBelongsTo = await axios.get(`https://api.trello.com/1/lists/${id}/board?fields=id,name,desc&${tokenAndKeyParams}`)
      const { name, desc } = getBoardQueueBelongsTo.data

      return {
        statusCode: 200,
        body: JSON.stringify({
          name,
          desc
        })
      };
    }
    return { statusCode: 404 };
  } catch (err) {
    console.log(err.response)
    return { statusCode: 400 };
  }


}