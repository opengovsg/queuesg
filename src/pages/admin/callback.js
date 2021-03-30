import { useEffect } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import {
  Center,
  Spinner,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import {
  Navbar
} from '../../components/Admin'
import { authentication } from '../../utils'

const Index = () => {
  const router = useRouter()

  const login = async () => {
    const query = queryString.parse(location.search)
    const hash = queryString.parse(location.hash)

    authentication.login(query.key, hash.token)
    router.push(`/admin?boardId=${query.boardId}`)
  }

  useEffect(() => {
    login()
  }, [])

  return (
    <Container>
      <Navbar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <Center>
          <Spinner />
        </Center>
      </Main>
    </Container>
  )
}

export default Index
