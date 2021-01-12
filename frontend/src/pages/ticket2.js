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
  // const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState()
  // const [alert, setAlert] = useState(false)
  // const [lastUpdated, setLastUpdated] = useState('')

  // const [queueCode, setQueueCode] = useState()
  // const [ticketId, setTicketId] = useState()

  useEffect(() => {
    console.log('useEffect');

    // Based on queue and ticket id, subscribe to the socket event
    // for that queue 
    const query = queryString.parse(location.search);
    if (query.ticket) {
      console.log('ticket');
      console.log(query.ticket);

      axios.get(`https://api.trello.com/1/cards/${query.ticket}/list?fields=id,name`)
        .then((resp) => {
          console.log(resp.data);
        }).catch((err) => { console.log(err) })

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





  return (
    <Container>
      <Main>

        <Heading fontSize="32px" fontWeight="semi" textAlign="center">Ticket #</Heading>




        {/* <Flex direction="column" alignItems="center">
          {numberOfTicketsAhead > -1 ?
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={leaveQueue}
              disabled={!queueCode || !ticketId}
            >Leave the queue</Button> :
            <Button width="180px" colorScheme="purple" size="lg" variant="outline"
              onClick={rejoinQueue}

              disabled={!queueCode}
            >Rejoin the queue</Button>}

        </Flex> */}
        <Flex direction="column" alignItems="center">
          <Text fontSize="20px" >This page updates automatically</Text>
          {/* <Text fontSize="20px" >Last updated at {lastUpdated}</Text> */}
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
