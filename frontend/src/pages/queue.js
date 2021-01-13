import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string';
import axios from 'axios'
import { BACKEND_URL } from '../constants'
import {
  Text,
  Flex,
  Heading,
  Box,
  Button,
  Input
} from '@chakra-ui/react'

const Index = () => {
  const router = useRouter()

  const [queueName, setQueueName] = useState('')
  const [name, setName] = useState('')
  const handleNameChange = (event) => setName(event.target.value)

  useEffect(() => {
    // Based on queue id, call netlify function to create a ticket
    // for that queue, return the ticket id and redirect to ticket page
    const query = queryString.parse(location.search);
    if (query.id) {
      getQueue(query.id)
    }
  }, [])

  const getQueue = async (queue) => {
    try {
      const getQueueInfo = await axios.get(`https://api.trello.com/1/lists/${queue}`)
      console.log(getQueueInfo);
      const { name } = getQueueInfo.data
      setQueueName(name)
    } catch (err) {
      console.log(err.response);
    }
  }

  const joinQueue = async () => {
    const query = queryString.parse(location.search);
    console.log(name, query.id);
    try {
      const postJoinQueue = await axios.post(`${BACKEND_URL}/.netlify/functions/ticket?queue=${query.id}&name=${name}`)
      const { ticketId } = postJoinQueue.data
      console.log(ticketId);
      router.push(`/ticket?ticket=${ticketId}&queue=${query.id}`)
    } catch (err) {
      console.log(err.response);
    }
  }

  return (
    <Container>
      <Main>
        <Heading fontSize="32px" fontWeight="semi" textAlign="center">Joining</Heading>
        <Box>
          <Heading fontSize="64px" fontWeight="bold" textAlign="center">{queueName}</Heading>
        </Box>
        <Flex direction="column" alignItems="center">
          <Text fontSize="24px" >
            Please provide your name
            </Text>
          <Input placeholder="John Tan" size="lg" width="320px" fontSize="24px" my="20px"
            onChange={handleNameChange} />
          <Button width="180px" colorScheme="purple" size="lg" variant="outline" marginTop="10px"
            onClick={joinQueue}
          >Join</Button>
        </Flex>
      </Main>
    </Container >
  )
}

export default Index
