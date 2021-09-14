import {
  Grid,
  GridItem,
} from '@chakra-ui/react'
import Head from 'next/head'
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
  const [boardLists, setBoardLists] = useState({})
  const [queuePendingId, setQueuePendingId] = useState(null)
  const [queuePendingUrl, setQueuePendingUrl] = useState('')
  const [queueAlertIds, setqueueAlertIds] = useState([])
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
  }, [queueAlertIds, queueMissedId])

  const refreshInterval = 10000 //process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
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
            setqueueAlertIds(listIds => [...listIds, list.id])
          } else if (list.name.indexOf(QUEUE_TITLES.MISSED) > -1) {
            setQueueMissedId(list.id)
          } else if (list.name.indexOf(QUEUE_TITLES.PENDING) > -1) {
            setQueuePendingId(list.id)
            setQueuePendingUrl(location.origin + `/queue?id=${queuePendingId}`)
          }
        })
        
        const lists = {}
        boardLists.data.forEach(list => {
          lists[list.id] = list
        })
        setBoardLists(lists)
      } catch (error) {
        console.error(error)
      }
    }
  }

  /**
   * Gets Queues
   */
  const getQueues = async () => {
    if (queueAlertIds && queueMissedId) {
      const tickets = await axios.get(`/.netlify/functions/view?type=queues&queueAlertIds=${queueAlertIds.join(',')}&queueMissedId=${queueMissedId}`)
      
      // Set the missed tickets
      setTicketsMissed(tickets.data.missed[queueMissedId])

      //  Set the alerted tickets
      setTicketsAlerted(tickets.data.alerted)
    }
  }

  return (
    <>
      <Head>
        <title>Queue Status</title>
      </Head>
      <Grid
        h="100vh"
        templateColumns="repeat(7, 1fr)"
        templateRows="repeat(18, 1fr)"
      >
        <GridItem
          colSpan={7}
          rowSpan={2}
          bg="secondary.300"
          height="120px"
        >
          <ViewHeader
            board={board}
          />
        </GridItem>
        <GridItem
          colSpan={4}
          rowSpan={14}
          bg="secondary.300"
        >
          <CurrentlyServingQueue
            listsOfTickets={ticketsAlerted}
            lists={boardLists}
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
          colSpan={7}
          rowSpan={2}
          bg="base"
        >
          <ViewFooter />
        </GridItem>
      </Grid>
    </>
  )
}

export default Index
