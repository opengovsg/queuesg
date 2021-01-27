const axios = require('axios');

/**
 * Netlify function for Queue / List Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET ./netlify/functions/queue
     * @param  {string} id The id of the queue
     * @return {body: {name: string, desc: object}} 
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === 'GET') {
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