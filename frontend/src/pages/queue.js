import {
  Text,
  Code,
} from '@chakra-ui/react'
import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import queryString from 'query-string';
const Index = () => {

  const router = useRouter()
  useEffect(() => {
    console.log('useEffect');
    const query = queryString.parse(location.search);
    // Join queue with code, server will return new ticket id
    if (query.code) {
      axios.post(`http://localhost:4000/api/queue/${query.code}/join`)
        .then((resp) => {
          const { ticketId } = resp.data
          router.push(`/ticket?queue=${query.code}&ticket=${ticketId}`)
        }).catch((err) => { console.log(err) })

    }
  }, [])

  return (
    <Container>

      <Main>
        <Hero title='queue' />
        <Text>
          Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code>.
      </Text>
      </Main>
    </Container>
  )
}

export default Index
