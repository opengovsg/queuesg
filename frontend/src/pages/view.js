import {
  Center,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import axios from 'axios'
import { QUEUE_TITLES } from '../constants'
import { useInterval } from '../utils'
import { CurrentlyServingQueue } from '../components/View/CurrentlyServingQueue'
import { MissedQueue } from '../components/View/MissedQueue'
import { ViewHeader } from '../components/View/ViewHeader'
import { ViewFooter } from '../components/View/ViewFooter'

const Index = () => {
  const [board, setBoard] = useState(null) 
  const [queueAlertedId, setQueueAlertedId] = useState(null)
  const [ticketsAlerted, setTicketsAlerted] = useState([])
  const [queueMissedId, setQueueMissedId] = useState(null)
  const [ticketsMissed, setTicketsMissed] = useState([])

  useEffect(async () => {
    const query = queryString.parse(location.search)
    await getBoard(query.board)
    await getBoardLists(query.board)
  }, [])

  useEffect(async () => {
    await getQueues()
  }, [queueAlertedId, queueMissedId])

  const refreshInterval = process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 3000
  useInterval(() => {
    getQueues()
  }, refreshInterval)

  /**
   *  Gets a board data
   */
  const getBoard = async (boardId) => {
    if(boardId) {
      try {
        const board = await axios.get(`https://api.trello.com/1/boards/${boardId}`)
        setBoard(board.data)
      } catch (error) {
        console.error(error)
      }
    }
  }

  /**
   *  Gets a board with lists
   */
  const getBoardLists = async (boardId) => {
    if(boardId) {
      try {
        const boardLists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`)
        
        boardLists.data.forEach(list => {
          if(list.name.indexOf(QUEUE_TITLES.ALERTED) > -1) {
            setQueueAlertedId(list.id)
          } else if(list.name.indexOf(QUEUE_TITLES.MISSED) > -1) {
            setQueueMissedId(list.id)
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  /**
   * Gets Queues
   */
  const getQueues = async () => {
    if(queueAlertedId) {
      const tickets = await axios.get(`https://api.trello.com/1/lists/${queueAlertedId}/cards`)
      setTicketsAlerted(tickets.data)
    }
    if(queueMissedId) {
      const tickets = await axios.get(`https://api.trello.com/1/lists/${queueMissedId}/cards`)
      setTicketsMissed(tickets.data)
    }
  }

  return (
    <Grid
      h="100vh"
      templateColumns="repeat(6, 1fr)"
      templateRows="repeat(20, 1fr)"
      gap={0}
      >
      <GridItem
        colSpan={6}
        rowSpan={2}
        bg="secondary.300"
        >
        <ViewHeader
          board={board}
          />
      </GridItem>
      <GridItem
        colSpan={3}
        rowSpan={16}
        bg="secondary.300"
        >
        <CurrentlyServingQueue
          tickets={ticketsAlerted}
          />
      </GridItem>
      <GridItem
        colSpan={3}
        rowSpan={16}
        bg="error.300"
        >
        <MissedQueue
          tickets={ticketsMissed}
          />
      </GridItem>
      <GridItem
        colSpan={6}
        rowSpan={2}
        bg="base"
        >
        <ViewFooter />
      </GridItem>
    </Grid>
  )
}

export default Index
