import {
  Heading,
  Flex,
  Text,
  Box,
  IconButton
} from '@chakra-ui/react'
import { MinusIcon, BellIcon } from '@chakra-ui/icons'
import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string';
import { TICKET_STATUS } from '../../constants'
import { AdminNav } from '../../components/AdminNav'
const Index = () => {

  const router = useRouter()

  const [queueCode, setQueueCode] = useState('')

  const [ticketsInQueue, setTicketsInQueue] = useState([
    { key: "-MQomhL21oWh94BcNRQP", createdAt: 1610424702036, status: "alerted" },
    { key: "-MQomhL21oWh94BcNRQP", createdAt: 1610424702036, status: "expired" },
    { key: "-MQoaPuUFalJnylckyqv", createdAt: 1610421480818, status: "pending" }
  ])

  useEffect(() => {
    console.log('useEffect');
    const query = queryString.parse(location.search);
    // Join queue with code, server will return new ticket id
    if (query.queue) {
      // axios.get(`${BACKEND_URL}/api/queue/${query.queue}/`)
      //   .then((resp) => {
      //     setTicketsInQueue(resp.data.tickets)
      //     setQueueCode(query.queue)
      //   }).catch((err) => {
      //     if (err.response && err.response.status === 404) {
      //       router.push(`/`)
      //     }
      //   })

    }
  }, [])
  return (
    <Container>

      <Main>
        <AdminNav queue={queueCode} />
        <Flex direction="column" alignItems="center">
          <Heading fontSize="20px" fontWeight="bold" textAlign="start">Queue</Heading>
          <Flex direction="column" alignItems="center" bgColor={'white'} width="400px">
            {ticketsInQueue.map((ticket, index) => {
              return (
                <Flex
                  direction="row" alignItems="center" justifyContent="space-between"
                  width="100%" paddingX="30px" height="60px" bgColor={'red'}>
                  <Text>{index + 1}</Text>
                  {ticket.status === TICKET_STATUS.EXPIRED && <Text>Expired</Text>}
                  <Box>
                    <IconButton aria-label="Search database" icon={<MinusIcon />} variant="ghost" />
                    <IconButton aria-label="Search database" icon={<BellIcon />} variant="ghost" />
                  </Box>
                </Flex>
              )

            })}
          </Flex>

        </Flex>
      </Main>
    </Container>
  )
}

export default Index
