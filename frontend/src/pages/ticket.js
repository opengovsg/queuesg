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

const Index = () => {
  const router = useRouter()
  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState()

  //States: undefined, PENDING, ALERTED, EXPIRED
  const [ticketState, setTicketState] = useState()

  const [lastUpdated, setLastUpdated] = useState('')

  const [ticketId, setTicketId] = useState()
  const [queueId, setQueueId] = useState()
  const [displayQueueInfo, setDisplayQueueInfo] = useState('')

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.ticket && query.queue) {
      getTicketStatus(query.ticket)
      const interval = setInterval(() => {
        getTicketStatus(query.ticket)
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [])



  const getTicketStatus = async (ticket) => {
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
        setTicketState('ALERTED')
        return
      }
      else if (queueName.includes('[DONE]')) {
        setTicketState('EXPIRED')
        return
      } else {
        setTicketState('PENDING')
        setDisplayQueueInfo(queueName)
      }

      // To check position in queue
      // Get list and all the cards in it to determind queue position
      const getCardsOnList = await axios.get(`https://api.trello.com/1/lists/${queueId}/cards`)
      const ticketsInQueue = getCardsOnList.data

      //Reverse list as trello queue front at bottom makes more sense
      ticketsInQueue.reverse()
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
    // 1. Alerting - Ticket is called by admin
    if (ticketState === 'ALERTED') {
      console.log('render alert');
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
    // 2. Expired/Removed - Ticket is in [DONE] / not in the queue / queue doesnt exist
    else if (ticketState === 'EXPIRED' || numberOfTicketsAhead === -1) {
      console.log('render expired');
      return <Box>
        <Heading fontSize="80px" fontWeight="bold" textAlign="center">Your queue number has expired</Heading>
      </Box>
    }
    // 3. Next - Ticket 1st in line
    else if (numberOfTicketsAhead === 0) {
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
    // 4. Line - Ticket is behind at least 1 person
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
          <Heading fontSize="40px" >{3 + 3 * numberOfTicketsAhead} mins</Heading>
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
          {numberOfTicketsAhead > -1 ?
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={leaveQueue}
              disabled={!queueId || !ticketId}
            >Leave the queue</Button> :
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={rejoinQueue}
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
