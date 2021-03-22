const axios = require('axios');

/**
 * Netlify function for Board Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, body } = event
    const { TRELLO_KEY, REDIRECT_URL } = process.env

    const request = JSON.parse(body)
    if (httpMethod === 'POST') {
      if (request.boardId) {
        const redirectUrl = REDIRECT_URL || 'http://localhost:8888/admin/callback'
        const scopes = "read,write"
        const appName = "QueueUp%20SG"
        const expiration = "1hour"

        return {
          statusCode: 200,
          body: JSON.stringify({
            authorizeUrl: `https://trello.com/1/authorize?expiration=${expiration}&name=${appName}&scope=${scopes}&response_type=token&key=${TRELLO_KEY}&return_url=${redirectUrl}?boardId=${request.boardId}%26key=${TRELLO_KEY}`
          })
        }
      } else {
        return {
          statusCode: 400
        }
      }
    }
    return { statusCode: 404 };
  } catch (err) {
    console.log(err.response)
    return { statusCode: 400 };
  }


}