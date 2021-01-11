import {
  Text,
  Code,
  Heading,
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'

const Index = () => (
  <Container>
    <Main>
      <Heading fontSize="80px">Index page</Heading>
      <Text>
        Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code>.
      </Text>
    </Main>

  </Container>
)

export default Index
