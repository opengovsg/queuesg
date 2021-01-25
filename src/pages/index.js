import {
  Heading,
  Center,
  Box,
  Button
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import useTranslation from 'next-translate/useTranslation'
import { NavBar } from '../components/Navbar'
import Link from 'next/link'

import PeopleOnPhones from '../assets/svg/people-on-phones.svg'

const Index = () => {
  const { t, lang } = useTranslation('common')
  return (
    <Container>
      <NavBar />
      <Main>
        <Box>
          <Heading
            textStyle="heading3"
            textAlign="center"
            mb={8}
            >
            {t('demo-title')}
          </Heading>
          <Center>
            <PeopleOnPhones
              className="featured-image"
            />
          </Center>
          <Center
            mt="4rem"
            >
            <Link
              href="/queue?id=5ffe9b5ed74ec20e4e4f8dc3"
              >
              <Button
                bgColor="primary.500"
                borderRadius="3px"
                isFullWidth={true}
                color="white"
                size="lg"
                variant="solid"
                type="submit"
              >
                {t('try-the-demo')}
              </Button>
            </Link>
          </Center>
        </Box>
      </Main>
      <Footer />
    </Container>
  )
}

export default Index
