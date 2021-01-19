import {
  Center,
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
import { NavBar } from '../components/Navbar'
import useTranslation from 'next-translate/useTranslation'
import { InQueue } from '../components/Ticket/InQueue'
import { Alerted } from '../components/Ticket/Alerted'

const Index = () => {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const [refreshEnabled, setRefreshEnabled] = useState(true)
  
  const [waitingTime, setWaitingTime] = useState(3)
  
  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState()
  const [displayQueueInfo, setDisplayQueueInfo] = useState('')

  const [ticketState, setTicketState] = useState()
  const [ticketId, setTicketId] = useState()
  const [queueId, setQueueId] = useState()
  const [ticketNumber, setTicketNumber] = useState()
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.ticket && query.queue && query.ticketNumber) {
      getTicketStatus(query.ticket)
      setTicketNumber(query.ticketNumber)
    }
  }, [])

  const refreshInterval = process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
  useInterval(() => {
    if (refreshEnabled) getTicketStatus(ticketId)
  }, refreshInterval);


  const getTicketStatus = async (ticket) => {
    console.log('getTicketStatus');
    try {
      // To make sure ticket is valid
      // Get the list (queue), ticket (card) belongs to on the trello api
      const getListofCard = await axios.get(`https://api.trello.com/1/cards/${ticket}/list?fields=id,name`)
      const { id: queueId, name: queueName } = getListofCard.data
      setQueueId(queueId)
      setTicketId(ticket)

      // // Update timestamp
      const timestamp = new Date().toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true })
      setLastUpdated(timestamp)

      // Hack: Check whether to alert the user based on if the 
      // queue name contains the word 'alert'
      if (queueName.includes('[ALERT]')) {
        setTicketState('alerted')//USING THE CONSTANT BREAKS I18N? IDK HOW
        return
      }
      else if (queueName.includes('[DONE]')) {
        setTicketState('served')
        // setRefreshEnabled(false)
        return
      } else if (queueName.includes('[MISSED]')) {
        setTicketState('missed')
        // setRefreshEnabled(false)
        return
      } else {
        setTicketState('pending')
        setDisplayQueueInfo(queueName)
      }

      // // To check position in queue
      // // Get list and all the cards in it to determind queue position
      const getCardsOnList = await axios.get(`https://api.trello.com/1/lists/${queueId}/cards`)
      const ticketsInQueue = getCardsOnList.data

      const index = ticketsInQueue.findIndex(val => val.id === ticket)
      setNumberOfTicketsAhead(index)
      console.log('id:', ticket);
      console.log('queueName: ', queueName);
      console.log('queue pos:', index);
    } catch (err) {
      console.log(err);
    }
  }

  const leaveQueue = async () => {
    try {
      axios.delete(`/.netlify/functions/ticket?id=${ticketId}`)
      router.push(`/`)
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
      return <Alerted
        waitingTime={waitingTime}
        leaveQueue={leaveQueue}
        queueId={queueId}
        ticketId={ticketId}
        />
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
          <Heading fontSize="80px" fontWeight="bold" textAlign="center" color="#F8BD36">You're next!</Heading>
        </Box>
      </>
    }
    // 5. Line - Ticket is behind at least 1 person
    else if (numberOfTicketsAhead > 0) {
      return <InQueue
        waitingTime={waitingTime}
        leaveQueue={leaveQueue}
        queueId={queueId}
        ticketId={ticketId}
        numberOfTicketsAhead={numberOfTicketsAhead}
      />
    }
    // This is blank as the loading state
    else {
      return <></>
    }

  }

  return (
    <Container>
      <NavBar />
      <Main>
        <Flex direction="column" alignItems="center">
          <Heading
            textStyle="display2"
            >
            #{ticketNumber}
          </Heading>
        </Flex>

        <Flex
          direction="column"
          alignItems="center"
          >
          <Flex
            direction="column"
            alignItems="center"
            w="350px">
            {renderTicket()}
          </Flex>
        </Flex>

        <Flex
          direction="column"
          alignItems="center"
          >
          {ticketState === TICKET_STATUS.MISSED && <Button width="180px" colorScheme="purple" size="lg" variant="outline"
            onClick={rejoinQueue}
          >Rejoin the queue</Button>}
        </Flex>

        <Flex
          direction="column"
          px="15px"
          >
          <Text
            textStyle="body2"
            color="gray.500"
            >
            { t("last-updated-automatically-at") } {lastUpdated}
          </Text>
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
