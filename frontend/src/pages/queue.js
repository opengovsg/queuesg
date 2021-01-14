import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string';
import axios from 'axios'
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

  const [boardName, setBoardName] = useState('')
  const [message, setMessage] = useState('')
  const [registrationFields, setRegistrationFields] = useState([])
  useEffect(() => {
    const query = queryString.parse(location.search);
    // Based on queue id, check if queue exists 
    if (query.id) {
      getQueue(query.id)
    }
  }, [])

  const getQueue = async (queue) => {
    try {
      // Get the board queue belongs to this
      // 1. Verifies that queue actually exists
      // 2. Gets info stored as JSON in board description
      const getBoardQueueBelongsTo = await axios.get(`https://api.trello.com/1/lists/${queue}/board?fields=id,name,desc`)
      const { name, desc } = getBoardQueueBelongsTo.data
      setBoardName(name)
      const boardInfo = JSON.parse(desc)
      setMessage(boardInfo.message)
      setRegistrationFields(boardInfo.registrationFields)
    } catch (err) {
      console.log(err.response);
    }
  }

  const submit = async (e) => {
    try {
      e.preventDefault()
      // THIS IS A HACK to dynamically get values of our generated inputs
      // We can't use ref / controlled components as we want to generate fields
      // on the fly from JSON
      let desc = {}
      registrationFields.forEach((key, index) => {
        if (e.target[index].value !== '') {
          desc[key] = e.target[index].value
        }
      });
      // call netlify function to create a ticket
      // for that queue, return the ticket id and redirect to ticket page
      const query = queryString.parse(location.search);
      const postJoinQueue = await axios.post(`/.netlify/functions/ticket?queue=${query.id}`, { desc: desc })
      const { ticketId, ticketNumber } = postJoinQueue.data
      console.log(ticketId);
      router.push(`/ticket?queue=${query.id}&ticket=${ticketId}&ticketNumber=${ticketNumber}`)
    } catch (err) {
      console.log(err.response);
    }
  }

  return (
    <Container>
      <Main>
        <Flex direction="column" alignItems="center">
          <Heading fontSize="32px" fontWeight="semi" textAlign="center">Welcome to</Heading>
          <Heading fontSize="64px" fontWeight="bold" textAlign="center">{boardName}</Heading>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Text fontSize="24px" width="400px" textAlign="center">
            {message}
          </Text>
        </Flex>
        <Flex direction="column" alignItems="center">

          <form onSubmit={submit} >
            <Flex direction="column" alignItems="center">
              {registrationFields.map((val, index) => {
                return <Input key={index} placeholder={val} size="lg" width="320px" fontSize="24px" my="10px" />
              })}
              <Button width="180px" colorScheme="purple" size="lg" variant="outline" marginTop="10px"
                type="submit"
              >Join</Button>
            </Flex>
          </form>
        </Flex>
      </Main>
    </Container >
  )
}


export default Index
