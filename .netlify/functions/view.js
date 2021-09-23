const axios = require('axios');

/**
 * Netlify function for Board Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD, TRELLO_ENDPOINT } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET /view
     * - Retrieves info about a ticket and its position in queue
     * @param  {string} type The type of board data to retrieve
     * There are 3 types of api calls:
     */
    if (httpMethod === 'GET') {
      let res = {}
      const { type } = queryStringParameters
      /**
       * 1. board - Retrieves data about the board
       * *  @param  {string} board The board id
      */
      if (type === 'board' && queryStringParameters.board) {
        const board = await axios.get(`${TRELLO_ENDPOINT}/boards/${queryStringParameters.board}?${tokenAndKeyParams}`)
        res = board.data
      }
      /**
       * 2. boardlists - Retrieves all the lists that a board contains
       * *  @param  {string} board The board id
      */
      else if (type === 'boardlists' && queryStringParameters.board) {
        const boardLists = await axios.get(`${TRELLO_ENDPOINT}/boards/${queryStringParameters.board}/lists?${tokenAndKeyParams}`)
        res = boardLists.data
      }
      /**
       * 3. queues - Retrieve specifically the cards in Alert and Missed queues
       * *  @param  {string} queueAlertIds Comma delimited set of ids of the Alert queues
       * *  @param  {string} queueMissedId The id of the Missed queue
      */
      else if (type === 'queues' && queryStringParameters.queueAlertIds && queryStringParameters.queueMissedId) {

        const queueAlertIds = queryStringParameters.queueAlertIds.split(',')
        const setOfBatchUrls = [`/lists/${queryStringParameters.queueMissedId}/cards`]

        queueAlertIds.forEach(queueAlertId => {
          setOfBatchUrls.push(`/lists/${queueAlertId}/cards`)
        })

        const batchUrls = setOfBatchUrls.join(',')
        const batchAPICall = await axios.get(`${TRELLO_ENDPOINT}/batch?urls=${batchUrls}&${tokenAndKeyParams}`)

        const [missedQueue, ...rest] = batchAPICall.data

        //Check that all Batch apis returned 200
        const allAlertQueues = rest.filter(queue => Object.keys(queue)[0] === '200')

        if (allAlertQueues.length !== queueAlertIds.length || !missedQueue['200']) {
          return { statusCode: 400, message: "Batch error" }
        };

        //  Map the missed and alerted queues to the right keys
        res = {}
        res['missed'] = {
          [queryStringParameters.queueMissedId]: missedQueue['200']
        }
        allAlertQueues.forEach((queue, index) => res['alerted'] = {
          ...res['alerted'],
          [queueAlertIds[index]]: queue['200']
        })
      }
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(res)
      };
    }
    return { statusCode: 404 };
  } catch (err) {
    console.error('error', err.response || err)
    return { statusCode: 400 };
  }


}