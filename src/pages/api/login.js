const axios = require('axios')
const { parse: parseUrl } = require('url')

/**
 * Function for Board Trello API calls
 */
 export default async function handler (req, res) {
  try {
    const { method: httpMethod, body: request } = req
    const { TRELLO_KEY, REDIRECT_URL, SCOPES, APP_NAME, EXPIRATION_DURATION } = process.env

    if (httpMethod === 'POST') {
      if (request.boardId) {
        const scopes = SCOPES || "read,write"
        const appName = APP_NAME || "QueueUp%20SG"
        const expiration = EXPIRATION_DURATION || "1hour"

        const redirectUrl = encodeURIComponent(`${REDIRECT_URL || 'http://localhost:3000/admin/callback'}?boardId=${request.boardId}&key=${TRELLO_KEY}`)

        res.json({
          authorizeUrl: `https://trello.com/1/authorize?expiration=${expiration}&name=${appName}&scope=${scopes}&response_type=token&key=${TRELLO_KEY}&return_url=${redirectUrl}`
        })
      } else {
        res.status(400).json()
      }
    } else {
      res.status(404).json()
    }
  } catch (err) {
    console.log(err.response)
    res.status(400).json()
  }
}