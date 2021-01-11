import {
  Text,
  Code,
} from '@chakra-ui/react'
import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect } from 'react'
import queryString from 'query-string';
const Index = () => {
  let socket;

  useEffect(() => {
    console.log('useEffect');
    const query = queryString.parse(location.search);
    // If only present, means new
    // join the queue and get a ticket
    if (query.id) {
      console.log('ticket');
      // try {
      //   const resp = await axios.get(`http://localhost:4000/api/queue/${router.query.code}`)
      // } catch (error) {

      // }
      // router.replace(`/queue?ticket=12314`)
    }
  }, [])

  return (
    <Container>
      <Main>
        <Hero title='ticket' />
        <Text>
          Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code>.
      </Text>
      </Main>
    </Container>
  )
}

export default Index
