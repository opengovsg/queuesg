import {
  Heading,
  Flex,
  Text,
  Button,
  Box
} from '@chakra-ui/react'
import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import QRCode from 'qrcode.react'
import queryString from 'query-string';
import { BACKEND_URL } from '../../constants'
import { AdminNav } from '../../components/AdminNav'
const Index = () => {

  const router = useRouter()

  const [queueCode, setQueueCode] = useState('')
  const [queueUrl, setQueueUrl] = useState('/')
  const [queueAdminUrl, setQueueAdminUrl] = useState('/')
  useEffect(() => {
    console.log('useEffect');
    const query = queryString.parse(location.search);
    // Join queue with code, server will return new ticket id
    if (query.queue) {
      axios.get(`${BACKEND_URL}/api/queue/${query.queue}/`)
        .then((resp) => {
          setQueueCode(query.queue)
          setQueueUrl(`${location.origin}/queue?code=${query.queue}`)
          setQueueAdminUrl(location.href)
        }).catch((err) => {
          if (err.response && err.response.status === 404) {
            router.push(`/`)
          }
        })

    }
  }, [])
  return (
    <Container>

      <Main>
        <AdminNav queue={queueCode} />
        <Flex direction="column" alignItems="center">
          <Heading fontSize="20px" fontWeight="bold" textAlign="start">Step 1: Save this page</Heading>
          <Text fontSize="20px" >This is a unique page created for your queue. </Text>
          <Button width="180px" colorScheme="purple" size="lg" variant="outline" marginTop="10px"
            onClick={() => { }}
          >Bookmark this page</Button>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Heading fontSize="20px" fontWeight="bold" textAlign="start">Step 2: Set wait time</Heading>
          <Text fontSize="20px" textAlign="center">Set an estimated waiting time per ticket.</Text>
          <Text fontSize="20px" >//TODO</Text>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Heading fontSize="20px" fontWeight="bold" textAlign="start">Step 3: Get QR Code</Heading>
          <Text fontSize="20px" >This is your unique QR code people can use to join your queue.</Text>
          <Box marginY="30px">
            <QRCode value={queueUrl} size={220} />
          </Box>

          <Button width="180px" colorScheme="purple" size="lg"
            onClick={() => { }}
          >Download to print</Button>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Heading fontSize="20px" fontWeight="bold" textAlign="start">Step 4: Share accss</Heading>
          <Text fontSize="20px" >Give access to your colleagues by sharing the link below with them</Text>
          <Text fontSize="20px" >{queueAdminUrl}</Text>
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
