import { useEffect, useState } from 'react'
import {
  Text,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import queryString from 'query-string'
import axios from 'axios'
import { useCookies } from 'react-cookie'

import { useInterval } from '../utils'
import { COOKIE_MAX_AGE, NETLIFY_FN_ENDPOINT, TICKET_STATUS } from '../constants'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/Navbar'
import { InQueue } from '../components/Ticket/InQueue'
import { NextInQueue } from '../components/Ticket/NextInQueue'
import { Alerted } from '../components/Ticket/Alerted'
import { Skipped } from '../components/Ticket/Skipped'
import { Served } from '../components/Ticket/Served'
import { NotFound } from '../components/Ticket/NotFound'
import { LeaveModal } from '../components/Ticket/LeaveModal'

const Index = () => {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const [refreshEnabled, setRefreshEnabled] = useState(true)

  const [waitTimePerTicket, setWaitTimePerTicket] = useState(3)
  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState()


  const [boardId, setBoardId] = useState()
  const [ticketState, setTicketState] = useState()
  const [ticketId, setTicketId] = useState()
  const [queueId, setQueueId] = useState()
  const [queueName, setQueueName] = useState()
  const [ticketNumber, setTicketNumber] = useState()
  const [displayTicketInfo, setDisplayTicketInfo] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [feedbackLink, setFeedbackLink] = useState()

  const [cookies, setCookie, removeCookie] = useCookies(['ticket']);

  // Leave queue modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.ticket && query.queue && query.ticketNumber && query.board) {
      setTicketId(query.ticket)
      setBoardId(query.board)
      getTicketStatus(query.ticket, query.board)
      setTicketNumber(query.ticketNumber)

      // Save ticket info to cookie
      setCookie('ticket', {
        queue: query.queue,
        ticket: query.ticket,
        ticketNumber: query.ticketNumber
      }, { maxAge: COOKIE_MAX_AGE })
      //Save feedback link
      if (query.feedback) setFeedbackLink(query.feedback)

      //Save wait time per ticket
      if (query.waitTimePerTicket && !isNaN(Number(query.waitTimePerTicket))) setWaitTimePerTicket(query.waitTimePerTicket)
    }
  }, [])

  const refreshInterval = process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
  useInterval(() => {
    if (refreshEnabled) getTicketStatus(ticketId, boardId)
  }, refreshInterval);


  const getTicketStatus = async (ticket, board) => {
    try {
      const getTicket = await axios.get(`${NETLIFY_FN_ENDPOINT}/ticket?id=${ticket}&board=${board}`)
      const { queueId, queueName, ticketDesc, numberOfTicketsAhead } = getTicket.data
      //Update queueId in case ticket has been shifted
      setQueueId(queueId)

      if (ticketDesc !== '') {
        setDisplayTicketInfo(`${ticketDesc.name ? ticketDesc.name : ''} ${ticketDesc.contact ? ticketDesc.contact : ''}`)
      }
      setNumberOfTicketsAhead(numberOfTicketsAhead)
      // // Update timestamp
      const timestamp = new Date().toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true })
      setLastUpdated(timestamp)

      // Hack: Check whether to alert the user based on if the 
      // queue name contains the word 'alert'
      // USING THE CONSTANT BREAKS I18N? IDK HOW
      if (queueName.includes('[ALERT]')) {
        setQueueName(queueName.replace('[ALERT]', '').trim())
        setTicketState('alerted')
      }
      else if (queueName.includes('[DONE]')) {
        setTicketState('served')
        setRefreshEnabled(false)
        removeCookie('ticket') // Remove cookie so they can join the queue again
      }
      else if (queueName.includes('[MISSED]')) {
        setTicketState('missed')
      }
      else if (numberOfTicketsAhead === -1) {
        throw new Error('Ticket not found')
      }
      else {
        setTicketState('pending')
      }
    } catch (err) {
      // Check if err is status 429 i.e. Trello rate limit
      // if so do nothing, will retry on the next interval
      if (err.response && err.response.status === 429) {
        console.log('429 detected');
        return
      }
      setTicketState('error')
      setRefreshEnabled(false)
      removeCookie('ticket') // Remove cookie so they can join the queue again
    }
  }

  const leaveQueue = async () => {
    try {
      axios.delete(`${NETLIFY_FN_ENDPOINT}/ticket?id=${ticketId}`)
      removeCookie('ticket')
      router.push(`/`)
    } catch (error) {
      console.log(error)
    }
  }

  const rejoinQueue = async () => {
    const query = queryString.parse(location.search);
    if (query.queue) {
      // NOTE: Using query string queue as that is the initial queue not the current queue
      await axios.put(`${NETLIFY_FN_ENDPOINT}/ticket?id=${ticketId}&queue=${query.queue}`)
      getTicketStatus(query.ticket, query.queue)
    }
  }

  const renderTicket = () => {
    // There are 4 possible ticket states
    // 1. Alerted - Ticket is called by admin
    if (ticketState === TICKET_STATUS.ALERTED) {
      return <Alerted
        waitingTime={waitTimePerTicket}
        openLeaveModal={onOpen}
        queueId={queueId}
        queueName={queueName}
        ticketId={ticketId}
      />
    }
    // 2. Served - Ticket is complete
    else if (ticketState === TICKET_STATUS.SERVED) {
      return <Served feedbackLink={feedbackLink} />
    }
    // 3. Missed - Ticket is in [MISSED] / not in the queue / queue doesnt exist
    else if (ticketState === TICKET_STATUS.MISSED) {
      return <Skipped rejoinQueue={rejoinQueue} />
    }
    else if (ticketState === TICKET_STATUS.ERROR || numberOfTicketsAhead === -1) {
      return <NotFound />
    }
    // 4. Next - Ticket 1st in line
    else if (numberOfTicketsAhead === 0) {
      return <NextInQueue
        waitingTime={waitTimePerTicket}
        openLeaveModal={onOpen}
        queueId={queueId}
        ticketId={ticketId}
        numberOfTicketsAhead={numberOfTicketsAhead}
      />
    }
    // 5. Line - Ticket is behind at least 1 person
    else if (numberOfTicketsAhead > 0) {
      return <InQueue
        waitingTime={waitTimePerTicket}
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
    <>
      <Head>
        <title>QueueUp SG</title>
      </Head>
      <Container>
        <LeaveModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} leaveQueue={leaveQueue} />
        <NavBar />
        <Main>
          {ticketState != TICKET_STATUS.ERROR && <Flex direction="column" alignItems="center">
            <Heading textStyle="heading1" fontSize="1.5rem">Queue Number</Heading>
            <Heading mt="8px" textStyle="heading1" fontSize="3.5rem" letterSpacing="0.2rem">{ticketNumber}</Heading>
            <Text mt="24px" textStyle="body2" fontSize="1.5rem" letterSpacing="0.1rem">
              {displayTicketInfo}
            </Text>
          </Flex>}

          <Flex
            direction="column"
            alignItems="center"
          >
            <Flex
              direction="column"
              alignItems="center"
              w="360px"
              maxW="100%"
            >
              {renderTicket()}
            </Flex>
            <Flex
              direction="column"
              py={4}
              w="360px"
              maxW="100%"
            >
              <Text
                textAlign="center"
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
    </>
  )
}

export default Index
