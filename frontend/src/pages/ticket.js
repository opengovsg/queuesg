import {
  Text,
  Flex,
  Heading,
  Box,
  Button
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string';
import axios from 'axios'
import { TICKET_STATUS } from '../constants'
import { useInterval } from '../utils'

const Index = () => {
  const router = useRouter()
  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState()

  const [refreshEnabled, setRefreshEnabled] = useState(true)

  const [ticketState, setTicketState] = useState()
  const [lastUpdated, setLastUpdated] = useState('')

  const [ticketId, setTicketId] = useState()
  const [queueId, setQueueId] = useState()
  const [displayQueueInfo, setDisplayQueueInfo] = useState('')


  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.ticket && query.queue) {
      getTicketStatus(query.ticket)

    }
  }, [])

  useInterval(() => {
    if (refreshEnabled) getTicketStatus(ticketId)
  }, 5000);


  const getTicketStatus = async (ticket) => {
    console.log('getTicketStatus');
    try {
      // To make sure ticket is valid
      // Get the list (queue), ticket (card) belongs to on the trello api
      const getListofCard = await axios.get(`https://api.trello.com/1/cards/${ticket}/list?fields=id,name`)
      const { id: queueId, name: queueName } = getListofCard.data
      setQueueId(queueId)
      setTicketId(ticket)


      // Hack: Check whether to alert the user based on if the 
      // queue name contains the word 'alert'
      if (queueName.includes('[ALERT]')) {
        setTicketState(TICKET_STATUS.ALERTED)
        return
      }
      else if (queueName.includes('[DONE]')) {
        setTicketState(TICKET_STATUS.SERVED)
        setRefreshEnabled(false)
        return
      } else if (queueName.includes('[MISSED]')) {
        setTicketState(TICKET_STATUS.MISSED)
        setRefreshEnabled(false)
        return
      } else {
        setTicketState(TICKET_STATUS.PENDING)
        setDisplayQueueInfo(queueName)
      }

      // To check position in queue
      // Get list and all the cards in it to determind queue position
      const getCardsOnList = await axios.get(`https://api.trello.com/1/lists/${queueId}/cards`)
      const ticketsInQueue = getCardsOnList.data

      const index = ticketsInQueue.findIndex(val => val.id === ticket)
      setNumberOfTicketsAhead(index)
      console.log('id:', ticket);
      console.log('queueName: ', queueName);
      console.log('queue pos:', index);

      // Update timestamp
      const timestamp = new Date().toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true })
      setLastUpdated(timestamp)
    } catch (err) {
      console.log(err);
    }
  }

  const leaveQueue = async () => {
    try {
      axios.delete(`/.netlify/functions/ticket?id=${ticketId}`)
      router.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const rejoinQueue = () => {
    const query = queryString.parse(location.search);
    if (query.queue) {
      router.push(`/queue?id=${query.queue}`)
    }
  }



  const renderTicket = () => {
    // There are 4 possible ticket states
    // 1. Alerted - Ticket is called by admin
    if (ticketState === TICKET_STATUS.ALERTED) {
      return <>
        <Box>
          <Heading fontSize="64px" fontWeight="bold" textAlign="center">It's your turn!</Heading>
        </Box>
        <Box fontWeight="semi" textAlign="center">
          <Text fontSize="32px" >
            Your queue number will be held for
            </Text>
          <Heading fontSize="40px" >3 mins</Heading>
        </Box>
      </>

    }
    // 2. Served - Ticket is complete
    else if (ticketState === TICKET_STATUS.SERVED) {
      return <Box>
        <Heading fontSize="64px" fontWeight="bold" textAlign="center">
          Thanks for coming!
        </Heading>
      </Box>
    }
    // 3. Missed - Ticket is in [MISSED] / not in the queue / queue doesnt exist
    else if (ticketState === TICKET_STATUS.MISSED || numberOfTicketsAhead === -1) {
      return <Box>
        <Heading fontSize="64px" fontWeight="bold" textAlign="center">
          Sorry. Your queue number has been skipped.
        </Heading>
      </Box>
    }
    // 4. Next - Ticket 1st in line
    else if (numberOfTicketsAhead === 0) {
      return <>
        <Box>
          <Heading fontSize="80px" fontWeight="bold" textAlign="center">You're next!</Heading>
        </Box>
      </>
    }
    // 5. Line - Ticket is behind at least 1 person
    else if (numberOfTicketsAhead > 0) {
      return <>
        <Box>
          <Heading fontSize="32px" textAlign="center">There's</Heading>
          <Heading fontSize="72px" textAlign="center">{numberOfTicketsAhead}</Heading>
          <Heading fontSize="32px" textAlign="center">{numberOfTicketsAhead === 1 ? 'person' : 'people'} ahead of you</Heading>
        </Box>
        <Box fontWeight="semi" textAlign="center">
          <Text fontSize="32px" >
            Estimated waiting time
                </Text>
          <Heading fontSize="40px" >{3 * numberOfTicketsAhead} mins</Heading>
        </Box>
      </>

    }
    // This is blank as the loading state
    else {
      return <></>
    }

  }

  return (
    <Container>
      <Main>
        <Heading fontSize="32px" fontWeight="semi" textAlign="center">{displayQueueInfo}</Heading>

        {renderTicket()}

        <Flex direction="column" alignItems="center">
          {ticketState === TICKET_STATUS.MISSED && <Button width="180px" colorScheme="purple" size="lg" variant="outline"
            onClick={rejoinQueue}
          >Rejoin the queue</Button>}
          {ticketState === TICKET_STATUS.PENDING && numberOfTicketsAhead > -1 &&
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={leaveQueue}
              disabled={!queueId || !ticketId}
            >Leave the queue</Button>}
        </Flex>

        <Flex direction="column" alignItems="center">
          <Text fontSize="20px" >This page updates automatically every 10 seconds</Text>
          <Text fontSize="20px" >Last updated at {lastUpdated}</Text>
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
