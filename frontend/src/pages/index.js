import {
  Heading,
  Center,
  Box,
  Button,
  Text
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import useTranslation from 'next-translate/useTranslation'
import { NavBar } from '../components/Navbar'
import Link from 'next/link'

const Index = () => {
  const { t, lang } = useTranslation('common')
  return (
    <Container>
      <NavBar />
      <Main>
        <Box>
          <Heading
            textStyle="display2"
            textAlign="center"
            >
            {t('demo-title')}
          </Heading>
          <Heading
            textStyle="display2"
            textAlign="center"
            mt="2rem"
            color="accent.500"
            >
            queue.gov.sg
          </Heading>
          <Center
            mt="4rem"
            >
            <Button
              bgColor="primary.500"
              borderRadius="3px"
              color="white"
              size="lg"
              variant="solid"
              type="submit"
            >
              <Link
                href="/queue?id=5ffe9b5ed74ec20e4e4f8dc3"
                >
                {t('try-the-demo')}
              </Link>
            </Button>
          </Center>
        </Box>
      </Main>
    </Container>
  )
}

export default Index
