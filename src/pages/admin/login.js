import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
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
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  const [authoriseUrl, setAuthoriseUrl] = useState()

  const getAuthorisationUrl = async (queueId) => {
    const response = await axios.post(`/.netlify/functions/authorize`, {
      queueId,
    })
    setAuthoriseUrl(response.data.authorizeUrl)
  }

  useEffect(() => {
    const query = queryString.parse(location.search)
    let queueId = query.queueId

    if (queueId) {
      getAuthorisationUrl(queueId)
    } else {
      queueId = prompt("Please enter your queue id", "E.g. Yg9jAKfn")
      window.location.href = `/admin/login?queueId=${queueId}`
    }
  },[])

  return (
    <Container>
      <NavBar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <a href={authoriseUrl} target="_blank">
          {authoriseUrl}
        </a>
      </Main>
    </Container>
  )
}

export default Index
