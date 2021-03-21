import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import {
  Button,
  Heading,
  Box,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Admin/Navbar'

import { authentication } from '../../utils'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  const [authoriseUrl, setAuthoriseUrl] = useState()

  const getAuthorisationUrl = async (boardId) => {
    const response = await axios.post(`/.netlify/functions/authorize`, {
      boardId,
    })
    setAuthoriseUrl(response.data.authorizeUrl)
  }

  useEffect(() => {
    const query = queryString.parse(location.search)
    let boardId = query.boardId

    if (boardId) {
      getAuthorisationUrl(boardId)
    } else {
      boardId = prompt("Please enter your board id", "E.g. Yg9jAKfn")
      window.location.href = `/admin/login?boardId=${boardId}`
    }
  },[])

  /**
   * Go to Trello to authorise the app
   */
  const authoriseApp = () => {
    window.location.href = authoriseUrl
  }

  return (
    <Container>
      <NavBar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <Center>
          <Button
            flex
            maxW="300px"
            colorScheme="primary"
            borderRadius="3px"
            color="white"
            variant="solid"
            size="lg"
            onClick={authoriseApp}
          >
            Login
          </Button>
        </Center>
      </Main>
    </Container>
  )
}

export default Index
