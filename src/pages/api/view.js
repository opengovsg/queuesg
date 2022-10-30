const axios = require('axios');
const { parse: parseUrl } = require('url')

/**
 * Function for Board Trello API calls
 */
export default async function handler (req, res) {
  try {

    const { method: httpMethod, url } = req
    const { query: queryStringParameters } = parseUrl(url, true)
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD, TRELLO_ENDPOINT = 'https://api.trello.com/1' } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET /view
     * - Retrieves info about a ticket and its position in queue
     * @param  {string} type The type of board data to retrieve
     * There are 3 types of api calls:
     */
    if (httpMethod === 'GET') {
      let result = {}
      const { type } = queryStringParameters
      /**
       * 1. board - Retrieves data about the board
       * *  @param  {string} board The board id
      */
      if (type === 'board' && queryStringParameters.board) {
        const board = await axios.get(`${TRELLO_ENDPOINT}/boards/${queryStringParameters.board}?${tokenAndKeyParams}`)
        result = board.data
      }
      /**
       * 2. boardlists - Retrieves all the lists that a board contains
       * *  @param  {string} board The board id
      */
      else if (type === 'boardlists' && queryStringParameters.board) {
        const boardLists = await axios.get(`${TRELLO_ENDPOINT}/boards/${queryStringParameters.board}/lists?${tokenAndKeyParams}`)
        result = boardLists.data
      }
      /**
       * 3. queues - Retrieve specifically the cards in Alert and Missed queues
       * *  @param  {string} queueAlertIds Comma delimited set of ids of the Alert queues
       * *  @param  {string} queueMissedIds Comma delimited set of ids of the Missed queues
      */
      else if (type === 'queues' && queryStringParameters.queueAlertIds && queryStringParameters.queueMissedIds) {

        const queueAlertIds = queryStringParameters.queueAlertIds.split(',')
        const queueMissedIds = queryStringParameters.queueMissedIds.split(',')
        const setOfBatchUrls = []

        queueMissedIds.forEach(queueMissedId => {
          setOfBatchUrls.push(`/lists/${queueMissedId}/cards`)
        })

        queueAlertIds.forEach(queueAlertId => {
          setOfBatchUrls.push(`/lists/${queueAlertId}/cards`)
        })

        const batchUrls = setOfBatchUrls.join(',')
        const batchAPICall = await axios.get(`${TRELLO_ENDPOINT}/batch?urls=${batchUrls}&${tokenAndKeyParams}`)

        //Check that all Batch apis returned 200
        const allQueues = batchAPICall.data.filter(queue => Object.keys(queue)[0] === '200')
        if (allQueues.length !== (queueAlertIds.length + queueMissedIds.length)) {
          res.status(400).json('Batch error')
          return
        }

        const missedQueues = allQueues.slice(0, queueMissedIds.length)
        const allAlertQueues = allQueues.slice(queueMissedIds.length)

        //  Map the missed and alerted queues to the right keys
        result = {}
        missedQueues.forEach((queue, index) => result['missed'] = {
          ...result['missed'],
          [queueMissedIds[index]]: queue['200']
        })
        allAlertQueues.forEach((queue, index) => result['alerted'] = {
          ...result['alerted'],
          [queueAlertIds[index]]: queue['200']
        })
      }
      res.json(result)
    } else {
      res.status(404).json()
    }
  } catch (err) {
    console.error('error', err.response || err)
    res.status(400).json()
  }
}
