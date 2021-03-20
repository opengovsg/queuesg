import { useEffect } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import {
  Center,
  Spinner,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Navbar'
import { authentication } from '../../utils'

const Index = () => {
  const router = useRouter()

  const login = async () => {
    const query = queryString.parse(location.search)
    const hash = queryString.parse(location.hash)

    authentication.login(query.key, hash.token)
    router.push(`/admin?queueId=${query.queue}`)
  }

  useEffect(() => {
    login()
  }, [])

  return (
    <Container>
      <NavBar width="100%" maxWidth="600px" />
      <Main justifyContent="start" minHeight="90vh" zIndex="1">
        <Center>
          <Spinner />
        </Center>
      </Main>
    </Container>
  )
}

export default Index
