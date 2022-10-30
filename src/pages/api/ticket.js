const axios = require('axios')
const { parse: parseUrl } = require('url')

/**
 * Function for Ticket / Card Trello API calls
 */
export default async function handler (req, res) {
  try {
    const { method: httpMethod, url, body } = req
    const { query: queryStringParameters } = parseUrl(url, true)
    const { TRELLO_KEY, TRELLO_TOKEN, IS_PUBLIC_BOARD, TRELLO_ENDPOINT = 'https://api.trello.com/1' } = process.env
    const tokenAndKeyParams = IS_PUBLIC_BOARD === 'true' ? '' : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`

    /**
     * GET /ticket
     * - Retrieves info about a ticket and its position in queue
     *   Experimental GET flow to fetch status in a single API call.
     *   Lays the groundwork for adding a caching layer that can store this call
     * @param  {string} id The id of the ticket
     * @param  {string} board The board id
     * @return {queueId: string, queueName: string, ticketId: string, ticketDesc: string, numberOfTicketsAhead: Number}
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === 'GET') {
      const { id, board: boardId } = queryStringParameters

      // Get the card's position in the current queue
      const getBoardInfo = await axios.get(`${TRELLO_ENDPOINT}/boards/${boardId}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`);
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

      res.json({
        queueId: card.idList,
        queueName: card.queueName,
        ticketNumber: card.idShort,
        ticketId: id,
        ticketDesc: JSON.parse(card.desc),
        numberOfTicketsAhead: card.numberOfTicketsAhead,
      })

    }
    /**
     * POST /ticket
     * - Creates a new ticket/card in queue with provided description
     * @param  {string} desc JSON string of user submitted info
     * @return {ticketId: string, ticketNumber: string}
     *  Returns the id and number of the created ticket
     */
    else if (httpMethod === 'POST') {
      const { desc } = body

      const prefix = desc.ticketPrefix ? desc.ticketPrefix : ''
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
            res.json({ ticketId: match.id, ticketNumber: match.idShort })
            return
          }
        }

        const createCard = await axios.post(
          `${TRELLO_ENDPOINT}/cards?${tokenAndKeyParams}&idList=${queue}&desc=${encodeURIComponent(descString)}`)

        const { id, idShort } = createCard.data
        const cardName = `${prefix}${idShort}${name}${contact}${category}`
        // Update newly created card with number{-name}{-contact}{-category} and desc
        await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&name=${encodeURIComponent(cardName)}`)

        res.json({ ticketId: id, ticketNumber: idShort })
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
      res.json()
    }
    /**
     * DELETE /ticket
     * - Moves ticket to the bottom of the queue. Used for rejoining the queue
     * @param  {string} id The id of the ticket
     * @return {statusCode: Number } Returns 200 if successful
     */
    else if (httpMethod === 'DELETE') {
      const { id, boardId } = queryStringParameters

      if (id && boardId) {
        const getBoardInfo = await axios.get(`${TRELLO_ENDPOINT}/boards/${boardId}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`);

        const { lists } = getBoardInfo.data
        const leftList = lists.find(l => l.name.includes('[LEFT]'))

        // A [LEFT] list exists move the users ticket to the bottom of it
        if (leftList && leftList.id) {
          await axios.put(`${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${leftList.id}&pos=bottom`)
        }
        // Otherwise delete it completely
        else {
          await axios.delete(`${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}`)
        }
        res.json()
      }
      else {
        res.status(400).json({
          message: 'Missing ticket or board id'
        })
      }
    } 
    else {
      res.status(404).json()
    }
  } catch (err) {
    console.log(err.response)
    res.status(400).json()
  }
}
