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

const Index = () => {
  const [queueAlertedId, setQueueAlertedId] = useState(null)
  const [ticketsAlerted, setTicketsAlerted] = useState([])
  const [queueMissedId, setQueueMissedId] = useState(null)
  const [ticketsMissed, setTicketsMissed] = useState([])

  useEffect(async () => {
    const query = queryString.parse(location.search)
    await getBoard(query.board)
  }, [])

  useEffect(async () => {
    await getQueues()
  }, [queueAlertedId, queueMissedId])

  const refreshInterval = process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 3000
  useInterval(() => {
    getQueues()
  }, refreshInterval);

  /**
   *  Gets a board with list
   */
  const getBoard = async (boardId) => {
    if(boardId) {
      const boardLists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`)
      
      boardLists.data.forEach(list => {
        if(list.name.indexOf(QUEUE_TITLES.ALERTED) > -1) {
          setQueueAlertedId(list.id)
        } else if(list.name.indexOf(QUEUE_TITLES.MISSED) > -1) {
          setQueueMissedId(list.id)
        }
      })
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
      templateColumns="repeat(5, 1fr)"
      templateRows="repeat(6, 1fr)"
      gap={6}
      >
      <GridItem colSpan={3} rowSpan={5} bg="#C6F6D5">
        <CurrentlyServingQueue
          tickets={ticketsAlerted}
          />
      </GridItem>
      <GridItem colSpan={2} rowSpan={5} bg="#FFF5F5">
        <MissedQueue
          tickets={ticketsMissed}
          />
      </GridItem>
      <GridItem colSpan={5} rowSpan={1} bg="#fafafa">
        <Center
          h="100%"
          >
          <Heading size="xl">Your queue number may not be called in sequence</Heading>
        </Center>
      </GridItem>
    </Grid>
  )
}

export default Index
