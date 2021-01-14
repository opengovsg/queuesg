import {
  Heading,
  Flex,
  Box, Text, Link, Button
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Main } from '../components/Main'

const Index = () => {
  return (
    <Container>
      <Main>
        <Box>
          <Heading fontSize="32px" fontWeight="semi" textAlign="center">Welcome to</Heading>
          <Heading fontSize="64px" fontWeight="bold" textAlign="center" >QueueSG</Heading>
          <Text fontSize="24px" textAlign="center" my="30px" textDecoration="underline">
            <Link href="/queue?id=5ffe9b5ed74ec20e4e4f8dc3">Try the demo</Link>
          </Text>
          <DarkModeSwitch />
        </Box>
      </Main>
    </Container>
  )
}

export default Index
