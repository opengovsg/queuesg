import {
  Text,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { useInterval } from '../utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string';
import axios from 'axios'
import { TICKET_STATUS } from '../constants'
import { NavBar } from '../components/Navbar'
import useTranslation from 'next-translate/useTranslation'
import { InQueue } from '../components/Ticket/InQueue'
import { NextInQueue } from '../components/Ticket/NextInQueue'
import { Alerted } from '../components/Ticket/Alerted'
import { Skipped } from '../components/Ticket/Skipped'
import { Served } from '../components/Ticket/Served'
import { LeaveModal } from '../components/Ticket/LeaveModal'

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
  const [displayTicketInfo, setDisplayTicketInfo] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  // Leave queue modal
  const { isOpen, onOpen, onClose } = useDisclosure()

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

      // To get card description
      const getCardDesc = await axios.get(`https://api.trello.com/1/cards/${ticket}`)
      const { desc } = getCardDesc.data
      if (desc !== '') {
        const ticketInfo = JSON.parse(desc)
        setDisplayTicketInfo(`${ticketInfo.name}, ${ticketInfo.contact}`)
      }

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



      // To check position in queue
      // Get list and all the cards in it to determind queue position
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
        openLeaveModal={onOpen}
        queueId={queueId}
        ticketId={ticketId}
      />
    }
    // 2. Served - Ticket is complete
    else if (ticketState === TICKET_STATUS.SERVED) {
      return <Served />
    }
    // 3. Missed - Ticket is in [MISSED] / not in the queue / queue doesnt exist
    else if (ticketState === TICKET_STATUS.MISSED || numberOfTicketsAhead === -1) {
      return <Skipped rejoinQueue={rejoinQueue} displayTicketInfo={displayTicketInfo} />
    }
    // 4. Next - Ticket 1st in line
    else if (numberOfTicketsAhead === 0) {
      return <NextInQueue
        waitingTime={waitingTime}
        openLeaveModal={onOpen}
        queueId={queueId}
        ticketId={ticketId}
        numberOfTicketsAhead={numberOfTicketsAhead}
      />
    }
    // 5. Line - Ticket is behind at least 1 person
    else if (numberOfTicketsAhead > 0) {
      return <InQueue
        waitingTime={waitingTime}
        openLeaveModal={onOpen}
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
      <LeaveModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} leaveQueue={leaveQueue} />
      <NavBar />
      <Main>
        <Flex direction="column" alignItems="center">
          <Heading
            textStyle="display2"
          >
            #{ticketNumber}
          </Heading>
          <Text textStyle="display3" fontWeight="400">
            {displayTicketInfo}
          </Text>
        </Flex>

        <Flex
          direction="column"
          alignItems="center"
        >
          <Flex
            direction="column"
            alignItems="center"
            w="360px">
            {renderTicket()}
          </Flex>
          <Flex
            direction="column"
            py="15px"
            w="360px"
          >
            <Text
              textStyle="body2"
              color="gray.500"
            >
              {t("last-updated-automatically-at")} {lastUpdated}
            </Text>
          </Flex>
        </Flex>
      </Main>
      <Footer />
    </Container>
  )
}

export default Index
