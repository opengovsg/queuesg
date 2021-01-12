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
import socketClient from "socket.io-client";
import queryString from 'query-string';
import axios from 'axios'
import { BACKEND_URL, TICKET_STATUS } from '../constants'

const Index = () => {
  const router = useRouter()
  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState()
  const [alert, setAlert] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')

  const [queueCode, setQueueCode] = useState()
  const [ticketId, setTicketId] = useState()

  useEffect(() => {
    console.log('useEffect');

    // Based on queue and ticket id, subscribe to the socket event
    // for that queue 
    const query = queryString.parse(location.search);
    if (query.ticket && query.queue) {
      console.log('ticket');
      console.log(query.ticket);

      var socket = socketClient(BACKEND_URL);

      socket.emit(`queue-trigger-update`, { queue: query.queue });
      socket.on(`queue-update-${query.queue}`, (data) => {
        const ticketsInQueue = data.tickets


        const index = ticketsInQueue.findIndex(val => val.ticketId === query.ticket)
        setNumberOfTicketsAhead(index)
        if (index > -1) {
          // Check if ticket is 'alerted' status
          if (ticketsInQueue[index].status === TICKET_STATUS.ALERTED) setAlert(true)
        } else {
          setAlert(false)
        }

        setQueueCode(query.queue)
        setTicketId(query.ticket)

        const timestamp = new Date().toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true })
        setLastUpdated(timestamp)
      });

    }
  }, [])

  const leaveQueue = async () => {
    try {
      const resp = axios.delete(`${BACKEND_URL}/api/queue/${queueCode}/${ticketId}`)
      console.log(resp.data);
    } catch (error) {
      console.log(error)
    }
  }

  const rejoinQueue = () => {
    router.push(`/queue?code=${queueCode}`)
  }

  const renderTicket = () => {
    // There are 4 possible ticket states
    // 1. Alerting - Ticket is called by admin
    if (alert && numberOfTicketsAhead === -1) {
      return <>
        <Box>
          <Heading fontSize="80px" fontWeight="bold" textAlign="center">It's your turn!</Heading>
        </Box>
        <Box fontWeight="semi" textAlign="center">
          <Text fontSize="32px" >
            Your queue number will be held for
            </Text>
          <Heading fontSize="40px" >3 mins</Heading>
        </Box>
      </>

    }
    // 2. Next - Ticket 1st in line
    else if (!alert && numberOfTicketsAhead === 0) {
      return <>
        <Box>
          <Heading fontSize="80px" fontWeight="bold" textAlign="center">You're next!</Heading>
        </Box>
        <Box fontWeight="semi" textAlign="center">
          <Text fontSize="32px" >
            Estimated waiting time
                </Text>
          <Heading fontSize="40px" >3 mins</Heading>
        </Box>
      </>
    }
    // 3. Line - Ticket is behind at least 1 person
    else if (!alert && numberOfTicketsAhead > 0) {
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
          <Heading fontSize="40px" >{3 + 3 * numberOfTicketsAhead} mins</Heading>
        </Box>
      </>

    }
    // 4. Expired/Removed - Ticket is not in the queue / queue doesnt exist
    else if (numberOfTicketsAhead === -1) {
      return <Box>
        <Heading fontSize="80px" fontWeight="bold" textAlign="center">Your queue number has expired</Heading>
      </Box>
    }
    // This is blank as the loading state
    else {
      return <></>
    }

  }



  return (
    <Container>
      <Main>

        <Heading fontSize="32px" fontWeight="semi" textAlign="center">Ticket #</Heading>


        {renderTicket()}


        <Flex direction="column" alignItems="center">
          {numberOfTicketsAhead > -1 ?
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={leaveQueue}
              disabled={!queueCode || !ticketId}
            >Leave the queue</Button> :
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={rejoinQueue}

              disabled={!queueCode}
            >Rejoin the queue</Button>}

        </Flex>
        <Flex direction="column" alignItems="center">
          <Text fontSize="20px" >This page updates automatically</Text>
          <Text fontSize="20px" >Last updated at {lastUpdated}</Text>
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
