import {
  Text,
  Code,
  Heading,
  Flex,
} from '@chakra-ui/react'
import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'

const Index = () => (
  <Container>
    <Main>
      <Hero title='QueueSG' />
    </Main>
  </Container>
)

export default Index
