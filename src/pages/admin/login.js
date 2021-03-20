import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Heading,
  Box,
  Center,
  Text,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Navbar'

import { authentication } from '../../utils'

const Index = () => {
  const [authoriseUrl, setAuthoriseUrl] = useState()

  const getAuthorisationUrl = async () => {
    const response = await axios.post(`/.netlify/functions/authorize`, {
      queueId: "Yg5jNKgn"
    })
    setAuthoriseUrl(response.data.authorizeUrl)
  }

  useEffect(() => {
    getAuthorisationUrl()
  },[])

  return (
    <Container>
      <NavBar width="100%" maxWidth="600px" />
      <Main justifyContent="start" minHeight="auto" zIndex="1">
        <a href={authoriseUrl} target="_blank">
          {authoriseUrl}
        </a>
      </Main>
    </Container>
  )
}

export default Index
