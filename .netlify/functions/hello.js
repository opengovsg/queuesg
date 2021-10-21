const axios = require('axios');

/**
 * Netlify function for Board Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, body } = event
    console.log('hi');
    if (httpMethod === 'GET') {


      const getUrl = await axios.get(`https://54ab-116-86-15-103.ngrok.io`)
      const res = getUrl.data

      return {
        statusCode: 200,
        body: res
      }

    }
    return { statusCode: 404 };
  } catch (err) {
    console.log(err)
    return { statusCode: 400 };
  }
}