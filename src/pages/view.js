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
  const [queuePendingId, setQueuePendingId] = useState(null)
  const [queuePendingUrl, setQueuePendingUrl] = useState('')
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

  const refreshInterval = process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
  useInterval(() => {
    getQueues()
  }, refreshInterval)

  /**
   *  Gets a board data
   */
  const getBoard = async (boardId) => {
    if (boardId) {
      try {
        const board = await axios.get(`/.netlify/functions/view?type=board&board=${boardId}`)
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
    if (boardId) {
      try {
        const boardLists = await axios.get(`/.netlify/functions/view?type=boardlists&board=${boardId}`)
        boardLists.data.forEach(list => {
          if (list.name.indexOf(QUEUE_TITLES.ALERTED) > -1) {
            setQueueAlertedId(list.id)
          } else if (list.name.indexOf(QUEUE_TITLES.MISSED) > -1) {
            setQueueMissedId(list.id)
          } else if (list.name.indexOf(QUEUE_TITLES.PENDING) > -1) {
            setQueuePendingId(list.id)
            setQueuePendingUrl(location.origin + `/queue?id=${queuePendingId}`)
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
    if (queueAlertedId && queueMissedId) {
      const tickets = await axios.get(`/.netlify/functions/view?type=queues&queueAlertId=${queueAlertedId}&queueMissedId=${queueMissedId}`)
      setTicketsAlerted(tickets.data[0])
      setTicketsMissed(tickets.data[1])
    }
  }

  return (
    <Grid
      h="100vh"
      templateColumns="repeat(6, 1fr)"
      templateRows="repeat(18, 1fr)"
    >
      <GridItem
        colSpan={6}
        rowSpan={2}
        bg="secondary.300"
        height="120px"
      >
        <ViewHeader
          board={board}
        />
      </GridItem>
      <GridItem
        colSpan={3}
        rowSpan={14}
        bg="secondary.300"
      >
        <CurrentlyServingQueue
          tickets={ticketsAlerted}
        />
      </GridItem>
      <GridItem
        colSpan={3}
        rowSpan={14}
        bg="error.300"
      >
        <MissedQueue
          tickets={ticketsMissed}
          queuePendingUrl={queuePendingUrl}
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
