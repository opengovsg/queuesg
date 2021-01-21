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
      } else if (type === 'queues' && queryStringParameters.queueAlertId && queryStringParameters.queueMissedId) {

        const batchUrls = [
          `/lists/${queryStringParameters.queueAlertId}/cards`,
          `/lists/${queryStringParameters.queueMissedId}/cards`]
          .join(',')
        const batchAPICall = await axios.get(`https://api.trello.com/1/batch?urls=${batchUrls}&${tokenAndKeyParams}`)
        const [alertQueue, missedQueue] = batchAPICall.data
        //Check that all Batch apis returned 200
        if (!alertQueue['200'] || !missedQueue['200']) {
          return { statusCode: 400, message: "Batch error" }
        };

        res = [alertQueue['200'], missedQueue['200']]
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