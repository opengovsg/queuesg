const axios = require('axios');

/**
 * Netlify function for Ticket / Card Trello API calls
 */
exports.handler = async function (event, context) {
  try {
    const { httpMethod, queryStringParameters, body } = event
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD, TRELLO_ENDPOINT } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET /ticket
     * - Retrieves info about a ticket and its position in queue
     * @param  {string} id The id of the ticket
     * @return {queueId: string, queueName: string, ticketId: string, ticketDesc: string, numberOfTicketsAhead: Number}
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === 'GET') {
      const { id } = queryStringParameters

      /**
       *    Experimental GET /ticket flow to fetch status in a single API call.
       *    Lays the groundwork for adding a caching layer that can store this call
       * *  @param  {string} board The board id
      */
      if (queryStringParameters.board) {
        console.log('== experimental ==');
        const boardId = queryStringParameters.board
        // Get the card's position in the current queue
        const getBoardInfo = await axios.get(`${TRELLO_ENDPOINT}/boards/${boardId}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,desc,pos&lists=open&list_fields=id,name&${tokenAndKeyParams}`);
        if (getBoardInfo.status !== 200) {
          return { statusCode: getBoardInfo.status, message: "getBoardInfo error" };
        }
        const parseBoardData = (data) => {
          const listMap = {}
          const cardMap = new Map()
          data.lists.forEach(list => {
            listMap[list.id] = { ...list, cards: [] }
          })

          data.cards.forEach(card => {
            const queueId = card.idList

            // Get the name of the queue the card resides in
            const queueName = listMap[queueId].name

            let numberOfTicketsAhead = -1
            if (!(queueName.includes('[ALERT]') || queueName.includes('[DONE]') || queueName.includes('[MISSED]'))) {
              // Get card position based on length of list before
              numberOfTicketsAhead = listMap[queueId].cards.length
            }

            // const listName = listMap[queueId].name
            card = { ...card, numberOfTicketsAhead, queueName }
            // Add listMap with card
            listMap[queueId] = { ...listMap[queueId], cards: [...listMap[queueId].cards, card] }
            // Add card to the card map for quick lookup
            cardMap.set(card.id, card)
          })
          return { listMap, cardMap }
        }

        const { cardMap } = parseBoardData(getBoardInfo.data)
        const card = cardMap.get(id)

        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            queueId: card.idList,
            queueName: card.queueName,
            ticketId: id,
            ticketDesc: JSON.parse(card.desc),
            numberOfTicketsAhead: card.numberOfTicketsAhead,
          })
        };
      }
      // return object
      let res = {
        queueId: '',
        queueName: '',
        ticketId: id,
        ticketDesc: '',
        numberOfTicketsAhead: -1
      }

      const batchUrls = [
        `/cards/${id}/list?fields=name`,
        `/cards/${id}`,
      ].join(',')
      const batchAPICall = await axios.get(`${TRELLO_ENDPOINT}/batch?urls=${batchUrls}&${tokenAndKeyParams}`)

      //Check if rate limit hit
      if (batchAPICall.status === 429) { return { statusCode: 429, message: "Trello API rate limit" }; }
      if (batchAPICall.status !== 200) {
        return { statusCode: batchAPICall.status, message: "BatchAPICall error" };
      }

      const [getListofCard, getCardDesc] = batchAPICall.data

      //Check that all Batch apis returned 200
      if (!getListofCard['200'] || !getCardDesc['200']) {
        return { statusCode: 400, message: "BatchAPICall subrequest error" };
      }

      const { id: newQueueId, name: queueName } = getListofCard['200']
      res.queueId = newQueueId
      res.queueName = queueName

      const { desc } = getCardDesc['200']
      if (desc !== '') res.ticketDesc = JSON.parse(desc)

      // Get the card's position in the current queue
      const getCardsOnList = await axios.get(
        `${TRELLO_ENDPOINT}/lists/${newQueueId}/cards?${tokenAndKeyParams}`)

      if (getCardsOnList.status === 429) { return { statusCode: 429, message: "Trello API rate limit" } }
      if (getCardsOnList.status !== 200) { return { statusCode: getCardsOnList.status, message: "getCardsOnList error" } }


      //If list isn't any of the special markers, check for position
      if (!(queueName.includes('[ALERT]') || queueName.includes('[DONE]') || queueName.includes('[MISSED]'))) {
        // To check position in queue
        const ticketsInQueue = getCardsOnList.data
        res.numberOfTicketsAhead = ticketsInQueue.findIndex(val => val.id === id)
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(res)
      };
    }
    /**
     * POST /ticket
     * - Creates a new ticket/card in queue with provided description
     * @param  {string} desc JSON string of user submitted info
     * @return {ticketId: string, ticketNumber: string}
     *  Returns the id and number of the created ticket
     */
    else if (httpMethod === 'POST') {
      const { desc } = JSON.parse(body)

      const name = desc.name ? `-${desc.name}` : ''
      const contact = desc.contact ? `-${desc.contact}` : ''
      const category = desc.category ? `-${desc.category}` : ''
      const descString = JSON.stringify(desc)

      const queue = queryStringParameters.queue
      if (queue) {

        // if contact is provided, search pending queue for duplicate number
        if (contact) {
          const getCardsOnPendingList = await axios.get(`${TRELLO_ENDPOINT}/lists/${queue}/cards?${tokenAndKeyParams}`)
          const ticketsInQueue = getCardsOnPendingList.data

          const match = ticketsInQueue.find(ticket => ticket.name.includes(contact))
          // If match found return that ticket info instead of creating a new one
          if (match) {
            return {
              statusCode: 200,
              body: JSON.stringify({ ticketId: match.id, ticketNumber: match.idShort })
            };
          }
        }

        const createCard = await axios.post(
          `${TRELLO_ENDPOINT}/cards?${tokenAndKeyParams}&idList=${queue}&desc=${descString}`)

        const { id, idShort } = createCard.data
        const cardName = `${idShort}${name}${contact}${category}`
        // Update newly created card with number{-name}{-contact}{-category} and desc
        await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&name=${cardName}`)

        return {
          statusCode: 200,
          body: JSON.stringify({ ticketId: id, ticketNumber: idShort })
        };
      }
    }
    /**
     * PUT /ticket
     * - Moves ticket to the bottom of the queue. Used for rejoining the queue
     * @param  {string} id The id of the ticket
     * @param  {string} queue The id of the queue
     * @return {statusCode: Number } Returns 200 if successful
     */
    else if (httpMethod === 'PUT') {
      const { id, queue } = queryStringParameters
      if (id && queue) {
        await axios.put(`${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${queue}&pos=bottom`)
      }
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
      };
    }
    /**
     * DELETE /ticket
     * - Moves ticket to the bottom of the queue. Used for rejoining the queue
     * @param  {string} id The id of the ticket
     * @return {statusCode: Number } Returns 200 if successful
     */
    else if (httpMethod === 'DELETE') {
      const id = queryStringParameters.id
      if (id) {
        await axios.delete(`${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}`)
      }
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
      };
    }
    return { statusCode: 404 }
  } catch (err) {
    console.log(err.response)
    return { statusCode: 400 };
  }


}