import {
  Grid,
  GridItem,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import axios from 'axios'
import { API_ENDPOINT, QUEUE_TITLES } from '../constants'
import { useInterval } from '../utils'
import { CurrentlyServingQueue } from '../components/View/CurrentlyServingQueue'
import { MissedQueue } from '../components/View/MissedQueue'
import { ViewHeader } from '../components/View/ViewHeader'
import { ViewFooter } from '../components/View/ViewFooter'
import * as _ from 'lodash'

const Index = () => {

  const [audio, setAudio] = useState(null)
  const [board, setBoard] = useState(null)
  const [boardLists, setBoardLists] = useState({})
  const [queuePendingUrl, setQueuePendingUrl] = useState('')
  const [queueAlertIds, setqueueAlertIds] = useState([])
  const [ticketsAlerted, setTicketsAlerted] = useState([])
  const [queueMissedIds, setQueueMissedIds] = useState([])
  const [ticketsMissed, setTicketsMissed] = useState([])

  useEffect(async () => {
    const query = queryString.parse(location.search)
    await getBoard(query.board)
    await getBoardLists(query.board, query.from, query.to)
    setAudio(new Audio("/chime.mp3"))
  }, [])

  useEffect(async () => {
    await getQueues()
  }, [queueAlertIds, queueMissedIds])

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
        const board = await axios.get(`${API_ENDPOINT}/view?type=board&board=${boardId}`)
        setBoard(board.data)
      } catch (error) {
        console.error(error)
      }
    }
  }

  /**
   *  Gets a board with lists
   */
  const getBoardLists = async (boardId, from, to) => {
    if (boardId) {
      try {
        const boardLists = await axios.get(`${API_ENDPOINT}/view?type=boardlists&board=${boardId}`)
        let alertQueues = boardLists.data.filter(list => list.name.indexOf(QUEUE_TITLES.ALERTED) > -1).map(q => q.id)
        // Optionality to slice a range of queues to support large numbers on different screens
        if (from && _.isInteger(Number(from)) && to && _.isInteger(Number(to))) {
          alertQueues = alertQueues.slice(from, to)
        }
        setqueueAlertIds(alertQueues)

        const missedQueues = boardLists.data.filter(list => list.name.indexOf(QUEUE_TITLES.MISSED) > -1).map(q => q.id)
        setQueueMissedIds(missedQueues)

        const pendingQueue = boardLists.data.find(list => list.name.indexOf(QUEUE_TITLES.PENDING) > -1)
        if (pendingQueue) {
          setQueuePendingUrl(location.origin + `/queue?id=${pendingQueue.id}`)
        }

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
    if (queueAlertIds && queueMissedIds) {
      const tickets = await axios.get(`${API_ENDPOINT}/view?type=queues&queueAlertIds=${queueAlertIds.join(',')}&queueMissedIds=${queueMissedIds.join(',')}`)

      // Set the missed tickets
      // Combined all missed queues into 1
      const combinedMissed = _.flatMap(tickets.data.missed)
      setTicketsMissed(combinedMissed)

      const chime = hasNewAlerts(ticketsAlerted, tickets.data.alerted)
      if (audio && chime) {
        // audio is 
        try {
          audio.play();
        } catch (e) { }
      }
      //  Set the alerted tickets
      setTicketsAlerted(tickets.data.alerted)
    }
  }

  /**
   * Checks current alerts and compares it with latest. If latest has items not in current, trigger chime
   */
  const hasNewAlerts = (current, latest) => {
    const currentAlerts = _.flatMap(current).map(tx => `${tx.idList}${tx.name}`)
    const latestAlerts = _.flatMap(latest).map(tx => `${tx.idList}${tx.name}`)
    return _.intersection(currentAlerts, latestAlerts).length < latestAlerts.length
  }

  return (
    <>
      <Head>
        <title>Queue Status</title>
      </Head>
      <Grid
        h="100vh"
        templateColumns="repeat(7, 1fr)"
        templateRows="repeat(16, 1fr)"
      >
        <GridItem
          colSpan={7}
          rowSpan={1}
          bg="secondary.300"
        // height="120px"
        >
          <ViewHeader
            board={board}
          />
        </GridItem>
        <GridItem
          colSpan={5}
          rowSpan={14}
          bg="secondary.300"
        >
          <CurrentlyServingQueue
            listsOfTickets={ticketsAlerted}
            lists={boardLists}
          />
        </GridItem>
        <GridItem
          colSpan={2}
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
          rowSpan={1}
          bg="base"
        >
          <ViewFooter />
        </GridItem>
      </Grid>
    </>
  )
}

export default Index
