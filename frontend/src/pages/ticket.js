import {
  Text,
  Code,
  Flex,
  Heading,
  Box,
  Button
} from '@chakra-ui/react'
import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect, useState } from 'react'
import socketClient from "socket.io-client";
import queryString from 'query-string';

const Index = () => {

  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState(0)


  useEffect(() => {
    console.log('useEffect');

    // Based on queue and ticket id, subscribe to the socket event
    // for that queue 
    const query = queryString.parse(location.search);
    if (query.ticket && query.queue) {
      console.log('ticket');
      console.log(query.ticket);

      var socket = socketClient('http://localhost:4000');

      socket.emit(`queue-trigger-update`, { queue: query.queue });
      socket.on(`queue-update-${query.queue}`, (data) => {
        const ticketsInQueue = data.tickets
        console.log(ticketsInQueue);

        // const pos = ticketsInQueue.findIndex(val => val === query.ticket)
        // setNumberOfTicketsAhead(pos)
      });

    }
  }, [])

  return (
    <Container>
      <Main
        margin="0"
        padding="0"
        height="100vh"
        justifyContent="space-evenly">
        {numberOfTicketsAhead > -1 && <>
          <Heading fontSize="32px" fontWeight="semi" textAlign="center">Ticket #</Heading>
          {/* {numberOfTicketsAhead === 0 &&
            <>
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
          } */}

          {numberOfTicketsAhead === 0 &&
            <>
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

          {numberOfTicketsAhead > 0 &&
            <>
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

        </>}

        <Flex direction="column" alignItems="center">
          <Button width="180px" colorScheme="purple" size="lg" variant="outline">Leave the queue</Button>

        </Flex>
        <Flex direction="column" alignItems="center">
          <Text fontSize="20px" >This page updates automatically</Text>
          <Text fontSize="20px" >Last updated at 10.20am</Text>
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
