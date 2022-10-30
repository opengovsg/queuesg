import axios from 'axios'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  Heading,
  Box,
  Center,
  Text,
} from '@chakra-ui/react'
import queryString from 'query-string'
import QRCode from 'qrcode.react'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { NavBar } from '../components/Navbar'
import PeopleOnPhones from '../assets/svg/people-on-phones.svg'
import { API_ENDPOINT } from '../constants'
const Index = () => {
  const [url, setUrl] = useState('')
  const [boardName, setBoardName] = useState('')

  useEffect(async () => {
    const query = queryString.parse(location.search)
    if (query.queue) {
      setUrl(`${location.origin}/queue?id=${query.queue}`)
      await getQueue(query.queue)
    }
  }, [])

  const getQueue = async (queue) => {
    try {
      // Get the board queue belongs to this
      // 1. Verifies that queue actually exists
      // 2. Gets info stored as JSON in board description
      const getBoardQueueBelongsTo = await axios.get(`${API_ENDPOINT}/queue?id=${queue}`)
      const { name } = getBoardQueueBelongsTo.data
      setBoardName(name)
    } catch (err) {
      console.log('err', err);
    }
  }

  return (
    <>
      <Head>
        <title>{boardName}</title>
      </Head>
      <Container>
        <NavBar width="100%" maxWidth="600px" />
        <Main justifyContent="start" minHeight="auto" zIndex="1">
          <Box marginBottom="32px">
            <Heading
              textAlign="center"
              textStyle="display3"
              color="primary.500"
            >
              {boardName}
            </Heading>
            <Heading
              mt="24px"
              textAlign="center"
              textStyle="display2"
            >
              Scan QR Code to join the queue
            </Heading>
          </Box>
          <Box
            layerStyle="card"
            textAlign="center"
            py={10}
          >
            <Center>
              {url !== '' && <QRCode value={url} size={220} />}
            </Center>

            <Text
              textStyle="subtitle1"
              color="primary.500"
              mt={6}
            >
              {url}
            </Text>
          </Box>



        </Main>
        <Center marginTop="-40px" zIndex="0">
          <PeopleOnPhones
            width="500px"
          />
        </Center>
      </Container>
    </>
  )
}

export default Index
