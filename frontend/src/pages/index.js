import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Flex,
  Center,
  Square,
  Box,
  Heading,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'

const Index = () => (
  <Container>

    <Main>
      <Heading fontSize="72px" textColor='blue'>Index page</Heading>
      <Text>
        Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code>.
      </Text>
    </Main>

  </Container>
)

export default Index
