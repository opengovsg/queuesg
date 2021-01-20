const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    if (httpMethod === 'GET') {

      let res = {}
      // params: type
      const { type } = queryStringParameters
      if (type === 'board' && queryStringParameters.board) {
        const board = await axios.get(`https://api.trello.com/1/boards/${queryStringParameters.board}?${tokenAndKeyParams}`)
        res = board.data
      } else if (type === 'boardlists' && queryStringParameters.board) {
        const boardLists = await axios.get(`https://api.trello.com/1/boards/${queryStringParameters.board}/lists?${tokenAndKeyParams}`)
        res = boardLists.data
      } else if (type === 'queues' && queryStringParameters.queue) {
        const tickets = await axios.get(`https://api.trello.com/1/lists/${queryStringParameters.queue}/cards?${tokenAndKeyParams}`)
        res = tickets.data
      }
      return {
        statusCode: 200,
        body: JSON.stringify(res)
      };
    }
    return { statusCode: 200 };
  } catch (err) {
    console.log(err.response)
    return { statusCode: 400 };
  }


}