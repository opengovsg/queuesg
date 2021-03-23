import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import {
  Heading,
  Box,
  Center,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Admin/Navbar'

import { authentication } from '../../utils'

const Index = () => {
  const router = useRouter()

  /**
   * Logout the user and delete the token from api
   */
  const logout = async () => {
    const token = authentication.getToken()
    const key = authentication.getKey()

    try {
      const response = await axios.delete(`https://api.trello.com/1/tokens/${token}?key=${key}&token=${token}`)

      if (response.status < 300 && response.status >= 200) {
        console.log('deleted', response.status)
        authentication.logout()
      }
    } catch (error) {
      console.error(error)
    } finally {
      router.push("/admin/login")
    }
  }

  useEffect(() => {
    logout()
  },[])

  return (
    <Container>
      <NavBar width="100%" />
      <Main minHeight="90vh" width="100%">
        <Center flexDir="column">
          <Spinner size="xl" mb="10" />
          <Text
            textStyle="heading2"
            >
            Logging Out...
          </Text>
        </Center>
      </Main>
    </Container>
  )
}

export default Index
