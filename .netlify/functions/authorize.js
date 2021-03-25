const axios = require('axios');

/**
 * Netlify function for Board Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, body } = event
    const { TRELLO_KEY, REDIRECT_URL, SCOPES, APP_NAME, EXPIRATION_DURATION } = process.env

    const request = JSON.parse(body)
    if (httpMethod === 'POST') {
      if (request.boardId) {
        const redirectUrl = REDIRECT_URL || 'http://localhost:8888/admin/callback'
        const scopes = SCOPES || "read,write"
        const appName = APP_NAME || "QueueUp%20SG"
        const expiration = EXPIRATION_DURATION || "1hour"

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
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