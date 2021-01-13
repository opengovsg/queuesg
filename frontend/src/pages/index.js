import {
  Heading,
  Flex,
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Link } from "@chakra-ui/react"

const Index = () => {
  return (
    <Container>
      <Main>
        <Flex direction='column' justifyContent="center" alignItems="center" height="100vh">
          <Heading fontSize="10vw">QueueSG</Heading>
          <Link href="/queue?id=5ffe9b5ed74ec20e4e4f8dc3">Try joining the demo queue</Link>
        </Flex>
      </Main>
    </Container>
  )
}

export default Index
