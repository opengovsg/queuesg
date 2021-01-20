import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import axios from 'axios'
import { NavBar } from '../components/Navbar'

import ManWithHourglass from "../../src/assets/svg/man-with-hourglass.svg"

import {
  Text,
  Flex,
  Box,
  Button,
  Input,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
const Index = () => {
  const { t, lang } = useTranslation('common')
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
      const getBoardQueueBelongsTo = await axios.get(`/.netlify/functions/queue?id=${queue}`)
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
      const url = `/ticket?queue=${query.id}&ticket=${ticketId}&ticketNumber=${ticketNumber}`
      router.push(url, url, { locale: lang })
    } catch (err) {
      console.log(err.response);
    }
  }

  return (
    <Container>
      <NavBar />
      <Main>
        <Flex direction="column" alignItems="center">
          <Text textStyle="display3" color="primary.500" fontWeight="400" textAlign="center">{t('queue-welcome-message')}</Text>
          <Text textStyle="display3" textAlign="center">{boardName}</Text>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Flex direction="column" alignItems="center">
            <ManWithHourglass
              style={{ width: '200px', maxWidth: '100%' }}
            />
          </Flex>
          <Box
            layerStyle="card"
          >
            <form
              onSubmit={submit}
            >
              <Flex direction="column">
                <Text
                  pb="0.5rem"
                  textStyle="subtitle1"
                >
                  {t('your-name')}
                </Text>
                <Input
                  layerStyle="formInput"
                  name="name"
                  required
                />
                <Text
                  pt="0.5rem"
                  pb="0.5rem"
                  textStyle="subtitle1"
                >
                  {t('mobile-number')}
                </Text>
                <Input
                  layerStyle="formInput"
                  name="phone"
                  pattern="^(8|9)(\d{7})$" required
                  title="contact should be an 8 digit Singapore number i.e. 8xxxxxxx" />
                {/* For POC, fix the 2 fields to name and contact */}
                {/* {registrationFields.map((val, index) => {
                  return <Input key={index} placeholder={val} size="lg" width="320px" fontSize="24px" my="10px" />
                })} */}
                <Button
                  bgColor="primary.500"
                  borderRadius="3px"
                  isFullWidth={true}
                  color="white"
                  size="lg"
                  variant="solid"
                  marginTop="10px"
                  type="submit"
                >
                  {t('join-queue')}
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Main>
      <Footer />
    </Container>
  )
}


export default Index
