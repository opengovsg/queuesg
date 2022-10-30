const axios = require('axios')
const { parse: parseUrl } = require('url')

/**
 * Function for Queue / List Trello API calls
 */
export default async function handler (req, res) {
  try {
    const { method: httpMethod, url } = req
    const { query: queryStringParameters } = parseUrl(url, true)
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD, TRELLO_ENDPOINT = 'https://api.trello.com/1' } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET /queue
     * @param  {string} id The id of the queue
     * @return {body: {name: string, desc: object}} 
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === 'GET') {
      const { id } = queryStringParameters

      const getBoardQueueBelongsTo = await axios.get(`${TRELLO_ENDPOINT}/lists/${id}/board?fields=id,name,desc&${tokenAndKeyParams}`)

      const { id: boardId, name, desc } = getBoardQueueBelongsTo.data

      res.status(200).json({
        id: boardId,
        name,
        desc
      })
    } else {
      res.status(404).json()
    }
  } catch (err) {
    console.log(err.response)
    res.status(400).json()
  }


}