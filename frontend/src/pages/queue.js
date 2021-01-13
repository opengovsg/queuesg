import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string';
import axios from 'axios'
import { Hero } from '../components/Hero'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    console.log('useEffect');

    // Based on queue id, call netlify function to create a ticket
    // for that queue, return the ticket id and redirect to ticket page
    const query = queryString.parse(location.search);
    if (query.id) {
      console.log(query.id);
      axios.post(`http://localhost:8888/.netlify/functions/ticket?name=bob`)
        .then((resp) => {
          const { ticketId } = resp.data
          console.log(ticketId);
          router.push(`/ticket?ticket=${ticketId}&queue=${query.id}`)
        }).catch((err) => { console.log(err) })
    }
  }, [])

  return (
    <Container>
      <Main>
        <Hero title='Join Queue' />
      </Main>
    </Container>
  )
}

export default Index
